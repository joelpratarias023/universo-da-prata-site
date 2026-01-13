-- Schema para o sistema de entregadores
-- Execute este script no Supabase SQL Editor

-- Tabela de entregadores
CREATE TABLE IF NOT EXISTS entregadores (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    cpf VARCHAR(14) UNIQUE,
    veiculo VARCHAR(100), -- ex: Moto Honda, Carro, Bicicleta
    dados_bancarios JSONB, -- { pix, banco, agencia, conta }
    ativo BOOLEAN DEFAULT true,
    data_criacao TIMESTAMP DEFAULT NOW(),
    ultima_atualizacao TIMESTAMP DEFAULT NOW()
);

-- Tabela de entregas
CREATE TABLE IF NOT EXISTS entregas (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE,
    pedido_id BIGINT REFERENCES pedidos(id) ON DELETE CASCADE,
    entregador_id BIGINT REFERENCES entregadores(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'pendente', -- pendente, em_rota, entregue, cancelada
    comissao DECIMAL(10, 2) NOT NULL DEFAULT 0,
    observacoes TEXT,
    data_criacao TIMESTAMP DEFAULT NOW(),
    data_atribuicao TIMESTAMP,
    data_entrega TIMESTAMP,
    notificacao_enviada BOOLEAN DEFAULT false
);

-- Tabela de pagamentos aos entregadores
CREATE TABLE IF NOT EXISTS pagamentos_entregadores (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE,
    entregador_id BIGINT REFERENCES entregadores(id) ON DELETE CASCADE,
    valor DECIMAL(10, 2) NOT NULL,
    periodo_inicio DATE NOT NULL,
    periodo_fim DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pendente', -- pendente, pago
    metodo_pagamento VARCHAR(50), -- pix, transferencia, dinheiro
    data_pagamento TIMESTAMP,
    comprovante_url TEXT,
    data_criacao TIMESTAMP DEFAULT NOW()
);

-- Tabela de notificações para entregadores
CREATE TABLE IF NOT EXISTS notificacoes_entregadores (
    id BIGSERIAL PRIMARY KEY,
    entregador_id BIGINT REFERENCES entregadores(id) ON DELETE CASCADE,
    entrega_id BIGINT REFERENCES entregas(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL, -- nova_entrega, mudanca_status, pagamento
    titulo VARCHAR(255) NOT NULL,
    mensagem TEXT NOT NULL,
    lida BOOLEAN DEFAULT false,
    enviada_sms BOOLEAN DEFAULT false,
    enviada_email BOOLEAN DEFAULT false,
    data_criacao TIMESTAMP DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_entregadores_email ON entregadores(email);
CREATE INDEX IF NOT EXISTS idx_entregadores_cpf ON entregadores(cpf);
CREATE INDEX IF NOT EXISTS idx_entregas_entregador ON entregas(entregador_id);
CREATE INDEX IF NOT EXISTS idx_entregas_pedido ON entregas(pedido_id);
CREATE INDEX IF NOT EXISTS idx_entregas_status ON entregas(status);
CREATE INDEX IF NOT EXISTS idx_pagamentos_entregador ON pagamentos_entregadores(entregador_id);
CREATE INDEX IF NOT EXISTS idx_notificacoes_entregador ON notificacoes_entregadores(entregador_id);

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION atualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ultima_atualizacao = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar timestamp automaticamente
DROP TRIGGER IF EXISTS trigger_atualizar_timestamp_entregadores ON entregadores;
CREATE TRIGGER trigger_atualizar_timestamp_entregadores
    BEFORE UPDATE ON entregadores
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_timestamp();

-- Row Level Security (RLS)
ALTER TABLE entregadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE entregas ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos_entregadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacoes_entregadores ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
-- Entregadores podem ver e atualizar apenas seus próprios dados
CREATE POLICY "Entregadores podem ver seus dados"
    ON entregadores FOR SELECT
    USING (auth.uid()::text = uuid::text);

CREATE POLICY "Entregadores podem atualizar seus dados"
    ON entregadores FOR UPDATE
    USING (auth.uid()::text = uuid::text);

-- Entregadores podem ver apenas suas entregas
CREATE POLICY "Entregadores podem ver suas entregas"
    ON entregas FOR SELECT
    USING (
        entregador_id IN (
            SELECT id FROM entregadores WHERE uuid::text = auth.uid()::text
        )
    );

-- Entregadores podem atualizar status de suas entregas
CREATE POLICY "Entregadores podem atualizar suas entregas"
    ON entregas FOR UPDATE
    USING (
        entregador_id IN (
            SELECT id FROM entregadores WHERE uuid::text = auth.uid()::text
        )
    );

-- Entregadores podem ver seus pagamentos
CREATE POLICY "Entregadores podem ver seus pagamentos"
    ON pagamentos_entregadores FOR SELECT
    USING (
        entregador_id IN (
            SELECT id FROM entregadores WHERE uuid::text = auth.uid()::text
        )
    );

-- Entregadores podem ver suas notificações
CREATE POLICY "Entregadores podem ver suas notificações"
    ON notificacoes_entregadores FOR SELECT
    USING (
        entregador_id IN (
            SELECT id FROM entregadores WHERE uuid::text = auth.uid()::text
        )
    );

-- Comentários nas tabelas
COMMENT ON TABLE entregadores IS 'Cadastro de entregadores';
COMMENT ON TABLE entregas IS 'Registro de entregas atribuídas aos entregadores';
COMMENT ON TABLE pagamentos_entregadores IS 'Histórico de pagamentos/comissões aos entregadores';
COMMENT ON TABLE notificacoes_entregadores IS 'Notificações enviadas aos entregadores';
