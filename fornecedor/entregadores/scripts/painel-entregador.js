// Configuração da API
const API_URL = 'http://localhost:3001/api';

// ⚠️ MODO DEMO - Remova esta variável quando o login estiver configurado
const MODO_DEMO = true;

// Estado da aplicação
let entregadorDados = null;
let token = null;
let entregaAtual = null;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
    criarEstrelas();
    inicializarEventListeners();
});

// Verificar autenticação
function verificarAutenticacao() {
    if (MODO_DEMO) {
        document.getElementById('avisoDemo').style.display = 'block';
        document.body.classList.add('modo-demo');
        
        // Dados de exemplo
        entregadorDados = {
            id: 1,
            nome: 'João Silva',
            email: 'joao@entregador.com',
            telefone: '(11) 98765-4321',
            cpf: '123.456.789-00',
            veiculo: 'Moto Honda CG 160'
        };
        token = 'demo-token';
        document.getElementById('userName').textContent = entregadorDados.nome;
        carregarDadosDemo();
        return;
    }

    token = localStorage.getItem('entregador_token');
    const dados = localStorage.getItem('entregador_dados');

    if (!token || !dados) {
        window.location.href = 'entregador-login.html';
        return;
    }

    entregadorDados = JSON.parse(dados);
    document.getElementById('userName').textContent = entregadorDados.nome;
    carregarDados();
}

