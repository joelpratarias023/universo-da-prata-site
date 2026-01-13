-- Schema adicional para Sistema Completo de Admin
-- Execute este SQL no Supabase após executar os schemas anteriores

-- ===== AJUSTES NA TABELA PRODUTOS =====
ALTER TABLE produtos
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pendente', -- pendente, ativo, rejeitado, inativo
ADD COLUMN IF NOT EXISTS aprovado_por BIGINT REFERENCES usuarios(id),
ADD COLUMN IF NOT EXISTS data_aprovacao TIMESTAMP,
ADD COLUMN IF NOT EXISTS rejeitado_por BIGINT REFERENCES usuarios(id),
ADD COLUMN IF NOT EXISTS data_rejeicao TIMESTAMP,
ADD COLUMN IF NOT EXISTS motivo_rejeicao TEXT,
ADD COLUMN IF NOT EXISTS desativado_por BIGINT REFERENCES usuarios(id),
ADD COLUMN IF NOT EXISTS data_desativacao TIMESTAMP,
ADD COLUMN IF NOT EXISTS motivo_desativacao TEXT,
ADD COLUMN IF NOT EXISTS comissao_plataforma DECIMAL(5,2) DEFAULT 10.00; -- Porcentagem de comissão da plataforma

-- ===== AJUSTES NA TABELA FORNECEDORES =====
ALTER TABLE fornecedores
ADD COLUMN IF NOT EXISTS motivo_suspensao TEXT,
ADD COLUMN IF NOT EXISTS total_vendas DECIMAL(10,2) DEFAULT 0;

-- ===== AJUSTES NA TABELA ENTREGAS =====
ALTER TABLE entregas
ADD COLUMN IF NOT EXISTS atribuido_por BIGINT REFERENCES usuarios(id),
ADD COLUMN IF NOT EXISTS aprovado_por_admin BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS admin_aprovador_id BIGINT REFERENCES usuarios(id),
ADD COLUMN IF NOT EXISTS data_aprovacao TIMESTAMP,
ADD COLUMN IF NOT EXISTS observacoes_admin TEXT,
ADD COLUMN IF NOT EXISTS rejeitado_por BIGINT REFERENCES usuarios(id),
ADD COLUMN IF NOT EXISTS data_rejeicao TIMESTAMP,
ADD COLUMN IF NOT EXISTS motivo_rejeicao TEXT;

-- Atualizar status permitidos
ALTER TABLE entregas 
DROP CONSTRAINT IF EXISTS entregas_status_check;

ALTER TABLE entregas
ADD CONSTRAINT entregas_status_check 
CHECK (status IN ('pendente', 'em_rota', 'entregue', 'cancelada', 'rejeitada'));

-- ===== AJUSTES NA TABELA ENTREGADORES =====
ALTER TABLE entregadores
ADD COLUMN IF NOT EXISTS motivo_bloqueio TEXT;

-- ===== AJUSTES NAS TABELAS DE PAGAMENTOS =====
-- Fornecedores
ALTER TABLE pagamentos_fornecedores
ADD COLUMN IF NOT EXISTS valor_bruto DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS valor_comissao DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS taxa_comissao DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS quantidade_vendas INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS processado_por BIGINT REFERENCES usuarios(id),
ADD COLUMN IF NOT EXISTS gerado_por BIGINT REFERENCES usuarios(id);

-- Entregadores
ALTER TABLE pagamentos_entregadores
ADD COLUMN IF NOT EXISTS quantidade_entregas INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS processado_por BIGINT REFERENCES usuarios(id),
ADD COLUMN IF NOT EXISTS gerado_por BIGINT REFERENCES usuarios(id);

