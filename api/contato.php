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

// WhatsApp: celular brasileiro com DDD existente. Mesmas regras do front (index.html).
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

$titulo = $etapa === 2 ? 'Contato completo pelo site (etapa 2)' : 'Novo contato pelo site';

$html = '<h2>' . $e($titulo) . '</h2><table cellpadding="6">';
foreach ($linhas as $rotulo => $valor) {
    $html .= '<tr><td><strong>' . $e($rotulo) . '</strong></td><td>' . $e($valor) . '</td></tr>';
}
$html .= '</table>';
if ($mensagem !== '') {
    $html .= '<h3>Como posso ajudar sua empresa hoje?</h3><p>' . nl2br($e($mensagem)) . '</p>';
}

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