// Criar estrelas
function criarEstrelas() {
    const container = document.getElementById('stars-container');
    const numeroEstrelas = 80;

    for (let i = 0; i < numeroEstrelas; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const tamanho = Math.random() * 3 + 1;
        star.style.width = `${tamanho}px`;
        star.style.height = `${tamanho}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.animationDuration = `${Math.random() * 10 + 15}s`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(star);
    }
}

// Event listeners
function inicializarEventListeners() {
    // Navegação
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const secao = e.currentTarget.dataset.section;
            navegarPara(secao);
        });
    });

    // Logout
    document.getElementById('btnLogout').addEventListener('click', () => {
        if (confirm('Tem certeza que deseja sair?')) {
            localStorage.removeItem('entregador_token');
            localStorage.removeItem('entregador_dados');
            window.location.href = 'entregador-login.html';
        }
    });

    // Filtros de entrega
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const status = e.target.dataset.status;
            filtrarEntregas(status);
        });
    });

    // Ano dos ganhos
    document.getElementById('anoSelect')?.addEventListener('change', (e) => {
        carregarGanhos(e.target.value);
    });

    // Forms
    document.getElementById('perfilForm')?.addEventListener('submit', salvarPerfil);
    document.getElementById('bancarioForm')?.addEventListener('submit', salvarPerfil);

    // Modal
    document.querySelector('.modal-close')?.addEventListener('click', fecharModal);
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('entregaModal');
        if (e.target === modal) {
            fecharModal();
        }
    });
}

// Navegação
function navegarPara(secao) {
    // Atualizar nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === secao) {
            item.classList.add('active');
        }
    });

    // Mostrar seção
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(secao)?.classList.add('active');

    // Carregar dados específicos
    if (secao === 'ganhos') {
        carregarGanhos();
    } else if (secao === 'pagamentos') {
        carregarPagamentos();
    } else if (secao === 'perfil') {
        carregarPerfil();
    }
}

// ===== CARREGAR DADOS (MODO DEMO) =====

function carregarDadosDemo() {
    carregarDashboardDemo();
    carregarEntregasDemo();
}

function carregarDashboardDemo() {
    document.getElementById('totalEntregas').textContent = '47';
    document.getElementById('totalConcluidas').textContent = '42';
    document.getElementById('totalPendentes').textContent = '5';
    document.getElementById('ganhosDoMes').textContent = '€ 420,00';
    document.getElementById('ganhosTotal').textContent = '€ 2.340,00';
    document.getElementById('taxaConclusao').textContent = '89%';

    // Próximas entregas
    const entregasHoje = document.getElementById('entregasHoje');
    entregasHoje.innerHTML = `
        <div class="entrega-card">
            <div class="entrega-card-header">
                <span class="entrega-codigo">#ENT-${Date.now().toString().slice(-4)}</span>
                <span class="status-badge pendente">Pendente</span>
            </div>
            <div class="entrega-card-body">
                <p><strong>👤 Cliente:</strong> Maria Santos</p>
                <p><strong>📍 Endereço:</strong> Rua das Flores, 123 - Centro</p>
                <p><strong>📦 Produto:</strong> Colar de Prata 925</p>
                <p><strong>💰 Comissão:</strong> € 10,00</p>
            </div>
            <div class="entrega-card-footer">
                <button class="btn-primary btn-small" onclick="verEntregaDemo(1)">Ver Detalhes</button>
                <button class="btn-secondary btn-small" onclick="iniciarRota('Rua das Flores, 123')">🗺️ Rota</button>
            </div>
        </div>
        <div class="entrega-card">
            <div class="entrega-card-header">
                <span class="entrega-codigo">#ENT-${(Date.now() + 1).toString().slice(-4)}</span>
                <span class="status-badge pendente">Pendente</span>
            </div>
            <div class="entrega-card-body">
                <p><strong>👤 Cliente:</strong> Pedro Costa</p>
                <p><strong>📍 Endereço:</strong> Av. Principal, 456 - Jardim</p>
                <p><strong>📦 Produto:</strong> Anel de Prata</p>
                <p><strong>💰 Comissão:</strong> € 8,00</p>
            </div>
            <div class="entrega-card-footer">
                <button class="btn-primary btn-small" onclick="verEntregaDemo(2)">Ver Detalhes</button>
                <button class="btn-secondary btn-small" onclick="iniciarRota('Av. Principal, 456')">🗺️ Rota</button>
            </div>
        </div>
    `;
}

function carregarEntregasDemo() {
    const tbody = document.getElementById('entregasTable');
    
    const entregas = [
        { id: 1, codigo: 'ENT-2024', cliente: 'Maria Santos', endereco: 'Rua das Flores, 123', produto: 'Colar de Prata', comissao: 10.00, status: 'pendente' },
        { id: 2, codigo: 'ENT-2025', cliente: 'Pedro Costa', endereco: 'Av. Principal, 456', produto: 'Anel de Prata', comissao: 8.00, status: 'pendente' },
        { id: 3, codigo: 'ENT-2026', cliente: 'Ana Silva', endereco: 'Rua Central, 789', produto: 'Brincos', comissao: 12.00, status: 'em_rota' },
        { id: 4, codigo: 'ENT-2020', cliente: 'Carlos Alves', endereco: 'Rua Nova, 321', produto: 'Pulseira', comissao: 9.00, status: 'entregue' },
        { id: 5, codigo: 'ENT-2021', cliente: 'Lucia Mendes', endereco: 'Av. Brasil, 654', produto: 'Tornozeleira', comissao: 7.50, status: 'entregue' }
    ];

    tbody.innerHTML = entregas.map(e => `
        <tr>
            <td>${e.codigo}</td>
            <td>${e.cliente}</td>
            <td>${e.endereco}</td>
            <td>${e.produto}</td>
            <td>€ ${e.comissao.toFixed(2)}</td>
            <td><span class="status-badge ${e.status}">${formatarStatus(e.status)}</span></td>
            <td>
                <button class="btn-primary btn-small" onclick="verEntregaDemo(${e.id})">Ver</button>
            </td>
        </tr>
    `).join('');
}

function carregarGanhosDemo(ano = 2026) {
    const tbody = document.getElementById('ganhosTable');
    
    const meses = [
        { mes: 'Janeiro', entregas: 12, valor: 120.00 },
        { mes: 'Fevereiro', entregas: 15, valor: 150.00 },
        { mes: 'Março', entregas: 18, valor: 180.00 },
        { mes: 'Abril', entregas: 14, valor: 140.00 },
        { mes: 'Maio', entregas: 16, valor: 160.00 }
    ];

    tbody.innerHTML = meses.map(m => `
        <tr>
            <td>${m.mes}</td>
            <td>${m.entregas}</td>
            <td>€ ${m.valor.toFixed(2)}</td>
        </tr>
    `).join('');
}

function carregarPagamentosDemo() {
    document.getElementById('totalPago').textContent = '€ 1.920,00';
    document.getElementById('totalPendente').textContent = '€ 420,00';

    const tbody = document.getElementById('pagamentosTable');
    
    const pagamentos = [
        { data: '2026-01-01', periodo: 'Dez/2025', valor: 480.00, metodo: 'PIX', status: 'pago' },
        { data: '2025-12-01', periodo: 'Nov/2025', valor: 450.00, metodo: 'PIX', status: 'pago' },
        { data: '2025-11-01', periodo: 'Out/2025', valor: 520.00, metodo: 'Transferência', status: 'pago' },
        { data: null, periodo: 'Jan/2026', valor: 420.00, metodo: 'PIX', status: 'pendente' }
    ];

    tbody.innerHTML = pagamentos.map(p => `
        <tr>
            <td>${p.data ? formatarData(p.data) : '-'}</td>
            <td>${p.periodo}</td>
            <td>€ ${p.valor.toFixed(2)}</td>
            <td>${p.metodo}</td>
            <td><span class="status-badge ${p.status}">${p.status === 'pago' ? 'Pago' : 'Pendente'}</span></td>
        </tr>
    `).join('');
}

function carregarPerfilDemo() {
    document.getElementById('perfilNome').value = entregadorDados.nome;
    document.getElementById('perfilEmail').value = entregadorDados.email;
    document.getElementById('perfilTelefone').value = entregadorDados.telefone;
    document.getElementById('perfilCPF').value = entregadorDados.cpf;
    document.getElementById('perfilVeiculo').value = entregadorDados.veiculo;
    document.getElementById('perfilPix').value = entregadorDados.cpf;
    document.getElementById('perfilBanco').value = 'Banco Exemplo';
    document.getElementById('perfilAgencia').value = '1234';
    document.getElementById('perfilConta').value = '12345-6';
}

function verEntregaDemo(id) {
    const entregas = {
        1: {
            codigo: 'ENT-2024',
            cliente: 'Maria Santos',
            telefone: '(11) 98765-4321',
            endereco: 'Rua das Flores, 123 - Centro - CEP 01234-567',
            produto: 'Colar de Prata 925',
            comissao: 10.00,
            status: 'pendente',
            observacoes: 'Entregar após 18h'
        },
        2: {
            codigo: 'ENT-2025',
            cliente: 'Pedro Costa',
            telefone: '(11) 91234-5678',
            endereco: 'Av. Principal, 456 - Jardim - CEP 01234-890',
            produto: 'Anel de Prata',
            comissao: 8.00,
            status: 'pendente',
            observacoes: ''
        },
        3: {
            codigo: 'ENT-2026',
            cliente: 'Ana Silva',
            telefone: '(11) 99876-5432',
            endereco: 'Rua Central, 789 - Bairro Novo - CEP 02345-678',
            produto: 'Brincos de Argola',
            comissao: 12.00,
            status: 'em_rota',
            observacoes: 'Apartamento 501'
        }
    };

    const entrega = entregas[id] || entregas[1];
    entregaAtual = entrega;

    const modal = document.getElementById('entregaModal');
    document.getElementById('modalTitulo').textContent = `Entrega ${entrega.codigo}`;
    
    document.getElementById('modalDetalhes').innerHTML = `
        <div style="line-height: 1.8;">
            <p><strong>👤 Cliente:</strong> ${entrega.cliente}</p>
            <p><strong>📞 Telefone:</strong> ${entrega.telefone}</p>
            <p><strong>📍 Endereço:</strong> ${entrega.endereco}</p>
            <p><strong>📦 Produto:</strong> ${entrega.produto}</p>
            <p><strong>💰 Comissão:</strong> € ${entrega.comissao.toFixed(2)}</p>
            <p><strong>📊 Status:</strong> <span class="status-badge ${entrega.status}">${formatarStatus(entrega.status)}</span></p>
            ${entrega.observacoes ? `<p><strong>📝 Observações:</strong> ${entrega.observacoes}</p>` : ''}
            <p style="margin-top: 15px; color: #999; font-size: 0.9rem;">
                <em>💡 Modo demo - Em produção, você poderá atualizar o status real da entrega</em>
            </p>
        </div>
    `;

    // Mostrar botões conforme status
    const btnIniciar = document.getElementById('btnIniciarRota');
    const btnConfirmar = document.getElementById('btnConfirmarEntrega');
    
    if (entrega.status === 'pendente') {
        btnIniciar.style.display = 'inline-block';
        btnConfirmar.style.display = 'none';
        btnIniciar.onclick = () => atualizarStatusDemo('em_rota');
    } else if (entrega.status === 'em_rota') {
        btnIniciar.style.display = 'none';
        btnConfirmar.style.display = 'inline-block';
        btnConfirmar.onclick = () => atualizarStatusDemo('entregue');
    } else {
        btnIniciar.style.display = 'none';
        btnConfirmar.style.display = 'none';
    }

    // Botões de contato
    document.getElementById('btnLigarCliente').onclick = () => {
        window.location.href = `tel:${entrega.telefone}`;
    };
    
    document.getElementById('btnWhatsApp').onclick = () => {
        const numero = entrega.telefone.replace(/\D/g, '');
        window.open(`https://wa.me/351${numero}`, '_blank');
    };

    modal.style.display = 'block';
}

