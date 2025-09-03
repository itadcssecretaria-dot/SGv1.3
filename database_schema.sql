-- SG - Servir e Gerir - Estrutura do Banco de Dados
-- Sistema de Gestão da Cantina ADCS

-- Tabela de usuários do sistema
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    nivel_acesso VARCHAR(20) NOT NULL CHECK (nivel_acesso IN ('administrador', 'operador')),
    ativo BOOLEAN DEFAULT true,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de categorias de produtos
CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    ativo BOOLEAN DEFAULT true,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL CHECK (preco >= 0),
    categoria_id INTEGER REFERENCES categorias(id),
    ativo BOOLEAN DEFAULT true,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    saldo_devedor DECIMAL(10,2) DEFAULT 0.00 CHECK (saldo_devedor >= 0),
    ativo BOOLEAN DEFAULT true,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de formas de pagamento
CREATE TABLE IF NOT EXISTS formas_pagamento (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(30) NOT NULL UNIQUE,
    ativo BOOLEAN DEFAULT true,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de vendas
CREATE TABLE IF NOT EXISTS vendas (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes(id), -- NULL se for venda à vista
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valor_bruto DECIMAL(10,2) NOT NULL CHECK (valor_bruto >= 0),
    desconto DECIMAL(10,2) DEFAULT 0.00 CHECK (desconto >= 0),
    valor_total DECIMAL(10,2) NOT NULL CHECK (valor_total >= 0),
    forma_pagamento_id INTEGER REFERENCES formas_pagamento(id),
    tipo_venda VARCHAR(10) NOT NULL CHECK (tipo_venda IN ('vista', 'prazo')),
    status VARCHAR(20) DEFAULT 'finalizada' CHECK (status IN ('finalizada', 'cancelada')),
    observacoes TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de itens da venda
CREATE TABLE IF NOT EXISTS venda_itens (
    id SERIAL PRIMARY KEY,
    venda_id INTEGER NOT NULL REFERENCES vendas(id) ON DELETE CASCADE,
    produto_id INTEGER NOT NULL REFERENCES produtos(id),
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    preco_unitario DECIMAL(10,2) NOT NULL CHECK (preco_unitario >= 0),
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de pagamentos de dívidas
CREATE TABLE IF NOT EXISTS pagamentos_dividas (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id),
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    valor_pago DECIMAL(10,2) NOT NULL CHECK (valor_pago > 0),
    forma_pagamento_id INTEGER NOT NULL REFERENCES formas_pagamento(id),
    data_pagamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observacoes TEXT
);

-- Tabela de movimentações do caixa
CREATE TABLE IF NOT EXISTS caixa_movimentacoes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('entrada', 'saida')),
    valor DECIMAL(10,2) NOT NULL CHECK (valor > 0),
    forma_pagamento_id INTEGER REFERENCES formas_pagamento(id),
    descricao VARCHAR(200) NOT NULL,
    referencia_id INTEGER, -- ID da venda ou pagamento que gerou a movimentação
    referencia_tipo VARCHAR(20), -- 'venda' ou 'pagamento_divida' ou 'despesa'
    data_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de configurações do sistema
CREATE TABLE IF NOT EXISTS configuracoes (
    id SERIAL PRIMARY KEY,
    chave VARCHAR(50) NOT NULL UNIQUE,
    valor TEXT,
    descricao VARCHAR(200),
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir dados iniciais

-- Categorias padrão
INSERT INTO categorias (nome) VALUES 
('Bebidas'),
('Salgados'),
('Doces'),
('Outros')
ON CONFLICT (nome) DO NOTHING;

-- Formas de pagamento padrão
INSERT INTO formas_pagamento (nome) VALUES 
('Dinheiro'),
('PIX'),
('Cartão de Débito'),
('Cartão de Crédito')
ON CONFLICT (nome) DO NOTHING;

-- Usuário administrador padrão (senha: admin123)
INSERT INTO usuarios (nome, email, senha_hash, nivel_acesso) VALUES 
('Administrador', 'admin@adcs.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5u', 'administrador')
ON CONFLICT (email) DO NOTHING;

-- Configurações iniciais
INSERT INTO configuracoes (chave, valor, descricao) VALUES 
('nome_organizacao', 'Assembleia de Deus Chamados para Servir (ADCS)', 'Nome da organização'),
('sistema_nome', 'SG - Servir e Gerir', 'Nome do sistema'),
('moeda', 'BRL', 'Moeda utilizada no sistema'),
('timezone', 'America/Sao_Paulo', 'Fuso horário do sistema')
ON CONFLICT (chave) DO NOTHING;

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_vendas_data_hora ON vendas(data_hora);
CREATE INDEX IF NOT EXISTS idx_vendas_cliente_id ON vendas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_vendas_usuario_id ON vendas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_venda_itens_venda_id ON venda_itens(venda_id);
CREATE INDEX IF NOT EXISTS idx_venda_itens_produto_id ON venda_itens(produto_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_dividas_cliente_id ON pagamentos_dividas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_caixa_movimentacoes_data ON caixa_movimentacoes(data_movimentacao);
CREATE INDEX IF NOT EXISTS idx_caixa_movimentacoes_tipo ON caixa_movimentacoes(tipo);

-- Comentários nas tabelas
COMMENT ON TABLE usuarios IS 'Usuários do sistema (administradores e operadores)';
COMMENT ON TABLE categorias IS 'Categorias dos produtos';
COMMENT ON TABLE produtos IS 'Produtos vendidos na cantina';
COMMENT ON TABLE clientes IS 'Clientes que compram a prazo';
COMMENT ON TABLE formas_pagamento IS 'Formas de pagamento aceitas';
COMMENT ON TABLE vendas IS 'Registro de todas as vendas';
COMMENT ON TABLE venda_itens IS 'Itens de cada venda';
COMMENT ON TABLE pagamentos_dividas IS 'Pagamentos de dívidas dos clientes';
COMMENT ON TABLE caixa_movimentacoes IS 'Movimentações do caixa';
COMMENT ON TABLE configuracoes IS 'Configurações do sistema';

