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
$mensagem = $campo('mensagem', 5000);

if ($nome === '' || $telefone === '' || $servico === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    responder(422, ['ok' => false, 'erro' => 'Preencha nome, e-mail válido, telefone e serviço de interesse.']);
}

$e = fn(string $v) => htmlspecialchars($v, ENT_QUOTES, 'UTF-8');

$linhas = [
    'Nome' => $nome,
    'E-mail' => $email,
    'Telefone/WhatsApp' => $telefone,
    'Serviço de interesse' => $servico,
];

$html = '<h2>Novo contato pelo site</h2><table cellpadding="6">';
foreach ($linhas as $rotulo => $valor) {
    $html .= '<tr><td><strong>' . $e($rotulo) . '</strong></td><td>' . $e($valor) . '</td></tr>';
}
$html .= '</table>';
if ($mensagem !== '') {
    $html .= '<h3>Mensagem</h3><p>' . nl2br($e($mensagem)) . '</p>';
}

$texto = "Novo contato pelo site\n\n";
foreach ($linhas as $rotulo => $valor) {
    $texto .= "$rotulo: $valor\n";
}
if ($mensagem !== '') {
    $texto .= "\nMensagem:\n$mensagem\n";
}

$payload = [
    'from' => $config['from'],
    'to' => [$config['to']],
    'reply_to' => $email,
    'subject' => "Novo contato: $nome ($servico)",
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
