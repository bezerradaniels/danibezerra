# DaniBezerra - Site Institucional

Site institucional e portfólio profissional desenvolvido com React, TypeScript e Tailwind CSS, com painel administrativo integrado.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-Database-3FCF8E?logo=supabase)

## 🚀 Funcionalidades

### Site Público
- **Home** - Apresentação com Hero, serviços, soluções, nichos e portfólio
- **Serviços** - Detalhamento dos serviços oferecidos
- **Nichos** - Segmentos de mercado atendidos
- **Portfólio** - Galeria de projetos realizados
- **FAQ** - Perguntas frequentes
- **Contato** - Formulário de orçamento com integração Supabase

### Painel Administrativo (`/admin`)
- **Login** - Autenticação com credenciais
- **Dashboard** - Visão geral e acesso rápido
- **Editor Hero** - Edição do título e subtítulo da home
- **Editor Portfólio Home** - Gerenciamento do slider de projetos
- **Editor Portfólio Página** - Gerenciamento dos cards de projetos
- **Editor Planos** - Configuração de preços e recursos

## 🛠️ Tecnologias

| Tecnologia | Uso |
|------------|-----|
| **React 19** | Framework frontend |
| **TypeScript** | Tipagem estática |
| **Vite** | Build tool e dev server |
| **Tailwind CSS 4** | Estilização |
| **React Router** | Roteamento SPA |
| **Supabase** | Banco de dados e storage |
| **Resend** | Envio de emails (Edge Function) |

## 📁 Estrutura do Projeto

```
src/
├── admin/                    # Painel administrativo
│   ├── components/           # Componentes do admin
│   │   ├── AdminLayout.tsx   # Layout com sidebar
│   │   └── ProtectedRoute.tsx# Proteção de rotas
│   ├── context/              # Contextos React
│   │   ├── AuthContext.tsx   # Autenticação
│   │   └── SiteDataContext.tsx# Dados do site
│   └── pages/                # Páginas do admin
│       ├── Dashboard.tsx
│       ├── HeroEditor.tsx
│       ├── Login.tsx
│       ├── PlanosEditor.tsx
│       ├── PortfolioHomeEditor.tsx
│       └── PortfolioPageEditor.tsx
├── app/                      # Configuração do app
│   ├── App.tsx               # Componente principal
│   └── routes.ts             # Definição de rotas
├── components/               # Componentes reutilizáveis
│   ├── layout/               # Componentes de layout
│   └── ui/                   # Componentes de UI
├── hooks/                    # Custom hooks
├── lib/                      # Bibliotecas e configs
│   └── supabase.ts           # Cliente Supabase
├── pages/                    # Páginas públicas
│   ├── Contato/
│   ├── FAQ/
│   ├── Home/
│   ├── Nichos/
│   ├── Obrigado/
│   ├── Politica/
│   ├── Portfolio/
│   └── Servicos/
└── styles/                   # Estilos globais
    └── index.css

supabase/
└── functions/                # Edge Functions
    └── send-contact-email/   # Envio de email via Resend
```

## ⚡ Início Rápido

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta no Supabase
- Conta no Resend (para emails)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/bezerradaniels/danibezerra.git
cd danibezerra

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# Inicie o servidor de desenvolvimento
npm run dev
```

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

## 🔐 Acesso ao Admin

- **URL:** `/admin/login`
- **Usuário:** `admin`
- **Senha:** `dani2024`

> ⚠️ **Importante:** Altere as credenciais em produção editando `src/admin/context/AuthContext.tsx`

## 📦 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Gera build de produção |
| `npm run preview` | Preview do build de produção |
| `npm run lint` | Executa linter |

## 🗄️ Configuração do Supabase

Consulte o arquivo [CHECKLIST-CONFIGURACAO.md](./CHECKLIST-CONFIGURACAO.md) para um guia detalhado de configuração do Supabase e Resend.

### Resumo das Tabelas

**`contatos`** - Armazena submissões do formulário de contato
```sql
CREATE TABLE contatos (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  empresa TEXT,
  projeto TEXT,
  mensagem TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**`site_config`** - Armazena configurações editáveis do site
```sql
CREATE TABLE site_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  hero JSONB,
  portfolio_home JSONB,
  portfolio_page JSONB,
  plans JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 📧 Configuração de Emails

O projeto usa **Supabase Edge Functions** com **Resend** para enviar notificações de novos contatos.

1. Configure a API Key do Resend nas secrets da Edge Function
2. Configure o Database Webhook para disparar a função em novos inserts
3. Veja detalhes em [CHECKLIST-CONFIGURACAO.md](./CHECKLIST-CONFIGURACAO.md)

## 🚀 Deploy

### Netlify (Recomendado)

1. Conecte o repositório ao Netlify
2. Configure as variáveis de ambiente
3. Build command: `npm run build`
4. Publish directory: `dist`

### Vercel

1. Importe o projeto no Vercel
2. Configure as variáveis de ambiente
3. O Vercel detecta automaticamente as configurações do Vite

## 📄 Licença

Este projeto é privado e de uso exclusivo de Dani Bezerra.

## 👤 Autor

**Dani Bezerra**
- Website: [danibezerra.com](https://danibezerra.com)
- GitHub: [@bezerradaniels](https://github.com/bezerradaniels)

---

Desenvolvido com 💚 por Dani Bezerra
