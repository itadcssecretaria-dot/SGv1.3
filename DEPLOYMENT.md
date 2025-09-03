# Guia de Deployment - SG (Servir e Gerir)

Este guia fornece instruções detalhadas para fazer o deploy do sistema SG no Vercel.

## Pré-requisitos

1. **Conta no GitHub**: Para hospedar o código
2. **Conta no Vercel**: Para fazer o deploy
3. **Conta no Supabase**: Para o banco de dados

## Passo 1: Configuração do Supabase

### 1.1 Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Crie uma nova organização (se necessário)
4. Clique em "New project"
5. Preencha:
   - **Name**: SG-Cantina-ADCS
   - **Database Password**: Crie uma senha forte
   - **Region**: South America (São Paulo)
6. Clique em "Create new project"

### 1.2 Configurar o Banco de Dados

1. Aguarde a criação do projeto (pode levar alguns minutos)
2. No painel do Supabase, vá para "SQL Editor"
3. Clique em "New query"
4. Copie e cole o conteúdo do arquivo `database_schema.sql`
5. Clique em "Run" para executar o script

### 1.3 Obter as Chaves de API

1. No painel do Supabase, vá para "Settings" > "API"
2. Anote as seguintes informações:
   - **URL**: `https://seu-projeto.supabase.co`
   - **anon public**: Chave pública anônima
   - **service_role**: Chave de serviço (secreta)

## Passo 2: Preparação do Código

### 2.1 Upload para GitHub

1. Crie um novo repositório no GitHub
2. Faça upload de todos os arquivos do projeto
3. Certifique-se de que o arquivo `.env` **NÃO** foi incluído (deve estar no .gitignore)

### 2.2 Estrutura Final do Projeto

Verifique se a estrutura está assim:

```
SG/
├── app.py
├── requirements.txt
├── vercel.json
├── database_schema.sql
├── .env.example
├── .gitignore
├── README.md
├── DEPLOYMENT.md
└── src/
    ├── config.py
    ├── routes/
    ├── models/
    ├── services/
    ├── database/
    └── static/
        ├── index.html
        ├── styles.css
        ├── app.js
        └── config.js
```

## Passo 3: Deploy no Vercel

### 3.1 Conectar GitHub ao Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em "New Project"
4. Selecione o repositório do SG
5. Clique em "Import"

### 3.2 Configurar Variáveis de Ambiente

1. Na tela de configuração do projeto, vá para "Environment Variables"
2. Adicione as seguintes variáveis:

| Nome | Valor | Ambiente |
|------|-------|----------|
| `SUPABASE_URL` | URL do seu projeto Supabase | Production, Preview, Development |
| `SUPABASE_ANON_KEY` | Chave anônima do Supabase | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave de serviço do Supabase | Production, Preview, Development |
| `FLASK_SECRET_KEY` | Uma string aleatória longa | Production, Preview, Development |
| `FLASK_ENV` | `production` | Production |

**Exemplo de FLASK_SECRET_KEY**: `SG_Servir_e_Gerir_2025_ADCS_Secret_Key_Random_123456`

### 3.3 Fazer o Deploy

1. Após configurar as variáveis, clique em "Deploy"
2. Aguarde o processo de build (pode levar alguns minutos)
3. Se tudo correr bem, você receberá uma URL do tipo: `https://sg-cantina.vercel.app`

## Passo 4: Verificação e Testes

### 4.1 Testar a Aplicação

1. Acesse a URL fornecida pelo Vercel
2. Verifique se a tela de login aparece corretamente
3. Teste o login com credenciais de demonstração
4. Navegue pelas diferentes seções do sistema

### 4.2 Verificar Logs

1. No painel do Vercel, vá para "Functions"
2. Clique na função `app.py`
3. Verifique os logs para identificar possíveis erros

## Passo 5: Configurações Adicionais

### 5.1 Domínio Personalizado (Opcional)

1. No painel do Vercel, vá para "Settings" > "Domains"
2. Adicione seu domínio personalizado
3. Configure os registros DNS conforme instruído

### 5.2 Monitoramento

1. Configure alertas no Vercel para monitorar a aplicação
2. Use o painel do Supabase para monitorar o banco de dados

## Solução de Problemas Comuns

### Erro 500 - Internal Server Error

1. Verifique os logs no painel do Vercel
2. Confirme se todas as variáveis de ambiente estão configuradas
3. Verifique se o banco de dados está acessível

### Arquivos Estáticos Não Carregam

1. Verifique se os caminhos no `vercel.json` estão corretos
2. Confirme se os arquivos estão na pasta `src/static/`

### Erro de Conexão com Supabase

1. Verifique se as chaves de API estão corretas
2. Confirme se o projeto Supabase está ativo
3. Teste a conexão usando as ferramentas do Supabase

### Build Falha

1. Verifique se o `requirements.txt` está correto
2. Confirme se não há dependências conflitantes
3. Verifique os logs de build no Vercel

## Atualizações Futuras

Para atualizar o sistema:

1. Faça as alterações no código local
2. Commit e push para o GitHub
3. O Vercel fará o deploy automaticamente
4. Verifique se tudo está funcionando na nova versão

## Backup e Segurança

1. **Backup do Banco**: Configure backups automáticos no Supabase
2. **Variáveis de Ambiente**: Mantenha uma cópia segura das chaves
3. **Código**: Mantenha o repositório GitHub sempre atualizado

## Suporte

Em caso de problemas:

1. Verifique os logs do Vercel e Supabase
2. Consulte a documentação oficial do Vercel e Supabase
3. Entre em contato com a equipe de desenvolvimento