function atualizarStatusDemo(novoStatus) {
    alert(`Em modo demo! Em produção, o status seria atualizado para: ${formatarStatus(novoStatus)}`);
    fecharModal();
}

// Funções auxiliares
function formatarStatus(status) {
    const statusMap = {
        'pendente': 'Pendente',
        'em_rota': 'Em Rota',
        'entregue': 'Entregue',
        'cancelada': 'Cancelada'
    };
    return statusMap[status] || status;
}

function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR');
}

function formatarMoeda(valor) {
    return `€ ${parseFloat(valor).toFixed(2)}`;
}

function iniciarRota(endereco) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(endereco)}`;
    window.open(url, '_blank');
}

function filtrarEntregas(status) {
    if (MODO_DEMO) {
        carregarEntregasDemo();
    } else {
        carregarEntregas(status === 'todas' ? null : status);
    }
}

function fecharModal() {
    document.getElementById('entregaModal').style.display = 'none';
}

function carregarGanhos(ano) {
    if (MODO_DEMO) {
        carregarGanhosDemo(ano);
    } else {
        // Fazer requisição real
    }
}

function carregarPagamentos() {
    if (MODO_DEMO) {
        carregarPagamentosDemo();
    } else {
        // Fazer requisição real
    }
}

function carregarPerfil() {
    if (MODO_DEMO) {
        carregarPerfilDemo();
    } else {
        // Fazer requisição real
    }
}

function salvarPerfil(e) {
    e.preventDefault();
    if (MODO_DEMO) {
        alert('Em modo demo! Os dados não serão salvos.');
    } else {
        // Fazer requisição real
    }
}

// Funções reais (quando não estiver em modo demo)
async function carregarDados() {
    await Promise.all([
        carregarDashboard(),
        carregarEntregas()
    ]);
}

async function carregarDashboard() {
    try {
        const response = await fetch(`${API_URL}/entregadores/dashboard`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        
        if (data.sucesso) {
            const stats = data.dados;
            document.getElementById('totalEntregas').textContent = stats.totalEntregas;
            document.getElementById('totalConcluidas').textContent = stats.entregasConcluidas;
            document.getElementById('totalPendentes').textContent = stats.entregasPendentes;
            document.getElementById('ganhosDoMes').textContent = formatarMoeda(stats.ganhosDoMes);
            document.getElementById('ganhosTotal').textContent = formatarMoeda(stats.ganhosTotal);
            document.getElementById('taxaConclusao').textContent = `${stats.taxaConclusao}%`;
        }
    } catch (erro) {
        console.error('Erro ao carregar dashboard:', erro);
    }
}

async function carregarEntregas(status = null) {
    try {
        const url = status 
            ? `${API_URL}/entregadores/entregas?status=${status}`
            : `${API_URL}/entregadores/entregas`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        
        if (data.sucesso) {
            renderizarEntregas(data.entregas);
        }
    } catch (erro) {
        console.error('Erro ao carregar entregas:', erro);
    }
}

function renderizarEntregas(entregas) {
    const tbody = document.getElementById('entregasTable');
    
    if (entregas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty">Nenhuma entrega encontrada</td></tr>';
        return;
    }

    tbody.innerHTML = entregas.map(e => `
        <tr>
            <td>${e.codigo || e.id}</td>
            <td>${e.pedidos?.cliente_nome || '-'}</td>
            <td>${e.pedidos?.endereco_entrega || '-'}</td>
            <td>${e.produto_descricao || '-'}</td>
            <td>${formatarMoeda(e.comissao)}</td>
            <td><span class="status-badge ${e.status}">${formatarStatus(e.status)}</span></td>
            <td>
                <button class="btn-primary btn-small" onclick="verEntrega(${e.id})">Ver</button>
            </td>
        </tr>
    `).join('');
}

// Tornar funções globais
window.verEntregaDemo = verEntregaDemo;
window.iniciarRota = iniciarRota;
