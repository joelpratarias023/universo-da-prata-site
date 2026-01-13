// Configuração da API
const API_URL = 'http://localhost:3001/api';

// ⚠️ MODO DEMO - Remova esta variável quando o login estiver configurado
const MODO_DEMO = true;

// Estado da aplicação
let fornecedorDados = null;
let token = null;
let dashboardData = null;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
    inicializarEventListeners();
});

// Verificar autenticação
function verificarAutenticacao() {
    // ⚠️ MODO DEMO - Quando o login estiver pronto, mude MODO_DEMO para false
    if (MODO_DEMO) {
        // Mostrar aviso de modo demo
        document.getElementById('avisoDemo').style.display = 'block';
        document.body.classList.add('modo-demo');
        
        // Dados de exemplo para demonstração
        fornecedorDados = {
            id: 1,
            uuid: 'demo-uuid-123',
            nome: 'Fornecedor Demonstração',
            email: 'fornecedor@demo.com',
            cnpj: '12.345.678/0001-90',
            telefone: '(11) 98765-4321'
        };
        token = 'demo-token-12345';
        document.getElementById('userName').textContent = fornecedorDados.nome;
        carregarDadosDemo();
        return;
    }

    // Código original de autenticação (ative quando o Supabase estiver configurado)
    token = localStorage.getItem('fornecedor_token');
    const dados = localStorage.getItem('fornecedor_dados');

    if (!token || !dados) {
        window.location.href = 'fornecedor-login.html';
        return;
    }

    fornecedorDados = JSON.parse(dados);
    document.getElementById('userName').textContent = fornecedorDados.nome;

    // Carregar dados iniciais
    carregarDashboard();
}

// Inicializar event listeners
function inicializarEventListeners() {
    // Navegação
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            navegarPara(section);
        });
    });

    // Logout
    document.getElementById('btnLogout').addEventListener('click', logout);

    // Formulários
    document.getElementById('perfilForm').addEventListener('submit', atualizarPerfil);
    document.getElementById('senhaForm').addEventListener('submit', alterarSenha);

    // Modal
    const modal = document.getElementById('produtoModal');
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
}

// Navegação entre seções
function navegarPara(section) {
    // Atualizar menu
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');

    // Atualizar conteúdo
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(section).classList.add('active');

    // Carregar dados específicos da seção
    carregarSecao(section);
}

// Carregar dados de uma seção
async function carregarSecao(section) {
    if (MODO_DEMO) {
        carregarSecaoDemo(section);
        return;
    }

    switch (section) {
        case 'dashboard':
            await carregarDashboard();
            break;
        case 'produtos':
            await carregarProdutos();
            break;
        case 'vendas':
            await carregarVendas();
            break;
        case 'financeiro':
            await carregarFinanceiro();
            break;
        case 'perfil':
            await carregarPerfil();
            break;
    }
}

// Função auxiliar para fazer requisições
async function fazerRequisicao(endpoint, options = {}) {
    if (MODO_DEMO) {
        // Em modo demo, retorna dados mockados
        return getDadosDemo(endpoint);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...options.headers,
            },
        });

        if (response.status === 401) {
            // Token inválido
            logout();
            throw new Error('Sessão expirada');
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.mensagem || 'Erro na requisição');
        }

        return data;
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
}

// Carregar dashboard
async function carregarDashboard() {
    try {
        const data = await fazerRequisicao('/fornecedores/dashboard');
        dashboardData = data;

        // Atualizar estatísticas
        document.getElementById('totalPecas').textContent = data.estatisticas.totalProdutos || 0;
        document.getElementById('pecasVendidas').textContent = data.estatisticas.pecasVendidas || 0;
        document.getElementById('pecasEstoque').textContent = data.estatisticas.produtosEstoque || 0;
        document.getElementById('valorReceber').textContent = formatarMoeda(data.financeiro.valorPendente || 0);

        // Atualizar resumo financeiro
        document.getElementById('totalFaturado').textContent = formatarMoeda(data.financeiro.totalFaturado || 0);
        document.getElementById('comissao').textContent = formatarMoeda(data.financeiro.comissaoPlataforma || 0);
        document.getElementById('valorLiquido').textContent = formatarMoeda(data.financeiro.valorLiquido || 0);
        document.getElementById('valorPago').textContent = formatarMoeda(data.financeiro.valorPago || 0);
        document.getElementById('valorPendente').textContent = formatarMoeda(data.financeiro.valorPendente || 0);

    } catch (error) {
        mostrarNotificacao('Erro ao carregar dashboard: ' + error.message, 'error');
    }
}

