<?php
ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');

function responder(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    responder(405, ['ok' => false, 'erro' => 'Método não permitido.']);
}

$configPath = __DIR__ . '/config.php';
if (!is_file($configPath)) {
    responder(500, ['ok' => false, 'erro' => 'Configuração ausente.']);
}
$config = require $configPath;
$apiKey = getenv('RESEND_API_KEY') ?: ($config['resend_api_key'] ?? '');

// Honeypot: bots preenchem o campo oculto.
// Responde 200 para não dar pista ao bot, mas marca registrado=false para o
// front não contabilizar conversão de algo que nunca virou e-mail.
if (!empty($_POST['site'])) {
    responder(200, ['ok' => true, 'registrado' => false]);
}

$campo = fn(string $nome, int $max) => mb_substr(trim((string) ($_POST[$nome] ?? '')), 0, $max);

$nome = $campo('nome', 120);
$email = $campo('email', 200);
$telefone = $campo('telefone', 40);
$servico = $campo('servico', 120);

// O formulário tem duas etapas. A etapa 2 reenvia os dados da etapa 1 junto
// com os opcionais, para o segundo e-mail chegar com todas as respostas.
$etapa = ($_POST['etapa'] ?? '1') === '2' ? 2 : 1;
$empresa = $etapa === 2 ? $campo('empresa', 160) : '';
$local = $etapa === 2 ? $campo('local', 160) : '';
$mensagem = $etapa === 2 ? $campo('mensagem', 5000) : '';

if ($nome === '' || $telefone === '' || $servico === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    responder(422, ['ok' => false, 'erro' => 'Preencha nome, e-mail válido, telefone e serviço de interesse.']);
}

// WhatsApp: celular brasileiro com DDD existente. Mesmas regras do front (src/js/form-contato.js).
$digitos = preg_replace('/\D/', '', $telefone);
if (strlen($digitos) > 11 && substr($digitos, 0, 2) === '55') {
    $digitos = substr($digitos, 2);
}
$digitos = ltrim($digitos, '0');

$ddds = [11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28,
    31, 32, 33, 34, 35, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49,
    51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74,
    75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94,
    95, 96, 97, 98, 99];
$assinante = substr($digitos, 3);

if (
    strlen($digitos) !== 11
    || !in_array((int) substr($digitos, 0, 2), $ddds, true)
    || $digitos[2] !== '9'
    || preg_match('/^(\d)\1+$/', $assinante)
    || in_array($assinante, ['12345678', '87654321'], true)
) {
    responder(422, ['ok' => false, 'erro' => 'Informe um número de WhatsApp válido, com DDD, como (11) 99876-5432.']);
}

// Padroniza o formato no e-mail recebido.
$telefone = sprintf('(%s) %s-%s', substr($digitos, 0, 2), substr($digitos, 2, 5), substr($digitos, 7));

// Etapa 2 sem nada preenchido equivale a pular: o e-mail da etapa 1 já saiu.
if ($etapa === 2 && $empresa === '' && $local === '' && $mensagem === '') {
    responder(200, ['ok' => true, 'registrado' => false]);
}

$e = fn(string $v) => htmlspecialchars($v, ENT_QUOTES, 'UTF-8');

$linhas = [
    'Nome' => $nome,
    'E-mail' => $email,
    'Telefone/WhatsApp' => $telefone,
    'Serviço de interesse' => $servico,
];
if ($etapa === 2) {
    $linhas['Empresa'] = $empresa !== '' ? $empresa : '—';
    $linhas['Local da empresa'] = $local !== '' ? $local : '—';
}

$titulo = $etapa === 2 ? 'Contato completo pelo site' : 'Novo contato pelo site';
$selo = $etapa === 2 ? 'Etapa 2 de 2 · todas as respostas' : 'Etapa 1 de 2 · lead recebido';
$whatsappLink = 'https://wa.me/55' . $digitos;

