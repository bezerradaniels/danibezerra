-- =============================================
-- DANIDEV - Configuração do Supabase
-- Execute este script no SQL Editor do Supabase
-- =============================================

-- 1. Criar tabela site_config para armazenar dados do site
CREATE TABLE IF NOT EXISTS site_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  hero JSONB DEFAULT '{"title": "Transforme sua presença digital em resultados reais", "subtitle": "Sites sob medida, branding estratégico e soluções de marketing para impulsionar o seu negócio."}',
  portfolio_home JSONB DEFAULT '[]',
  portfolio_page JSONB DEFAULT '[]',
  plans JSONB DEFAULT '[]',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- 2. Inserir registro inicial (se não existir)
INSERT INTO site_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- 3. Habilitar RLS (Row Level Security)
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- 4. Criar política para leitura pública
CREATE POLICY "Permitir leitura pública" ON site_config
  FOR SELECT USING (true);

-- 5. Criar política para escrita (apenas usuários autenticados ou anônimos com chave)
CREATE POLICY "Permitir escrita" ON site_config
  FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- STORAGE - Bucket para imagens
-- =============================================

-- 1. Criar bucket 'images' (execute no Dashboard > Storage > New Bucket)
-- Nome: images
-- Public: true

-- 2. Ou via SQL (pode não funcionar em todos os planos):
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Política para upload público de imagens
CREATE POLICY "Permitir upload público" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images');

-- 4. Política para leitura pública de imagens
CREATE POLICY "Permitir leitura pública de imagens" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

-- 5. Política para deletar imagens
CREATE POLICY "Permitir deletar imagens" ON storage.objects
  FOR DELETE USING (bucket_id = 'images');

-- =============================================
-- TABELA DE CONTATOS (se ainda não existir)
-- =============================================

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

-- Habilitar RLS
ALTER TABLE contatos ENABLE ROW LEVEL SECURITY;

-- Política para inserção pública
CREATE POLICY "Permitir inserção pública" ON contatos
  FOR INSERT WITH CHECK (true);

-- Política para leitura (apenas admin - você pode ajustar conforme necessário)
CREATE POLICY "Permitir leitura" ON contatos
  FOR SELECT USING (true);

-- =============================================
-- WEBHOOK PARA RESEND (Email de notificação)
-- =============================================
-- Após criar a Edge Function 'send-contact-email', configure o Database Webhook:
-- 1. Vá em Database > Webhooks no Supabase Dashboard
-- 2. Clique em "Create a new webhook"
-- 3. Configure:
--    - Name: send-contact-email
--    - Table: contatos
--    - Events: INSERT
--    - Type: Supabase Edge Functions
--    - Edge Function: send-contact-email
-- 4. Salve

-- =============================================
-- SECRETS PARA EDGE FUNCTION
-- =============================================
-- Configure os secrets no Supabase Dashboard:
-- 1. Vá em Edge Functions > send-contact-email > Secrets
-- 2. Adicione:
--    - RESEND_API_KEY: sua chave da API do Resend
--    - ADMIN_EMAIL: email para receber notificações