-- ===== NOVA TABELA: HISTÓRICO DE AÇÕES DO ADMIN =====
CREATE TABLE IF NOT EXISTS historico_admin (
    id BIGSERIAL PRIMARY KEY,
    admin_id BIGINT REFERENCES usuarios(id) ON DELETE SET NULL,
    acao VARCHAR(100) NOT NULL, -- aprovar_produto, rejeitar_produto, criar_entrega, processar_pagamento, etc
    entidade_tipo VARCHAR(50) NOT NULL, -- produto, fornecedor, entregador, entrega, pagamento
    entidade_id BIGINT NOT NULL,
    dados JSONB, -- Dados adicionais da ação
    data_criacao TIMESTAMP DEFAULT NOW()
);

-- Índices para histórico
CREATE INDEX IF NOT EXISTS idx_historico_admin_id ON historico_admin(admin_id);
CREATE INDEX IF NOT EXISTS idx_historico_entidade ON historico_admin(entidade_tipo, entidade_id);
CREATE INDEX IF NOT EXISTS idx_historico_data ON historico_admin(data_criacao DESC);

-- ===== NOVA TABELA: NOTIFICAÇÕES GERAIS =====
CREATE TABLE IF NOT EXISTS notificacoes (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL, -- produto_aprovado, produto_rejeitado, pagamento_processado, etc
    titulo VARCHAR(255) NOT NULL,
    mensagem TEXT NOT NULL,
    lida BOOLEAN DEFAULT false,
    data_criacao TIMESTAMP DEFAULT NOW(),
    link_acao VARCHAR(255) -- URL para ação relacionada
);

CREATE INDEX IF NOT EXISTS idx_notificacoes_usuario ON notificacoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_notificacoes_lida ON notificacoes(lida);

-- ===== ÍNDICES ADICIONAIS =====
CREATE INDEX IF NOT EXISTS idx_produtos_status ON produtos(status);
CREATE INDEX IF NOT EXISTS idx_produtos_fornecedor_status ON produtos(fornecedor_id, status);
CREATE INDEX IF NOT EXISTS idx_entregas_status ON entregas(status);
CREATE INDEX IF NOT EXISTS idx_entregas_aprovacao ON entregas(aprovado_por_admin);

-- ===== VIEWS ÚTEIS =====

-- View: Produtos pendentes de aprovação
CREATE OR REPLACE VIEW produtos_pendentes AS
SELECT 
    p.id,
    p.nome,
    p.preco,
    p.data_criacao,
    f.nome as fornecedor_nome,
    f.email as fornecedor_email
FROM produtos p
INNER JOIN fornecedores f ON p.fornecedor_id = f.id
WHERE p.status = 'pendente'
ORDER BY p.data_criacao DESC;

-- View: Entregas aguardando aprovação
CREATE OR REPLACE VIEW entregas_aguardando_aprovacao AS
SELECT 
    e.id,
    e.data_entrega,
    e.comissao,
    e.observacoes,
    en.nome as entregador_nome,
    en.telefone as entregador_telefone,
    p.cliente_nome,
    p.endereco_entrega
FROM entregas e
INNER JOIN entregadores en ON e.entregador_id = en.id
INNER JOIN pedidos p ON e.pedido_id = p.id
WHERE e.status = 'entregue' AND e.aprovado_por_admin = false
ORDER BY e.data_entrega DESC;

-- View: Pagamentos pendentes (geral)
CREATE OR REPLACE VIEW pagamentos_pendentes_geral AS
SELECT 
    'fornecedor' as tipo,
    pf.id,
    f.nome as beneficiario,
    pf.valor,
    pf.data_criacao,
    pf.periodo_inicio,
    pf.periodo_fim
FROM pagamentos_fornecedores pf
INNER JOIN fornecedores f ON pf.fornecedor_id = f.id
WHERE pf.status = 'pendente'
UNION ALL
SELECT 
    'entregador' as tipo,
    pe.id,
    e.nome as beneficiario,
    pe.valor,
    pe.data_criacao,
    pe.periodo_inicio,
    pe.periodo_fim
FROM pagamentos_entregadores pe
INNER JOIN entregadores e ON pe.entregador_id = e.id
WHERE pe.status = 'pendente'
ORDER BY data_criacao DESC;

