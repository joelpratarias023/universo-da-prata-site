-- Schema para Supabase PostgreSQL
-- Copie e execute este script no SQL Editor do Supabase Dashboard

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id BIGSERIAL PRIMARY KEY,
  uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  cpf VARCHAR(14) UNIQUE,
  telefone VARCHAR(20),
  senha VARCHAR(255) NOT NULL,
  tipo VARCHAR(20) DEFAULT 'cliente' CHECK (tipo IN ('cliente', 'entregador', 'admin')),
  status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'bloqueado')),
  endereco_principal BIGINT,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_endereco FOREIGN KEY (endereco_principal) REFERENCES enderecos(id) ON DELETE SET NULL
);

CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_cpf ON usuarios(cpf);
CREATE INDEX idx_usuarios_tipo ON usuarios(tipo);

-- Tabela de Categorias
CREATE TABLE IF NOT EXISTS categorias (
  id BIGSERIAL PRIMARY KEY,
  uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL UNIQUE,
  descricao TEXT,
  imagem_url VARCHAR(255),
  ordem INT DEFAULT 0,
  ativa BOOLEAN DEFAULT true,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categorias_ativa ON categorias(ativa);

-- Tabela de Endereços
CREATE TABLE IF NOT EXISTS enderecos (
  id BIGSERIAL PRIMARY KEY,
  uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  usuario_id BIGINT NOT NULL,
  endereco VARCHAR(150) NOT NULL,
  numero VARCHAR(10) NOT NULL,
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  cidade VARCHAR(100) NOT NULL,
  estado VARCHAR(2) NOT NULL,
  cep VARCHAR(10) NOT NULL,
  principal BOOLEAN DEFAULT false,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE INDEX idx_enderecos_usuario ON enderecos(usuario_id);

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS produtos (
  id BIGSERIAL PRIMARY KEY,
  uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  nome VARCHAR(150) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10, 2) NOT NULL,
  categoria_id BIGINT NOT NULL,
  imagem_url VARCHAR(255),
  estoque INT DEFAULT 0,
  avaliacao_media DECIMAL(3, 2) DEFAULT 0,
  numero_avaliacoes INT DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT
);

CREATE INDEX idx_produtos_categoria ON produtos(categoria_id);
CREATE INDEX idx_produtos_ativo ON produtos(ativo);

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id BIGSERIAL PRIMARY KEY,
  uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  usuario_id BIGINT NOT NULL,
  entregador_id BIGINT,
  numero_pedido VARCHAR(20) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'em_entrega', 'entregue', 'cancelado')),
  valor_total DECIMAL(10, 2) NOT NULL,
  taxa_entrega DECIMAL(10, 2) DEFAULT 0,
  desconto DECIMAL(10, 2) DEFAULT 0,
  endereco_entrega BIGINT NOT NULL,
  observacoes TEXT,
  data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_entrega TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_usuario_pedido FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
  CONSTRAINT fk_entregador FOREIGN KEY (entregador_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  CONSTRAINT fk_endereco_entrega FOREIGN KEY (endereco_entrega) REFERENCES enderecos(id) ON DELETE RESTRICT
);

CREATE INDEX idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX idx_pedidos_status ON pedidos(status);
CREATE INDEX idx_pedidos_data ON pedidos(data_pedido);
CREATE INDEX idx_pedidos_entregador ON pedidos(entregador_id);

-- Tabela de Itens do Pedido
CREATE TABLE IF NOT EXISTS itens_pedido (
  id BIGSERIAL PRIMARY KEY,
  uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  pedido_id BIGINT NOT NULL,
  produto_id BIGINT NOT NULL,
  quantidade INT NOT NULL,
  preco_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  CONSTRAINT fk_produto_item FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE RESTRICT
);

CREATE INDEX idx_itens_pedido_pedido ON itens_pedido(pedido_id);
CREATE INDEX idx_itens_pedido_produto ON itens_pedido(produto_id);

-- Tabela de Avaliações
CREATE TABLE IF NOT EXISTS avaliacoes (
  id BIGSERIAL PRIMARY KEY,
  uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  produto_id BIGINT NOT NULL,
  usuario_id BIGINT NOT NULL,
  estrelas INT NOT NULL CHECK (estrelas >= 1 AND estrelas <= 5),
  comentario TEXT,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_produto_avaliacao FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
  CONSTRAINT fk_usuario_avaliacao FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  UNIQUE(produto_id, usuario_id)
);

CREATE INDEX idx_avaliacoes_produto ON avaliacoes(produto_id);
CREATE INDEX idx_avaliacoes_usuario ON avaliacoes(usuario_id);

-- =========================================
-- EXTENSÕES PARA PAINEL ADMIN (HISTÓRICO/CONFIG/PROMO)
-- =========================================

-- Promoção (preço promocional) em produtos
ALTER TABLE produtos
  ADD COLUMN IF NOT EXISTS preco_promocional DECIMAL(10, 2);

-- Observações internas do admin no pedido
ALTER TABLE pedidos
  ADD COLUMN IF NOT EXISTS observacoes_internas TEXT;

-- Configurações da loja (linha única id=1)
CREATE TABLE IF NOT EXISTS configuracoes_loja (
  id INT PRIMARY KEY,
  nome VARCHAR(150) DEFAULT '',
  contacto VARCHAR(150) DEFAULT '',
  whatsapp VARCHAR(50) DEFAULT '',
  taxa_entrega DECIMAL(10, 2) DEFAULT 0,
  texto_home TEXT DEFAULT '',
  texto_sobre TEXT DEFAULT '',
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO configuracoes_loja (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- Histórico de ações em pedidos (status/observações internas)
CREATE TABLE IF NOT EXISTS pedido_historico (
  id BIGSERIAL PRIMARY KEY,
  uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  pedido_id BIGINT NOT NULL,
  admin_id BIGINT,
  acao VARCHAR(30) NOT NULL CHECK (acao IN ('status', 'observacoes_internas')),
  de_status VARCHAR(20),
  para_status VARCHAR(20),
  observacao TEXT,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pedido_historico_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  CONSTRAINT fk_pedido_historico_admin FOREIGN KEY (admin_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_pedido_historico_pedido ON pedido_historico(pedido_id);

-- Aliases para foreign keys (relações amigáveis)
-- Estes aliases permitem usar a sintaxe select com joins automáticos

-- Criar políticas de Row Level Security (RLS) se necessário

ALTER TABLE usuarios
ADD COLUMN auth_id UUID UNIQUE
REFERENCES auth.users(id)
ON DELETE CASCADE;

ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE itens_pedido ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE enderecos ENABLE ROW LEVEL SECURITY;

-- Nota: Configure o RLS no dashboard do Supabase conforme necessário
