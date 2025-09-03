# SG - Servir e Gerir

Sistema de gestão para cantina da Assembleia de Deus Chamados para Servir (ADCS).

## Funcionalidades

- **Dashboard**: Visão geral das vendas e indicadores
- **Vendas**: Frente de caixa para realizar vendas
- **Produtos**: Cadastro e gestão de produtos
- **Clientes**: Cadastro e gestão de clientes
- **Contas a Receber**: Controle de pagamentos pendentes
- **Caixa**: Gestão de abertura e fechamento de caixa
- **Relatórios**: Relatórios de vendas e faturamento

## Tecnologias

- **Backend**: Python + Flask
- **Frontend**: HTML, CSS, JavaScript
- **Banco de Dados**: Supabase (PostgreSQL)
- **Deploy**: Vercel

## Configuração para Desenvolvimento

### Pré-requisitos

- Python 3.11+
- Conta no Supabase
- Conta no Vercel (para deploy)

### Instalação Local

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd SG
```

2. Crie um ambiente virtual:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows
```

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

4. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações do Supabase
```

5. Execute o servidor local:
```bash
python app.py
```

O sistema estará disponível em `http://localhost:5000`

## Deploy no Vercel

### Configuração do Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o script SQL em `database_schema.sql` no SQL Editor do Supabase
3. Anote as seguintes informações:
   - URL do projeto
   - Chave anônima (anon key)
   - Chave de serviço (service_role key)

### Deploy

1. Faça fork deste repositório no GitHub
2. Conecte sua conta do Vercel ao GitHub
3. Importe o projeto no Vercel
4. Configure as variáveis de ambiente no Vercel:
   - `SUPABASE_URL`: URL do seu projeto Supabase
   - `SUPABASE_ANON_KEY`: Chave anônima do Supabase
   - `SUPABASE_SERVICE_ROLE_KEY`: Chave de serviço do Supabase
   - `FLASK_SECRET_KEY`: Chave secreta para o Flask (use uma string aleatória)
   - `FLASK_ENV`: `production`

5. Faça o deploy

## Estrutura do Projeto

```
SG/
├── app.py                 # Aplicação Flask principal
├── requirements.txt       # Dependências Python
├── vercel.json           # Configuração do Vercel
├── database_schema.sql   # Schema do banco de dados
├── .env.example         # Exemplo de variáveis de ambiente
├── src/
│   ├── config.py        # Configurações da aplicação
│   ├── routes/          # Rotas da API
│   ├── models/          # Modelos de dados
│   ├── services/        # Serviços e lógica de negócio
│   ├── database/        # Configuração do banco de dados
│   └── static/          # Arquivos estáticos (frontend)
│       ├── index.html   # Página principal
│       ├── styles.css   # Estilos CSS
│       ├── app.js       # JavaScript principal
│       └── config.js    # Configurações do frontend
```

## Licença

Este projeto é propriedade da Assembleia de Deus Chamados para Servir (ADCS).

## Suporte

Para suporte técnico, entre em contato com a equipe de desenvolvimento.