// Carregar produtos
async function carregarProdutos() {
    const tbody = document.getElementById('produtosTable');
    tbody.innerHTML = '<tr><td colspan="7" class="loading">Carregando produtos...</td></tr>';

    try {
        const data = await fazerRequisicao('/fornecedores/produtos');
        const produtos = data.produtos || [];

        if (produtos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty">Nenhum produto cadastrado</td></tr>';
            return;
        }

        tbody.innerHTML = produtos.map(produto => `
            <tr>
                <td>${produto.nome}</td>
                <td>${produto.uuid?.substring(0, 8) || 'N/A'}</td>
                <td>${produto.estoque || 0}</td>
                <td>${formatarMoeda(produto.preco)}</td>
                <td>${produto.total_vendido || 0}</td>
                <td><span class="status-badge ${produto.ativo ? 'ativo' : 'inativo'}">${produto.ativo ? 'Ativo' : 'Inativo'}</span></td>
                <td><button class="btn-view" onclick="verProduto('${produto.id}')">Ver</button></td>
            </tr>
        `).join('');

    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty">Erro ao carregar produtos</td></tr>';
        mostrarNotificacao('Erro ao carregar produtos: ' + error.message, 'error');
    }
}

// Ver detalhes do produto
async function verProduto(id) {
    try {
        const data = await fazerRequisicao(`/fornecedores/produtos/${id}`);
        const produto = data.produto;

        const modal = document.getElementById('produtoModal');
        document.getElementById('modalProdutoNome').textContent = produto.nome;
        
        const detalhes = `
            <div class="produto-detalhes">
                <p><strong>Código:</strong> ${produto.uuid}</p>
                <p><strong>Categoria:</strong> ${produto.categoria_nome || 'N/A'}</p>
                <p><strong>Descrição:</strong> ${produto.descricao || 'N/A'}</p>
                <p><strong>Preço:</strong> ${formatarMoeda(produto.preco)}</p>
                <p><strong>Estoque:</strong> ${produto.estoque}</p>
                <p><strong>Total Vendido:</strong> ${produto.historico_vendas?.length || 0} unidades</p>
                
                ${produto.historico_vendas && produto.historico_vendas.length > 0 ? `
                    <h3 style="margin-top: 20px;">Histórico de Vendas</h3>
                    <table class="data-table" style="margin-top: 10px;">
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Quantidade</th>
                                <th>Valor</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${produto.historico_vendas.map(v => `
                                <tr>
                                    <td>${formatarData(v.pedidos.created_at)}</td>
                                    <td>${v.quantidade}</td>
                                    <td>${formatarMoeda(v.preco_unitario * v.quantidade)}</td>
                                    <td><span class="status-badge ${v.pedidos.status}">${v.pedidos.status}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : '<p style="margin-top: 20px;">Nenhuma venda registrada</p>'}
            </div>
        `;

        document.getElementById('modalProdutoDetalhes').innerHTML = detalhes;
        modal.style.display = 'block';

    } catch (error) {
        mostrarNotificacao('Erro ao carregar produto: ' + error.message, 'error');
    }
}

// Carregar vendas
async function carregarVendas() {
    const tbody = document.getElementById('vendasTable');
    tbody.innerHTML = '<tr><td colspan="7" class="loading">Carregando vendas...</td></tr>';

    try {
        const data = await fazerRequisicao('/fornecedores/vendas');
        const vendas = data.vendas || [];

        if (vendas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty">Nenhuma venda registrada</td></tr>';
            return;
        }

        tbody.innerHTML = vendas.map(venda => `
            <tr>
                <td>${formatarData(venda.data_venda)}</td>
                <td>${venda.produto_nome}</td>
                <td>${venda.quantidade}</td>
                <td>${formatarMoeda(venda.preco_unitario)}</td>
                <td>${formatarMoeda(venda.valor_total)}</td>
                <td>${venda.cliente_nome || 'N/A'}</td>
                <td><span class="status-badge ${venda.status_pagamento}">${venda.status_pagamento}</span></td>
            </tr>
        `).join('');

    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty">Erro ao carregar vendas</td></tr>';
        mostrarNotificacao('Erro ao carregar vendas: ' + error.message, 'error');
    }
}

// Carregar financeiro
async function carregarFinanceiro() {
    try {
        const data = await fazerRequisicao('/fornecedores/financeiro');

        document.getElementById('finTotalFaturado').textContent = formatarMoeda(data.totalFaturado || 0);
        document.getElementById('finComissao').textContent = formatarMoeda(data.comissaoPlataforma || 0);
        document.getElementById('finValorLiquido').textContent = formatarMoeda(data.valorLiquido || 0);
        document.getElementById('finValorPago').textContent = formatarMoeda(data.valorPago || 0);
        document.getElementById('finValorPendente').textContent = formatarMoeda(data.valorPendente || 0);

        // Histórico de pagamentos (se houver)
        const tbody = document.getElementById('pagamentosTable');
        if (data.historico_pagamentos && data.historico_pagamentos.length > 0) {
            tbody.innerHTML = data.historico_pagamentos.map(pag => `
                <tr>
                    <td>${formatarData(pag.data_pagamento)}</td>
                    <td>${formatarMoeda(pag.valor)}</td>
                    <td>${pag.tipo_pagamento}</td>
                    <td>${pag.observacoes || '-'}</td>
                </tr>
            `).join('');
        }

    } catch (error) {
        mostrarNotificacao('Erro ao carregar dados financeiros: ' + error.message, 'error');
    }
}

// Carregar perfil
async function carregarPerfil() {
    try {
        const data = await fazerRequisicao('/fornecedores/perfil');
        const fornecedor = data.fornecedor;

        document.getElementById('perfilNome').value = fornecedor.nome || '';
        document.getElementById('perfilEmail').value = fornecedor.email || '';
        document.getElementById('perfilCNPJ').value = fornecedor.cnpj || '';
        document.getElementById('perfilTelefone').value = fornecedor.telefone || '';
        document.getElementById('perfilEndereco').value = fornecedor.endereco || '';

    } catch (error) {
        mostrarNotificacao('Erro ao carregar perfil: ' + error.message, 'error');
    }
}

// Atualizar perfil
async function atualizarPerfil(e) {
    e.preventDefault();

    const dados = {
        nome: document.getElementById('perfilNome').value,
        telefone: document.getElementById('perfilTelefone').value,
        endereco: document.getElementById('perfilEndereco').value,
    };

    try {
        await fazerRequisicao('/fornecedores/perfil', {
            method: 'PUT',
            body: JSON.stringify(dados),
        });

        mostrarNotificacao('Perfil atualizado com sucesso!', 'success');
        await carregarPerfil();

    } catch (error) {
        mostrarNotificacao('Erro ao atualizar perfil: ' + error.message, 'error');
    }
}

// Alterar senha
async function alterarSenha(e) {
    e.preventDefault();

    const senhaAtual = document.getElementById('senhaAtual').value;
    const novaSenha = document.getElementById('novaSenha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    if (novaSenha !== confirmarSenha) {
        mostrarNotificacao('As senhas não correspondem', 'error');
        return;
    }

    try {
        await fazerRequisicao('/fornecedores/alterar-senha', {
            method: 'PUT',
            body: JSON.stringify({
                senha_atual: senhaAtual,
                nova_senha: novaSenha,
                confirmar_senha: confirmarSenha,
            }),
        });

        mostrarNotificacao('Senha alterada com sucesso!', 'success');
        document.getElementById('senhaForm').reset();

    } catch (error) {
        mostrarNotificacao('Erro ao alterar senha: ' + error.message, 'error');
    }
}

// Logout
function logout() {
    localStorage.removeItem('fornecedor_token');
    localStorage.removeItem('fornecedor_dados');
    window.location.href = 'fornecedor-login.html';
}

// Funções auxiliares
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: 'EUR',
    }).format(valor || 0);
}