$linhasHtml = '';
foreach ($linhas as $rotulo => $valor) {
    $linhasHtml .= '<tr>'
        . '<td style="padding:10px 0;border-bottom:1px solid #f0edf7;font-size:13px;color:#675496;font-weight:600;white-space:nowrap;vertical-align:top;width:1%;">' . $e($rotulo) . '</td>'
        . '<td style="padding:10px 0 10px 16px;border-bottom:1px solid #f0edf7;font-size:15px;color:#1e293b;">' . $e($valor) . '</td>'
        . '</tr>';
}

$mensagemHtml = '';
if ($mensagem !== '') {
    $mensagemHtml = '
        <tr><td style="padding:28px 32px 0;">
            <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#675496;text-transform:uppercase;letter-spacing:.04em;">Como posso ajudar sua empresa hoje?</p>
            <p style="margin:0;padding:16px 18px;background:#f8f1f6;border-radius:12px;font-size:15px;line-height:1.6;color:#1e293b;">' . nl2br($e($mensagem)) . '</p>
        </td></tr>';
}

$html = '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' . $e($titulo) . '</title></head>'
    . '<body style="margin:0;padding:0;background:#f8f1f6;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">'
    . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8f1f6;padding:32px 16px;">'
    . '<tr><td align="center">'
    . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;">'
    . '<tr><td style="background:#675496;padding:28px 32px;">'
    . '<p style="margin:0;font-size:14px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#ffffff;opacity:.85;">Dani Bezerra · Consultoria Digital</p>'
    . '<h1 style="margin:8px 0 0;font-size:22px;font-weight:800;color:#ffffff;">' . $e($titulo) . '</h1>'
    . '<p style="margin:6px 0 0;font-size:13px;color:#ffffff;opacity:.8;">' . $e($selo) . '</p>'
    . '</td></tr>'
    . '<tr><td style="padding:28px 32px 0;">'
    . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' . $linhasHtml . '</table>'
    . '</td></tr>'
    . $mensagemHtml
    . '<tr><td style="padding:28px 32px 32px;">'
    . '<a href="' . $e($whatsappLink) . '" style="display:inline-block;background:#675496;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:13px 22px;border-radius:999px;">Responder no WhatsApp</a>'
    . '<a href="mailto:' . $e($email) . '" style="display:inline-block;margin-left:10px;color:#675496;text-decoration:none;font-size:15px;font-weight:700;padding:13px 10px;">Responder por e-mail</a>'
    . '</td></tr>'
    . '<tr><td style="padding:18px 32px;background:#fefbff;border-top:1px solid #f0edf7;">'
    . '<p style="margin:0;font-size:12px;color:#1e293b;opacity:.55;">Enviado automaticamente pelo formulário em danibezerra.com. Responda diretamente este e-mail — o campo "Responder" já está configurado para ' . $e($email) . '.</p>'
    . '</td></tr>'
    . '</table>'
    . '</td></tr>'
    . '</table>'
    . '</body></html>';

$texto = "$titulo\n\n";
foreach ($linhas as $rotulo => $valor) {
    $texto .= "$rotulo: $valor\n";
}
if ($mensagem !== '') {
    $texto .= "\nComo posso ajudar sua empresa hoje?\n$mensagem\n";
}

$payload = [
    'from' => $config['from'],
    'to' => [$config['to']],
    'reply_to' => $email,
    'subject' => ($etapa === 2 ? 'Contato completo: ' : 'Novo contato: ') . "$nome ($servico)",
    'html' => $html,
    'text' => $texto,
];

$ch = curl_init('https://api.resend.com/emails');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 15,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
]);
$resposta = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$erroCurl = curl_error($ch);

if ($resposta === false || $status < 200 || $status >= 300) {
    error_log("Resend falhou ($status): " . ($erroCurl ?: $resposta));
    responder(502, ['ok' => false, 'erro' => 'Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.']);
}

// registrado=true: o e-mail saiu de fato. É o que autoriza o front a
// contabilizar a conversão no GA4/GTM.
responder(200, ['ok' => true, 'registrado' => true]);
