-- =====================================
-- Script de Dados de Exemplo
-- Universo da Prata
-- =====================================

USE universo_prata;

-- =====================================
-- Limpar dados antigos (OPCIONAL)
-- =====================================
-- DELETE FROM avaliacoes;
-- DELETE FROM itens_pedido;
-- DELETE FROM pedidos;
-- DELETE FROM produtos;
-- DELETE FROM categorias;
-- DELETE FROM enderecos;
-- DELETE FROM usuarios;

-- =====================================
-- CATEGORIAS DE PRODUTOS
-- =====================================

INSERT INTO categorias (uuid, nome, descricao, imagem_url, ordem, ativa) VALUES
('cat-001', 'Broches', 'Broches elegantes de prata e ouro', 'https://via.placeholder.com/300?text=Broches', 1, true),
('cat-002', 'Anéis', 'Anéis em diversos tamanhos e modelos', 'https://via.placeholder.com/300?text=Aneis', 2, true),
('cat-003', 'Colares', 'Colares e correntes de qualidade premium', 'https://via.placeholder.com/300?text=Colares', 3, true),
('cat-004', 'Brincos', 'Brincos delicados e pendentes', 'https://via.placeholder.com/300?text=Brincos', 4, true),
('cat-005', 'Pulseiras', 'Pulseiras e braceletes sofisticados', 'https://via.placeholder.com/300?text=Pulseiras', 5, true),
('cat-006', 'Conjuntos', 'Conjuntos completos de joias', 'https://via.placeholder.com/300?text=Conjuntos', 6, true)
ON DUPLICATE KEY UPDATE nome=nome;

-- =====================================
-- PRODUTOS DE EXEMPLO
-- =====================================

INSERT INTO produtos (uuid, nome, descricao, preco, categoria_id, imagem_url, estoque, avaliacao_media, numero_avaliacoes, ativo) VALUES

-- Broches
('prod-001', 'Broche Ouro Premium', 'Broche feito em ouro 18k com acabamento impecável. Perfeito para ocasiões especiais.', 450.00, 1, 'https://via.placeholder.com/300?text=Broche+Ouro', 15, 4.8, 12, true),
('prod-002', 'Broche Prata Clássico', 'Broche em prata pura com design clássico atemporal. Ideal para uso diário.', 250.00, 1, 'https://via.placeholder.com/300?text=Broche+Prata', 25, 4.5, 8, true),
('prod-003', 'Broche com Pedras', 'Broche decorado com pedras semipreciosas. Elegante e sofisticado.', 350.00, 1, 'https://via.placeholder.com/300?text=Broche+Pedras', 10, 4.7, 6, true),
('prod-004', 'Broche Vintage', 'Broche estilo vintage com design único e especial. Colecionável.', 320.00, 1, 'https://via.placeholder.com/300?text=Broche+Vintage', 5, 5.0, 3, true),

-- Anéis
('prod-005', 'Anel de Ouro Sólido', 'Anel em ouro 18k com acabamento polido. Disponível em vários tamanhos.', 580.00, 2, 'https://via.placeholder.com/300?text=Anel+Ouro', 20, 4.9, 15, true),
('prod-006', 'Anel de Diamante', 'Anel com diamante natural certificado. Luxo e elegância.', 1200.00, 2, 'https://via.placeholder.com/300?text=Anel+Diamante', 3, 5.0, 5, true),
('prod-007', 'Anel de Prata com Esmeralda', 'Anel em prata com esmeralda colombiana. Belo e valioso.', 420.00, 2, 'https://via.placeholder.com/300?text=Anel+Esmeralda', 8, 4.6, 4, true),
('prod-008', 'Anel Minimalista', 'Anel simples e elegante em prata. Perfeito para o dia a dia.', 180.00, 2, 'https://via.placeholder.com/300?text=Anel+Minimalista', 35, 4.4, 10, true),

-- Colares
('prod-009', 'Colar de Ouro com Pingente', 'Colar em ouro 18k com pingente de diamante. Sofisticado.', 650.00, 3, 'https://via.placeholder.com/300?text=Colar+Ouro', 12, 4.8, 9, true),
('prod-010', 'Colar de Prata Corrente', 'Colar em prata com corrente fina. Versátil para qualquer ocasião.', 200.00, 3, 'https://via.placeholder.com/300?text=Colar+Corrente', 40, 4.3, 14, true),
('prod-011', 'Colar Longo Pérolas', 'Colar comprido com pérolas cultivadas. Elegante e clássico.', 380.00, 3, 'https://via.placeholder.com/300?text=Colar+Perolas', 7, 4.7, 5, true),
('prod-012', 'Colar Vintage com Cristal', 'Colar estilo vintage com cristal tcheco. Único e especial.', 280.00, 3, 'https://via.placeholder.com/300?text=Colar+Cristal', 9, 4.5, 3, true),

