# Checklist de Configuração - Supabase + Resend

Este guia passo a passo ajuda a verificar se tudo está corretamente configurado para o funcionamento do formulário de contato com envio de emails.

---

## 📋 PARTE 1: SUPABASE - Configuração do Banco de Dados

### 1.1 Acessar o Supabase
- [ ] Acesse: https://supabase.com/dashboard
- [ ] Faça login com sua conta
- [ ] Selecione o projeto **daniBezerra**

### 1.2 Verificar Tabela `contatos`
**Onde:** Menu lateral → **Table Editor**

- [ ] Clique em **Table Editor** no menu lateral esquerdo
- [ ] Procure a tabela chamada `contatos` na lista
- [ ] Se a tabela **NÃO existir**, vá para o passo 1.3
- [ ] Se a tabela **existir**, verifique se tem estas colunas:
  - [ ] `id` (integer, primary key)
  - [ ] `nome` (text)
  - [ ] `email` (text)
  - [ ] `whatsapp` (text)
  - [ ] `empresa` (text)
  - [ ] `projeto` (text)
  - [ ] `mensagem` (text)
  - [ ] `created_at` (timestamp)

### 1.3 Criar Tabela `contatos` (se não existir)
**Onde:** Menu lateral → **SQL Editor**

- [ ] Clique em **SQL Editor** no menu lateral esquerdo
- [ ] Clique em **+ New query**
- [ ] Cole o seguinte código:

```sql
CREATE TABLE IF NOT EXISTS contatos (
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

- [ ] Clique no botão **Run** (verde, canto inferior direito)
- [ ] Verifique se aparece "Success" na aba Results

### 1.4 Configurar Políticas de Segurança (RLS)
**Onde:** Menu lateral → **SQL Editor**

- [ ] No SQL Editor, crie uma **nova query**
- [ ] Cole o seguinte código:

```sql
-- Habilitar RLS
ALTER TABLE contatos ENABLE ROW LEVEL SECURITY;

-- Permitir inserção pública (para o formulário funcionar)
CREATE POLICY "Permitir inserção pública" ON contatos
  FOR INSERT WITH CHECK (true);

-- Permitir leitura (para o admin)
CREATE POLICY "Permitir leitura" ON contatos
  FOR SELECT USING (true);
```

- [ ] Clique em **Run**
- [ ] Se aparecer erro "policy already exists", está OK (já foi criada antes)

### 1.5 Verificar Tabela `site_config`
**Onde:** Menu lateral → **Table Editor**

- [ ] Procure a tabela `site_config` na lista
- [ ] Se **NÃO existir**, execute no SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS site_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  hero JSONB DEFAULT '{"title": "Transforme sua presença digital em resultados reais", "subtitle": "Sites sob medida, branding estratégico e soluções de marketing para impulsionar o seu negócio."}',
  portfolio_home JSONB DEFAULT '[]',
  portfolio_page JSONB DEFAULT '[]',
  plans JSONB DEFAULT '[]',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO site_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura pública" ON site_config
  FOR SELECT USING (true);

CREATE POLICY "Permitir escrita" ON site_config
  FOR ALL USING (true) WITH CHECK (true);
```

### 1.6 Verificar Credenciais da API
**Onde:** Menu lateral → **Project Settings** → **API**

- [ ] Clique em **Project Settings** (ícone de engrenagem no menu lateral)
- [ ] Clique em **API** no submenu
- [ ] Anote os seguintes valores:
  - [ ] **Project URL**: `https://xxxxxxxx.supabase.co`
  - [ ] **anon public key**: `eyJhbGciOiJIUzI1NiIs...` (chave longa)

### 1.7 Verificar Arquivo .env do Projeto
**Onde:** No código do projeto, arquivo `.env`

- [ ] Abra o arquivo `.env` na raiz do projeto
- [ ] Verifique se contém:

