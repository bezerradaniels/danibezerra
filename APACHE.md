# Configuração Apache

## Arquivo .htaccess

O projeto inclui um arquivo `.htaccess` completo na pasta `public` que será copiado para o `dist` durante o build.

## Funcionalidades

### 1. Roteamento SPA
- Redireciona todas as requisições não-arquivos para `index.html`
- Permite que o React Router lide com as rotas

### 2. Cache
- HTML/CSS/JS: Cache de 1 ano
- Imagens: Cache de 1 ano  
- Fontes: Cache de 1 ano com CORS

### 3. Compressão GZIP
- Comprime automaticamente HTML, CSS, JS, JSON, XML

### 4. Segurança
- Proteção contra XSS
- Previne clickjacking
- Controla tipo de conteúdo
- Política de referência

### 5. Proteção de Arquivos
- Bloqueia acesso a arquivos ocultos
- Bloqueia acesso a arquivos sensíveis

## Deploy

### Upload via FTP
1. Faça upload do conteúdo da pasta `dist`
2. Mantenha o arquivo `.htaccess` na raiz
3. Garanta que o servidor Apache tenha `mod_rewrite` ativado

### Hosts Comuns
- **Hostinger**: Funciona automaticamente
- **cPanel**: Funciona automaticamente  
- **Plesk**: Pode precisar ativar `mod_rewrite`
- **Hospedagens brasileiras**: Na maioria funciona

## Troubleshooting

### Erro 500
Se ocorrer erro 500, use a versão simplificada:
1. Renomeie `.htaccess.simple` para `.htaccess`
2. Ou remova o arquivo e use apenas Hash Router

### Links não funcionam
1. Verifique se `mod_rewrite` está ativo
2. Verifique permissões do arquivo `.htaccess` (644)
3. Teste com a versão simplificada

### Forçar HTTPS
Descomente as linhas 49-53 no `.htaccess` se tiver SSL configurado.

## Verificação
Para testar se está funcionando:
1. Acesse `https://seusite.com/#/Servicos`
2. Recarregue a página (F5)
3. Deve carregar a página de Serviços corretamente