-- View: Dashboard do Admin
CREATE OR REPLACE VIEW dashboard_admin AS
SELECT
    (SELECT COUNT(*) FROM fornecedores WHERE status = 'ativo') as fornecedores_ativos,
    (SELECT COUNT(*) FROM entregadores WHERE ativo = true) as entregadores_ativos,
    (SELECT COUNT(*) FROM produtos WHERE status = 'pendente') as produtos_pendentes,
    (SELECT COUNT(*) FROM entregas WHERE status = 'entregue' AND aprovado_por_admin = false) as entregas_aguardando,
    (SELECT COUNT(*) FROM pagamentos_fornecedores WHERE status = 'pendente') as pagamentos_fornecedores_pendentes,
    (SELECT COUNT(*) FROM pagamentos_entregadores WHERE status = 'pendente') as pagamentos_entregadores_pendentes,
    (SELECT COALESCE(SUM(valor), 0) FROM pagamentos_fornecedores WHERE status = 'pendente') as valor_pendente_fornecedores,
    (SELECT COALESCE(SUM(valor), 0) FROM pagamentos_entregadores WHERE status = 'pendente') as valor_pendente_entregadores,
    (SELECT COALESCE(SUM(total), 0) FROM pedidos WHERE status = 'concluido' AND DATE(data_pedido) = CURRENT_DATE) as vendas_hoje;

-- ===== FUNÇÕES =====

-- Função: Atualizar total de vendas do fornecedor
CREATE OR REPLACE FUNCTION atualizar_total_vendas_fornecedor()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE fornecedores
        SET total_vendas = (
            SELECT COALESCE(SUM(ip.preco * ip.quantidade), 0)
            FROM itens_pedido ip
            INNER JOIN produtos p ON ip.produto_id = p.id
            INNER JOIN pedidos ped ON ip.pedido_id = ped.id
            WHERE p.fornecedor_id = NEW.fornecedor_id
            AND ped.status = 'concluido'
        )
        WHERE id = NEW.fornecedor_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Atualizar vendas quando pedido for concluído
CREATE TRIGGER trigger_atualizar_vendas_fornecedor
AFTER INSERT OR UPDATE OF status ON pedidos
FOR EACH ROW
WHEN (NEW.status = 'concluido')
EXECUTE FUNCTION atualizar_total_vendas_fornecedor();

-- ===== COMENTÁRIOS =====
COMMENT ON TABLE historico_admin IS 'Registra todas as ações realizadas pelos administradores';
COMMENT ON TABLE notificacoes IS 'Notificações para fornecedores sobre produtos, pagamentos, etc';
COMMENT ON VIEW produtos_pendentes IS 'Lista produtos aguardando aprovação do admin';
COMMENT ON VIEW entregas_aguardando_aprovacao IS 'Lista entregas concluídas aguardando aprovação';
COMMENT ON VIEW pagamentos_pendentes_geral IS 'Lista todos os pagamentos pendentes (fornecedores + entregadores)';
COMMENT ON VIEW dashboard_admin IS 'Estatísticas principais para o dashboard do admin';

-- ===== DADOS INICIAIS =====

-- Atualizar produtos existentes para status 'ativo' (se não tiverem status)
UPDATE produtos SET status = 'ativo' WHERE status IS NULL;

-- ===== PERMISSÕES RLS =====

-- Histórico admin (apenas admins podem ver)
ALTER TABLE historico_admin ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Apenas admins veem histórico"
ON historico_admin FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM usuarios
        WHERE id = auth.uid()::bigint AND papel = 'admin'
    )
);

-- Notificações (usuários veem apenas suas notificações)
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários veem suas notificações"
ON notificacoes FOR SELECT
USING (usuario_id = auth.uid()::bigint);

CREATE POLICY "Usuários atualizam suas notificações"
ON notificacoes FOR UPDATE
USING (usuario_id = auth.uid()::bigint);

COMMENT ON SCHEMA public IS 'Schema completo do sistema com controle total do Admin';
