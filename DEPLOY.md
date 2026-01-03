# Deploy Instructions

## Hash Routing

Este site usa **Hash Router** (`/#/`) em vez de BrowserRouter para garantir compatibilidade com hospedagem estática.

## Plataformas de Deploy

### GitHub Pages
1. Faça upload da pasta `dist` para a branch `gh-pages`
2. Configure GitHub Pages para usar a branch `gh-pages`
3. O site estará disponível em: `https://[username].github.io/[repo]/#/`

### Netlify
1. Arraste a pasta `dist` para o Netlify
2. O arquivo `_redirects` cuidará do roteamento automaticamente
3. URLs funcionarão como: `https://[site].netlify.app/#/`

### Vercel
1. Conecte seu repositório ao Vercel
2. Configure o build command: `npm run build`
3. Configure output directory: `dist`
4. URLs funcionarão como: `https://[site].vercel.app/#/`

### Apache Server
1. Faça upload da pasta `dist`
2. O arquivo `.htaccess` cuidará do roteamento
3. URLs funcionarão como: `https://[site].com/#/`

### Outros Servidores Estáticos
1. Use a pasta `dist`
2. Configure redirecionamento 404 para `index.html` se necessário
3. URLs funcionarão como: `https://[site].com/#/`

## URLs das Páginas

- Home: `/#/`
- Serviços: `/#/Servicos`
- Nichos: `/#/Nichos`
- Portfólio: `/#/Portfolio`
- FAQ: `/#/FAQ`
- Contato: `/#/Contato`
- Política: `/#/Politica`
- Obrigado: `/#/Obrigado`

## Build Command
```bash
npm run build
```

## Teste Local
```bash
npm run preview
```
