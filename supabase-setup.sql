-- ============================================================
--  EstéticaAuto ERP - Supabase Setup SQL
--  Execute este SQL no editor do Supabase (SQL Editor)
-- ============================================================

-- Tabela de configuração do sistema (usada para detectar primeiro acesso)
create table if not exists erp_config (
  id bigint generated always as identity primary key,
  key text unique not null,
  value text,
  created_at timestamptz default now()
);

-- Habilitar Row Level Security
alter table erp_config enable row level security;

-- Política: apenas usuários autenticados podem ler/escrever
create policy "Autenticados podem ler config"
  on erp_config for select
  to authenticated
  using (true);

create policy "Autenticados podem inserir config"
  on erp_config for insert
  to authenticated
  with check (true);

-- Política anon APENAS para verificar se setup foi feito (leitura da chave setup_done)
create policy "Anon pode verificar setup"
  on erp_config for select
  to anon
  using (key = 'setup_done');

-- ============================================================
--  Configurações do Supabase Auth (faça no Dashboard):
--  Authentication > Settings:
--    - Disable email confirmation (para simplificar)
--    - Minimum password length: 6
-- ============================================================
