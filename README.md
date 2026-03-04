# 🚗 EstéticaAuto ERP

Sistema ERP completo para estética automotiva com login via Supabase e hospedagem gratuita.

---

## 📋 Passo a Passo Completo

### 1. Criar conta no Supabase (gratuito)

1. Acesse [supabase.com](https://supabase.com) e clique em **Start your project**
2. Faça login com GitHub ou crie uma conta
3. Clique em **New Project**
4. Preencha:
   - **Name:** estetica-erp
   - **Database Password:** crie uma senha forte (guarde!)
   - **Region:** South America (São Paulo)
5. Aguarde o projeto ser criado (~2 min)

---

### 2. Configurar o banco de dados

1. No painel do Supabase, vá em **SQL Editor** (ícone de banco no menu lateral)
2. Clique em **New query**
3. Cole o conteúdo do arquivo `supabase-setup.sql` e clique em **Run**

---

### 3. Desabilitar confirmação de email (recomendado)

1. No Supabase, vá em **Authentication > Settings**
2. Em **Email Auth**, desative **Confirm email**
3. Salve as configurações

---

### 4. Pegar as credenciais do Supabase

1. No Supabase, vá em **Settings > API**
2. Copie:
   - **Project URL** → ex: `https://abcdefghijk.supabase.co`
   - **anon public key** → chave longa começando com `eyJ...`

---

### 5. Configurar o projeto localmente

1. Renomeie o arquivo `.env.example` para `.env`
2. Preencha com suas credenciais:
   ```
   VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
   ```

---

### 6. Testar localmente

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173)

Na **primeira vez**, o sistema detecta que não há configuração e mostra a tela de **criação de conta administrador**.

---

### 7. Hospedar no Vercel (gratuito)

#### Opção A — Via GitHub (recomendado)

1. Crie uma conta no [GitHub](https://github.com) se não tiver
2. Crie um repositório novo (pode ser privado)
3. Faça upload dos arquivos do projeto:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
   git push -u origin main
   ```
4. Acesse [vercel.com](https://vercel.com) e faça login com GitHub
5. Clique em **Add New > Project**
6. Selecione seu repositório
7. Na tela de configuração, adicione as variáveis de ambiente:
   - `VITE_SUPABASE_URL` = sua URL do Supabase
   - `VITE_SUPABASE_ANON_KEY` = sua chave anon
8. Clique em **Deploy**

Pronto! Você receberá uma URL como `https://estetica-erp.vercel.app` 🎉

#### Opção B — Via Netlify Drop (mais simples)

1. Execute `npm run build` localmente
2. Acesse [netlify.com/drop](https://app.netlify.com/drop)
3. Arraste a pasta `dist/` gerada
4. Configure as variáveis de ambiente em **Site settings > Environment variables**
5. Faça redeploy

---

## 🔒 Segurança

- As credenciais ficam no `.env` (nunca suba este arquivo para o GitHub — ele já está no `.gitignore`)
- A chave `anon` do Supabase é segura para uso no frontend
- O Row Level Security (RLS) garante que apenas usuários autenticados acessem os dados

---

## 🛠️ Estrutura do Projeto

```
erp-app/
├── src/
│   ├── main.jsx          # Entrada da aplicação
│   ├── Root.jsx          # Gerencia autenticação
│   ├── App.jsx           # ERP principal
│   ├── supabase.js       # Cliente Supabase
│   └── components/
│       └── Auth.jsx      # Tela de login / primeiro acesso
├── supabase-setup.sql    # SQL para configurar o banco
├── .env.example          # Modelo de variáveis de ambiente
├── .env                  # ⚠️ Suas credenciais (não subir ao GitHub)
├── vercel.json           # Config de deploy SPA
├── vite.config.js
├── package.json
└── index.html
```

---

## ✨ Funcionalidades

- **Login seguro** via Supabase Auth
- **Primeiro acesso automático** — cria a conta admin no primeiro uso
- **Sessão persistente** — permanece logado após fechar o navegador
- **Logout** — botão no canto superior direito
- ERP completo: Clientes, Veículos, OS, Agendamentos, Estoque, Financeiro, Relatórios
- 10 temas de cores
- Upload de logo
- Sistema de pontos de fidelidade
- Controle de boxes com validação de ocupação
- Horários de funcionamento configuráveis
