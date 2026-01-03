#!/bin/bash

echo "🚀 Iniciando deploy do site..."

# Build do projeto
echo "📦 Fazendo build do projeto..."
npm run build

# Verificar se o build foi bem-sucedido
if [ ! -d "dist" ]; then
    echo "❌ Build falhou!"
    exit 1
fi

echo "✅ Build concluído com sucesso!"
echo "📁 Arquivos gerados:"
ls -la dist/

echo ""
echo "🌐 Para testar localmente:"
echo "   npm run preview"
echo ""
echo "📋 Para deploy na raiz do domínio:"
echo "   1. Faça push do código para o repositório"
echo "   2. Configure o GitHub Pages para usar a branch 'gh-pages' ou 'main'"
echo "   3. Defina o source como '/ (root)'"
echo "   4. O site estará disponível em https://[seu-dominio].com/"
