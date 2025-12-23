-- =====================================
-- Script de Inicialização do Banco de Dados
-- Universo da Prata
-- =====================================

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS universo_prata;
USE universo_prata;

-- =====================================
-- Tabelas de Usuários
-- =====================================

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uuid VARCHAR(36) UNIQUE NOT NULL,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  cpf VARCHAR(14) UNIQUE,
  telefone VARCHAR(20),
  senha VARCHAR(255) NOT NULL,
  tipo ENUM('cliente', 'entregador', 'admin') DEFAULT 'cliente',
  status ENUM('ativo', 'inativo', 'bloqueado') DEFAULT 'ativo',
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_tipo (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS enderecos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uuid VARCHAR(36) UNIQUE NOT NULL,
  usuario_id INT NOT NULL,
  endereco VARCHAR(150) NOT NULL,
  numero VARCHAR(10) NOT NULL,
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  cidade VARCHAR(100) NOT NULL,
  estado VARCHAR(2) NOT NULL,
  cep VARCHAR(10) NOT NULL,
  principal BOOLEAN DEFAULT false,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_usuario (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================
-- Tabelas de Produtos
-- =====================================

CREATE TABLE IF NOT EXISTS categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uuid VARCHAR(36) UNIQUE NOT NULL,
  nome VARCHAR(100) NOT NULL UNIQUE,
  descricao TEXT,
  imagem_url VARCHAR(255),
  ordem INT DEFAULT 0,
  ativa BOOLEAN DEFAULT true,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uuid VARCHAR(36) UNIQUE NOT NULL,
  nome VARCHAR(150) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10, 2) NOT NULL,
  categoria_id INT NOT NULL,
  imagem_url VARCHAR(255),
  estoque INT DEFAULT 0,
  avaliacao_media DECIMAL(3, 2) DEFAULT 0,
  numero_avaliacoes INT DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT,
  INDEX idx_categoria (categoria_id),
  INDEX idx_ativo (ativo),
  FULLTEXT INDEX idx_busca (nome, descricao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================
-- Tabelas de Pedidos
-- =====================================

CREATE TABLE IF NOT EXISTS pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uuid VARCHAR(36) UNIQUE NOT NULL,
  usuario_id INT NOT NULL,
  entregador_id INT,
  numero_pedido VARCHAR(20) UNIQUE NOT NULL,
  status ENUM('pendente', 'confirmado', 'em_entrega', 'entregue', 'cancelado') DEFAULT 'pendente',
  valor_total DECIMAL(10, 2) NOT NULL,
  taxa_entrega DECIMAL(10, 2) DEFAULT 0,
  desconto DECIMAL(10, 2) DEFAULT 0,
  endereco_entrega INT NOT NULL,
  observacoes TEXT,
  data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_entrega TIMESTAMP NULL,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
  FOREIGN KEY (entregador_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  FOREIGN KEY (endereco_entrega) REFERENCES enderecos(id) ON DELETE RESTRICT,
  INDEX idx_usuario (usuario_id),
  INDEX idx_status (status),
  INDEX idx_data (data_pedido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS itens_pedido (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uuid VARCHAR(36) UNIQUE NOT NULL,
  pedido_id INT NOT NULL,
  produto_id INT NOT NULL,
  quantidade INT NOT NULL,
  preco_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE RESTRICT,
  INDEX idx_pedido (pedido_id),
  INDEX idx_produto (produto_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================
-- Tabelas de Avaliações
-- =====================================

CREATE TABLE IF NOT EXISTS avaliacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uuid VARCHAR(36) UNIQUE NOT NULL,
  produto_id INT NOT NULL,
  usuario_id INT NOT NULL,
  estrelas INT NOT NULL CHECK (estrelas >= 1 AND estrelas <= 5),
  comentario TEXT,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_produto (produto_id),
  INDEX idx_usuario (usuario_id),
  UNIQUE KEY unique_avaliacao (produto_id, usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================
-- Dados de Exemplo (Opcional)
-- =====================================

-- Inserir categorias exemplo
INSERT INTO categorias (uuid, nome, descricao, ordem, ativa) VALUES
('cat-uuid-1', 'Broches', 'Broches de prata e ouro', 1, true),
('cat-uuid-2', 'Anéis', 'Anéis em diversos tamanhos', 2, true),
('cat-uuid-3', 'Colares', 'Colares e correntes', 3, true),
('cat-uuid-4', 'Brincos', 'Brincos e pendentes', 4, true),
('cat-uuid-5', 'Pulseiras', 'Pulseiras e braceletes', 5, true)
ON DUPLICATE KEY UPDATE nome=nome;

-- =====================================
-- Fim do Script
-- =====================================
-- Execute este script no seu MySQL para criar toda a estrutura do banco de dados
