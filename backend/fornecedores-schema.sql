-- Script SQL para criar as tabelas necessárias para o sistema de fornecedores
-- Execute este script no Supabase SQL Editor

-- 1. Criar tabela de fornecedores
CREATE TABLE IF NOT EXISTS fornecedores (
  id BIGSERIAL PRIMARY KEY,
  uuid UUID UNIQUE DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  cnpj VARCHAR(18),
  telefone VARCHAR(20),
  senha TEXT NOT NULL,
  endereco TEXT,
  taxa_comissao DECIMAL(5,2) DEFAULT 0.00,
  status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'bloqueado')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Adicionar coluna fornecedor_id na tabela produtos (se não existir)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'produtos' AND column_name = 'fornecedor_id'
  ) THEN
    ALTER TABLE produtos ADD COLUMN fornecedor_id BIGINT REFERENCES fornecedores(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 3. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_fornecedores_email ON fornecedores(email);
CREATE INDEX IF NOT EXISTS idx_fornecedores_status ON fornecedores(status);
CREATE INDEX IF NOT EXISTS idx_fornecedores_uuid ON fornecedores(uuid);
CREATE INDEX IF NOT EXISTS idx_produtos_fornecedor ON produtos(fornecedor_id);

-- 4. Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_fornecedores_updated_at
  BEFORE UPDATE ON fornecedores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. Criar tabela de pagamentos a fornecedores (opcional, para histórico)
CREATE TABLE IF NOT EXISTS pagamentos_fornecedores (
  id BIGSERIAL PRIMARY KEY,
  uuid UUID UNIQUE DEFAULT gen_random_uuid(),
  fornecedor_id BIGINT NOT NULL REFERENCES fornecedores(id) ON DELETE CASCADE,
  valor DECIMAL(10,2) NOT NULL,
  data_pagamento DATE NOT NULL,
  tipo_pagamento VARCHAR(50) DEFAULT 'transferencia',
  comprovante TEXT,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pagamentos_fornecedor ON pagamentos_fornecedores(fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_data ON pagamentos_fornecedores(data_pagamento);

-- 6. Inserir fornecedor de exemplo (opcional - remova se não quiser)
-- Senha padrão: fornecedor123 (hash bcrypt)
INSERT INTO fornecedores (nome, email, cnpj, telefone, senha, endereco, taxa_comissao, status)
VALUES (
  'Fornecedor Exemplo',
  'fornecedor@exemplo.com',
  '12.345.678/0001-90',
  '(11) 98765-4321',
  '$2a$10$YourHashedPasswordHere', -- Substitua por um hash real
  'Rua Exemplo, 123 - São Paulo, SP',
  10.00,
  'ativo'
) ON CONFLICT (email) DO NOTHING;

-- 7. Habilitar RLS (Row Level Security) se necessário
ALTER TABLE fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos_fornecedores ENABLE ROW LEVEL SECURITY;

-- 8. Criar políticas de acesso (ajuste conforme necessário)
-- Fornecedores podem ver apenas seus próprios dados
CREATE POLICY "Fornecedores podem ver seus dados" ON fornecedores
  FOR SELECT USING (auth.uid()::text = uuid::text);

CREATE POLICY "Fornecedores podem atualizar seus dados" ON fornecedores
  FOR UPDATE USING (auth.uid()::text = uuid::text);

-- Permissão para admins (ajuste conforme seu sistema de autenticação)
CREATE POLICY "Admins têm acesso total" ON fornecedores
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE usuarios.uuid::text = auth.uid()::text 
      AND usuarios.tipo = 'admin'
    )
  );

COMMENT ON TABLE fornecedores IS 'Tabela de fornecedores do sistema';
COMMENT ON TABLE pagamentos_fornecedores IS 'Histórico de pagamentos realizados aos fornecedores';