```
VITE_SUPABASE_URL=https://rmxwshckjsbqgerdpgin.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

- [ ] Confirme que a URL e a chave são as mesmas do passo 1.6

---

## 📋 PARTE 2: SUPABASE - Storage para Imagens

### 2.1 Criar Bucket de Imagens
**Onde:** Menu lateral → **Storage**

- [ ] Clique em **Storage** no menu lateral esquerdo
- [ ] Clique em **New bucket**
- [ ] Preencha:
  - **Name**: `images`
  - **Public bucket**: ✅ Marque esta opção
- [ ] Clique em **Create bucket**

### 2.2 Configurar Políticas do Bucket
**Onde:** Storage → Bucket `images` → **Policies**

- [ ] Clique no bucket `images`
- [ ] Clique na aba **Policies**
- [ ] Clique em **New policy**
- [ ] Selecione **For full customization**
- [ ] Configure a política de **INSERT** (upload):
  - **Policy name**: `Permitir upload público`
  - **Allowed operation**: `INSERT`
  - **Target roles**: `anon, authenticated`
  - **Policy definition**: `true`
- [ ] Clique em **Review** → **Save policy**

- [ ] Repita para criar política de **SELECT** (leitura):
  - **Policy name**: `Permitir leitura pública`
  - **Allowed operation**: `SELECT`
  - **Target roles**: `anon, authenticated`
  - **Policy definition**: `true`

---

## 📋 PARTE 3: RESEND - Configuração de Email

### 3.1 Criar Conta no Resend
- [ ] Acesse: https://resend.com
- [ ] Clique em **Sign up** ou **Get started**
- [ ] Crie uma conta (pode usar GitHub ou email)

### 3.2 Obter API Key
**Onde:** Dashboard do Resend → **API Keys**

- [ ] No dashboard do Resend, clique em **API Keys** no menu lateral
- [ ] Clique em **+ Create API Key**
- [ ] Preencha:
  - **Name**: `Supabase` (ou qualquer nome para identificar)
  - **Permission**: `Sending access`
  - **Domain**: Selecione o domínio (ou deixe "All domains")
- [ ] Clique em **Create**
- [ ] **IMPORTANTE**: Copie a chave gerada (começa com `re_`)
- [ ] Guarde em local seguro - ela só aparece uma vez!

### 3.3 Verificar Domínio (Opcional mas Recomendado)
**Onde:** Dashboard do Resend → **Domains**

Para enviar emails como `noreply@seudominio.com`:

- [ ] Clique em **Domains** no menu lateral
- [ ] Clique em **+ Add domain**
- [ ] Digite seu domínio: `danibezerra.com`
- [ ] Siga as instruções para adicionar os registros DNS:
  - [ ] Adicione o registro **MX**
  - [ ] Adicione o registro **TXT** (SPF)
  - [ ] Adicione o registro **TXT** (DKIM)
- [ ] Aguarde a verificação (pode levar até 48h)

**Nota:** Se não verificar o domínio, pode usar `onboarding@resend.dev` como remetente para testes.

---

## 📋 PARTE 4: SUPABASE - Edge Function

### 4.1 Instalar Supabase CLI (se não instalado)
**Onde:** Terminal do computador

- [ ] Abra o terminal
- [ ] Execute: `npx supabase --version`
- [ ] Se aparecer um número de versão, está instalado ✅
- [ ] Se der erro, a instalação será feita automaticamente no próximo passo

### 4.2 Fazer Login no Supabase CLI
**Onde:** Terminal do computador

- [ ] No terminal, navegue até a pasta do projeto:
  ```
  cd /Users/dbezerra/Documents/projetos/danidev
  ```
- [ ] Execute: `npx supabase login`
- [ ] Pressione Enter para abrir o navegador
- [ ] Faça login no Supabase
- [ ] Copie o código de verificação e cole no terminal
- [ ] Deve aparecer: "You are now logged in"

### 4.3 Vincular Projeto
**Onde:** Terminal do computador

- [ ] Execute: `npx supabase link --project-ref rmxwshckjsbqgerdpgin`
- [ ] Se pedir senha do banco, digite a senha do projeto Supabase
- [ ] Deve aparecer: "Linked to project"

### 4.4 Deploy da Edge Function
**Onde:** Terminal do computador

- [ ] Execute: `npx supabase functions deploy send-contact-email`
- [ ] Aguarde o deploy completar
- [ ] Deve aparecer: "Deployed function send-contact-email"

### 4.5 Configurar Secrets da Edge Function
**Onde:** Supabase Dashboard → **Edge Functions**

- [ ] No Supabase Dashboard, clique em **Edge Functions** no menu lateral
- [ ] Clique na função `send-contact-email`
- [ ] Clique na aba **Secrets**
- [ ] Clique em **+ Add secret**
- [ ] Adicione:
  - **Name**: `RESEND_API_KEY`
  - **Value**: Cole a chave do Resend (ex: `re_xxxxxxxxxx`)
- [ ] Clique em **Save**
- [ ] Adicione outro secret:
  - **Name**: `ADMIN_EMAIL`
  - **Value**: `contato@danibezerra.com` (email para receber notificações)
- [ ] Clique em **Save**

---

## 📋 PARTE 5: SUPABASE - Database Webhook

### 5.1 Criar Webhook
**Onde:** Supabase Dashboard → **Database** → **Webhooks**

- [ ] No menu lateral, clique em **Database**
- [ ] Clique em **Webhooks** no submenu
- [ ] Clique em **Create a new webhook**
- [ ] Preencha:
  - **Name**: `send-contact-email`
  - **Table**: Selecione `contatos`
  - **Events**: Marque apenas `INSERT`
  - **Type**: Selecione `Supabase Edge Functions`
  - **Edge Function**: Selecione `send-contact-email`
  - **HTTP Headers**: Deixe vazio
- [ ] Clique em **Create webhook**

---

## 📋 PARTE 6: TESTE FINAL

### 6.1 Testar Formulário de Contato
- [ ] Acesse o site: http://localhost:5173/Contato
- [ ] Preencha o formulário com dados de teste:
  - Nome: `Teste`
  - Email: `seu-email@teste.com`
  - WhatsApp: `11999999999`
  - Empresa: `Empresa Teste`
  - Tipo de projeto: Selecione qualquer opção
  - Mensagem: `Teste de envio`
- [ ] Clique em **Enviar orçamento**
- [ ] Deve redirecionar para a página de Obrigado

### 6.2 Verificar Dados no Supabase
**Onde:** Supabase Dashboard → **Table Editor** → `contatos`

- [ ] Acesse o Table Editor
- [ ] Clique na tabela `contatos`
- [ ] Verifique se o registro de teste aparece na lista

### 6.3 Verificar Email Recebido
- [ ] Verifique a caixa de entrada do email configurado em `ADMIN_EMAIL`
- [ ] Verifique também a pasta de Spam
- [ ] O email deve conter os dados do formulário

---

## ❌ PROBLEMAS COMUNS

### Erro: "relation contatos does not exist"
**Solução:** A tabela não foi criada. Execute o SQL do passo 1.3.

### Erro: "new row violates row-level security policy"
**Solução:** As políticas RLS não foram configuradas. Execute o SQL do passo 1.4.

### Formulário não envia (fica carregando)
**Possíveis causas:**
1. Credenciais do `.env` incorretas - verifique passo 1.7
2. Tabela `contatos` não existe - verifique passo 1.2

### Email não chega
**Possíveis causas:**
1. API Key do Resend incorreta - verifique passo 3.2 e 4.5
2. Webhook não configurado - verifique passo 5.1
3. Edge Function não deployada - verifique passo 4.4
4. Email na pasta de Spam

### Erro no deploy da Edge Function
**Solução:** Verifique se está logado (`npx supabase login`) e se o projeto está vinculado (`npx supabase link`).

---

## ✅ RESUMO DOS VALORES NECESSÁRIOS

| Item | Onde encontrar | Exemplo |
|------|----------------|---------|
| VITE_SUPABASE_URL | Supabase → Settings → API | `https://xxx.supabase.co` |
| VITE_SUPABASE_ANON_KEY | Supabase → Settings → API | `eyJhbGci...` |
| RESEND_API_KEY | Resend → API Keys | `re_xxxxxxxxxx` |
| ADMIN_EMAIL | Seu email | `contato@danibezerra.com` |
| Project Ref | URL do Supabase | `rmxwshckjsbqgerdpgin` |

---

**Última atualização:** 28/12/2024