-- Brincos
('prod-013', 'Brincos de Ouro Premium', 'Brincos em ouro 18k com peso apropriado. Confortáveis para uso prolongado.', 350.00, 4, 'https://via.placeholder.com/300?text=Brincos+Ouro', 18, 4.9, 11, true),
('prod-014', 'Brincos de Pérola', 'Brincos com pérolas de qualidade. Clássicos e sofisticados.', 220.00, 4, 'https://via.placeholder.com/300?text=Brincos+Perola', 25, 4.6, 8, true),
('prod-015', 'Brincos Pendentes Compridos', 'Brincos pendentes em prata com design moderno. Perfeito para festas.', 160.00, 4, 'https://via.placeholder.com/300?text=Brincos+Pendentes', 30, 4.4, 12, true),
('prod-016', 'Brincos de Diamante', 'Brincos com diamantes certificados. Investimento e luxo.', 950.00, 4, 'https://via.placeholder.com/300?text=Brincos+Diamante', 2, 5.0, 2, true),

-- Pulseiras
('prod-017', 'Pulseira de Ouro Maciço', 'Pulseira em ouro 18k maciço com fecho seguro. Durável e bela.', 780.00, 5, 'https://via.placeholder.com/300?text=Pulseira+Ouro', 10, 4.8, 7, true),
('prod-018', 'Pulseira de Prata Fina', 'Pulseira em prata fina com design elegante. Leve e confortável.', 240.00, 5, 'https://via.placeholder.com/300?text=Pulseira+Prata', 22, 4.5, 9, true),
('prod-019', 'Pulseira com Pedras Naturais', 'Pulseira com pedras naturais variadas. Estilo boho chic.', 190.00, 5, 'https://via.placeholder.com/300?text=Pulseira+Pedras', 16, 4.3, 6, true),
('prod-020', 'Pulseira Couro e Prata', 'Pulseira combinando couro premium com prata. Moderno e sofisticado.', 210.00, 5, 'https://via.placeholder.com/300?text=Pulseira+Couro', 14, 4.6, 8, true),

-- Conjuntos
('prod-021', 'Conjunto Noiva Premium', 'Conjunto completo para noivas: colar, brincos, anel, pulseira. Ouro 18k.', 2500.00, 6, 'https://via.placeholder.com/300?text=Conjunto+Noiva', 1, 5.0, 1, true),
('prod-022', 'Conjunto Prata Elegante', 'Conjunto em prata com 4 peças: colar, 2 brincos, pulseira.', 580.00, 6, 'https://via.placeholder.com/300?text=Conjunto+Prata', 5, 4.7, 3, true),
('prod-023', 'Conjunto Festivo Ouro', 'Conjunto 3 peças para festas: brincos, anel, colar. Ouro premium.', 1200.00, 6, 'https://via.placeholder.com/300?text=Conjunto+Festivo', 3, 4.8, 2, true),
('prod-024', 'Conjunto Casual Prata', 'Conjunto casual 2 peças: brinco e pulseira em prata. Versátil.', 320.00, 6, 'https://via.placeholder.com/300?text=Conjunto+Casual', 12, 4.4, 4, true)

ON DUPLICATE KEY UPDATE preco=preco;

-- =====================================
-- USUÁRIOS DE EXEMPLO
-- =====================================

-- Senha: Admin@123
-- Hash bcrypt: $2a$10$...
INSERT INTO usuarios (uuid, nome, email, cpf, telefone, senha, tipo, status) VALUES
('usr-admin-001', 'Administrador', 'admin@universo.com', NULL, '+244912345000', '$2a$10$7gVkZqL6pVZQXsIqZN7tTOjBQDpW8k.5cVG.1xKs8D7Yc4h4cHXMS', 'admin', 'ativo'),
('usr-ent-001', 'João Entregador', 'joao.entregador@universo.com', '12345678900', '+244912345001', '$2a$10$7gVkZqL6pVZQXsIqZN7tTOjBQDpW8k.5cVG.1xKs8D7Yc4h4cHXMS', 'entregador', 'ativo'),
('usr-cli-001', 'Maria Silva', 'maria@email.com', '98765432100', '+244912345002', '$2a$10$7gVkZqL6pVZQXsIqZN7tTOjBQDpW8k.5cVG.1xKs8D7Yc4h4cHXMS', 'cliente', 'ativo'),
('usr-cli-002', 'Carlos Santos', 'carlos@email.com', '11122233344', '+244912345003', '$2a$10$7gVkZqL6pVZQXsIqZN7tTOjBQDpW8k.5cVG.1xKs8D7Yc4h4cHXMS', 'cliente', 'ativo'),
('usr-cli-003', 'Ana Costa', 'ana@email.com', '55566677788', '+244912345004', '$2a$10$7gVkZqL6pVZQXsIqZN7tTOjBQDpW8k.5cVG.1xKs8D7Yc4h4cHXMS', 'cliente', 'ativo')
ON DUPLICATE KEY UPDATE email=email;

-- =====================================
-- ENDEREÇOS DE EXEMPLO
-- =====================================