function formatarData(data) {
    if (!data) return 'N/A';
    return new Date(data).toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

function mostrarNotificacao(mensagem, tipo = 'info') {
    // Criar elemento de notificação
    const notif = document.createElement('div');
    notif.className = `notificacao notif-${tipo}`;
    notif.textContent = mensagem;
    notif.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        padding: 15px 25px;
        background: ${tipo === 'success' ? '#27ae60' : tipo === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notif);

    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// Adicionar estilos de animação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Tornar funções globais
window.verProduto = verProduto;

// ========================================
// MODO DEMO - DADOS DE EXEMPLO
// ========================================
// ⚠️ TODO: Remova esta seção quando o backend estiver configurado

function carregarDadosDemo() {
    carregarSecaoDemo('dashboard');
}

function carregarSecaoDemo(section) {
    switch (section) {
        case 'dashboard':
            carregarDashboardDemo();
            break;
        case 'produtos':
            carregarProdutosDemo();
            break;
        case 'vendas':
            carregarVendasDemo();
            break;
        case 'financeiro':
            carregarFinanceiroDemo();
            break;
        case 'perfil':
            carregarPerfilDemo();
            break;
    }
}

function carregarDashboardDemo() {
    // Estatísticas de exemplo
    document.getElementById('totalPecas').textContent = '156';
    document.getElementById('pecasVendidas').textContent = '89';
    document.getElementById('pecasEstoque').textContent = '67';
    document.getElementById('valorReceber').textContent = formatarMoeda(8450.00);

    // Resumo financeiro
    document.getElementById('totalFaturado').textContent = formatarMoeda(12450.00);
    document.getElementById('comissao').textContent = formatarMoeda(1245.00);
    document.getElementById('valorLiquido').textContent = formatarMoeda(11205.00);
    document.getElementById('valorPago').textContent = formatarMoeda(2755.00);
    document.getElementById('valorPendente').textContent = formatarMoeda(8450.00);
}

function carregarProdutosDemo() {
    const tbody = document.getElementById('produtosTable');
    
    const produtosDemo = [
        { id: 1, nome: 'Anel de Prata 925', codigo: 'AP001', estoque: 15, preco: 89.90, vendido: 23, status: 'ativo' },
        { id: 2, nome: 'Colar com Pingente', codigo: 'CP002', estoque: 8, preco: 149.90, vendido: 12, status: 'ativo' },
        { id: 3, nome: 'Brincos Argola', codigo: 'BA003', estoque: 22, preco: 69.90, vendido: 35, status: 'ativo' },
        { id: 4, nome: 'Pulseira Charm', codigo: 'PC004', estoque: 10, preco: 129.90, vendido: 15, status: 'ativo' },
        { id: 5, nome: 'Tornozeleira Delicada', codigo: 'TD005', estoque: 12, preco: 79.90, vendido: 4, status: 'ativo' }
    ];

    tbody.innerHTML = produtosDemo.map(p => `
        <tr>
            <td>${p.nome}</td>
            <td>${p.codigo}</td>
            <td>${p.estoque}</td>
            <td>${formatarMoeda(p.preco)}</td>
            <td>${p.vendido}</td>
            <td><span class="status-badge ${p.status}">${p.status === 'ativo' ? 'Ativo' : 'Inativo'}</span></td>
            <td><button class="btn-view" onclick="verProdutoDemo(${p.id})">Ver</button></td>
        </tr>
    `).join('');
}

function carregarVendasDemo() {
    const tbody = document.getElementById('vendasTable');
    
    const vendasDemo = [
        { data: '2026-01-04', produto: 'Anel de Prata 925', quantidade: 2, preco: 89.90, cliente: 'Maria Silva', status: 'pago' },
        { data: '2026-01-03', produto: 'Colar com Pingente', quantidade: 1, preco: 149.90, cliente: 'João Santos', status: 'pendente' },
        { data: '2026-01-03', produto: 'Brincos Argola', quantidade: 3, preco: 69.90, cliente: 'Ana Costa', status: 'pago' },
        { data: '2026-01-02', produto: 'Pulseira Charm', quantidade: 1, preco: 129.90, cliente: 'Pedro Lima', status: 'pago' },
        { data: '2026-01-01', produto: 'Tornozeleira Delicada', quantidade: 2, preco: 79.90, cliente: 'Sofia Rodrigues', status: 'pendente' }
    ];

    tbody.innerHTML = vendasDemo.map(v => `
        <tr>
            <td>${formatarData(v.data)}</td>
            <td>${v.produto}</td>
            <td>${v.quantidade}</td>
            <td>${formatarMoeda(v.preco)}</td>
            <td>${formatarMoeda(v.preco * v.quantidade)}</td>
            <td>${v.cliente}</td>
            <td><span class="status-badge ${v.status}">${v.status}</span></td>
        </tr>
    `).join('');
}

function carregarFinanceiroDemo() {
    document.getElementById('finTotalFaturado').textContent = formatarMoeda(12450.00);
    document.getElementById('finComissao').textContent = formatarMoeda(1245.00);
    document.getElementById('finValorLiquido').textContent = formatarMoeda(11205.00);
    document.getElementById('finValorPago').textContent = formatarMoeda(2755.00);
    document.getElementById('finValorPendente').textContent = formatarMoeda(8450.00);

    // Histórico de pagamentos (vazio por enquanto)
    const tbody = document.getElementById('pagamentosTable');
    tbody.innerHTML = '<tr><td colspan="4" class="empty">Nenhum pagamento registrado ainda</td></tr>';
}

function carregarPerfilDemo() {
    document.getElementById('perfilNome').value = fornecedorDados.nome;
    document.getElementById('perfilEmail').value = fornecedorDados.email;
    document.getElementById('perfilCNPJ').value = fornecedorDados.cnpj || '';
    document.getElementById('perfilTelefone').value = fornecedorDados.telefone || '';
    document.getElementById('perfilEndereco').value = 'Rua Exemplo, 123 - São Paulo, SP';
}

function verProdutoDemo(id) {
    const produtosDemo = {
        1: { nome: 'Anel de Prata 925', codigo: 'AP001', categoria: 'Anéis', descricao: 'Anel em prata 925 com design moderno', preco: 89.90, estoque: 15, vendido: 23 },
        2: { nome: 'Colar com Pingente', codigo: 'CP002', categoria: 'Colares', descricao: 'Colar delicado com pingente de coração', preco: 149.90, estoque: 8, vendido: 12 },
        3: { nome: 'Brincos Argola', codigo: 'BA003', categoria: 'Brincos', descricao: 'Argolas em prata 925, tamanho médio', preco: 69.90, estoque: 22, vendido: 35 },
        4: { nome: 'Pulseira Charm', codigo: 'PC004', categoria: 'Pulseiras', descricao: 'Pulseira com berloques personalizáveis', preco: 129.90, estoque: 10, vendido: 15 },
        5: { nome: 'Tornozeleira Delicada', codigo: 'TD005', categoria: 'Tornozeleiras', descricao: 'Tornozeleira fina em prata 925', preco: 79.90, estoque: 12, vendido: 4 }
    };

    const produto = produtosDemo[id];
    if (!produto) return;

    const modal = document.getElementById('produtoModal');
    document.getElementById('modalProdutoNome').textContent = produto.nome;
    
    const detalhes = `
        <div class="produto-detalhes">
            <p><strong>Código:</strong> ${produto.codigo}</p>
            <p><strong>Categoria:</strong> ${produto.categoria}</p>
            <p><strong>Descrição:</strong> ${produto.descricao}</p>
            <p><strong>Preço:</strong> ${formatarMoeda(produto.preco)}</p>
            <p><strong>Estoque:</strong> ${produto.estoque} unidades</p>
            <p><strong>Total Vendido:</strong> ${produto.vendido} unidades</p>
            <p style="margin-top: 15px; color: #aaa; font-size: 14px;">
                <em>💡 Dados de demonstração - conecte ao backend para ver dados reais</em>
            </p>
        </div>
    `;

    document.getElementById('modalProdutoDetalhes').innerHTML = detalhes;
    modal.style.display = 'block';
}

function getDadosDemo(endpoint) {
    // Retorna promessa com dados mockados baseado no endpoint
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ sucesso: true, mensagem: 'Dados demo' });
        }, 100);
    });
}

// Tornar função global
window.verProdutoDemo = verProdutoDemo;