INSERT INTO enderecos (uuid, usuario_id, endereco, numero, complemento, bairro, cidade, estado, cep, principal) VALUES
('addr-001', 3, 'Avenida Revolucionária', '123', 'Apto 456', 'Maianga', 'Luanda', 'LA', '00000', true),
('addr-002', 3, 'Rua dos Passos', '789', 'Casa 10', 'Kinaxixi', 'Luanda', 'LA', '00001', false),
('addr-003', 4, 'Avenida Agostinho Neto', '456', '', 'Roçado', 'Luanda', 'LA', '00002', true),
('addr-004', 5, 'Rua da Misericórdia', '100', 'Loja 5', 'Baixa', 'Luanda', 'LA', '00003', true)
ON DUPLICATE KEY UPDATE endereco=endereco;

-- =====================================
-- PEDIDOS DE EXEMPLO
-- =====================================

INSERT INTO pedidos (uuid, usuario_id, numero_pedido, status, valor_total, taxa_entrega, desconto, endereco_entrega, observacoes) VALUES
('ped-001', 3, 'PED-20251216-001', 'entregue', 850.00, 50.00, 0, 1, 'Entregue com sucesso'),
('ped-002', 4, 'PED-20251216-002', 'em_entrega', 1200.00, 50.00, 100.00, 3, 'Aguardando entrega'),
('ped-003', 5, 'PED-20251216-003', 'confirmado', 650.00, 50.00, 0, 4, 'Pedido confirmado'),
('ped-004', 3, 'PED-20251216-004', 'pendente', 450.00, 50.00, 50.00, 1, 'Novo pedido')
ON DUPLICATE KEY UPDATE numero_pedido=numero_pedido;

-- =====================================
-- ITENS DO PEDIDO
-- =====================================

INSERT INTO itens_pedido (uuid, pedido_id, produto_id, quantidade, preco_unitario, subtotal) VALUES
-- Pedido 1
('item-001', 1, 1, 1, 450.00, 450.00),
('item-002', 1, 5, 1, 250.00, 250.00),
('item-003', 1, 10, 2, 75.00, 150.00),

-- Pedido 2
('item-004', 2, 6, 1, 1200.00, 1200.00),

-- Pedido 3
('item-005', 3, 9, 1, 650.00, 650.00),

-- Pedido 4
('item-006', 4, 2, 1, 250.00, 250.00),
('item-007', 4, 14, 1, 200.00, 200.00)
ON DUPLICATE KEY UPDATE subtotal=subtotal;

-- =====================================
-- AVALIAÇÕES DE EXEMPLO
-- =====================================

INSERT INTO avaliacoes (uuid, produto_id, usuario_id, estrelas, comentario) VALUES
('av-001', 1, 3, 5, 'Produto excelente! Qualidade superior, entrega rápida. Super recomendo!'),
('av-002', 1, 4, 4, 'Muito bom, mas o preço é um pouco alto.'),
('av-003', 5, 3, 5, 'Anel perfeito! Acabamento impecável.'),
('av-004', 10, 5, 3, 'Bom produto, mas esperava um pouco mais.'),
('av-005', 9, 4, 5, 'Colar lindo! Recomendo para ocasiões especiais.'),
('av-006', 2, 3, 4, 'Broche muito elegante. Vale a pena!'),
('av-007', 14, 5, 5, 'Brincos lindíssimos! Meus preferidos!'),
('av-008', 18, 4, 4, 'Ótima qualidade de pulseira. Muito confortável.')
ON DUPLICATE KEY UPDATE estrelas=estrelas;

-- =====================================
-- Atualizar estatísticas de produtos
-- =====================================

UPDATE produtos SET avaliacao_media = 4.5, numero_avaliacoes = 2 WHERE id = 1;
UPDATE produtos SET avaliacao_media = 4.0, numero_avaliacoes = 1 WHERE id = 2;
UPDATE produtos SET avaliacao_media = 5.0, numero_avaliacoes = 1 WHERE id = 5;
UPDATE produtos SET avaliacao_media = 3.0, numero_avaliacoes = 1 WHERE id = 10;
UPDATE produtos SET avaliacao_media = 5.0, numero_avaliacoes = 1 WHERE id = 9;
UPDATE produtos SET avaliacao_media = 5.0, numero_avaliacoes = 1 WHERE id = 14;
UPDATE produtos SET avaliacao_media = 4.0, numero_avaliacoes = 1 WHERE id = 18;

-- =====================================
-- Fim do Script
-- =====================================

-- Verificar dados inseridos
SELECT 'Categorias:' as '';
SELECT COUNT(*) FROM categorias;

SELECT 'Produtos:' as '';
SELECT COUNT(*) FROM produtos;

SELECT 'Usuários:' as '';
SELECT COUNT(*) FROM usuarios;

SELECT 'Endereços:' as '';
SELECT COUNT(*) FROM enderecos;

SELECT 'Pedidos:' as '';
SELECT COUNT(*) FROM pedidos;

SELECT 'Itens de Pedido:' as '';
SELECT COUNT(*) FROM itens_pedido;

SELECT 'Avaliações:' as '';
SELECT COUNT(*) FROM avaliacoes;
