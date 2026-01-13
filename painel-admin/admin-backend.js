// ===================================
// ADMIN BACKEND - Conexão com API
// ===================================

const API_URL = 'http://localhost:3001/api';
let adminToken = localStorage.getItem('adminToken');

// ===================================
// AUTENTICAÇÃO
// ===================================

function verificarAutenticacao() {
  if (!adminToken) {
    window.location.href = '../admin-access.html';
    return false;
  }
  return true;
}

// Headers padrão com autenticação
function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  };
}

// ===================================
// DASHBOARD - Carregar Estatísticas
// ===================================

async function carregarDashboard() {
  try {
    // Fornecedores
    const fornecedores = await fetch(`${API_URL}/admin-completo/fornecedores`, {
      headers: getHeaders()
    }).then(r => r.json());
    
    document.getElementById('total-fornecedores').textContent = fornecedores.data?.length || 0;

    // Produtos Pendentes
    const produtosPendentes = await fetch(`${API_URL}/admin-completo/produtos/pendentes`, {
      headers: getHeaders()
    }).then(r => r.json());
    
    document.getElementById('produtos-pendentes').textContent = produtosPendentes.data?.length || 0;

    // Total de Produtos
    const produtos = await fetch(`${API_URL}/admin-completo/produtos`, {
      headers: getHeaders()
    }).then(r => r.json());
    
    document.getElementById('total-produtos').textContent = produtos.data?.length || 0;

    // Entregas Pendentes de Aprovação
    const entregas = await fetch(`${API_URL}/admin-completo/entregas?status=concluida`, {
      headers: getHeaders()
    }).then(r => r.json());
    
    const entregasPendentes = entregas.data?.filter(e => e.status === 'concluida' && !e.aprovado_por_admin).length || 0;
    document.getElementById('entregas-pendentes').textContent = entregasPendentes;

    // Entregadores
    const entregadores = await fetch(`${API_URL}/admin-completo/entregadores`, {
      headers: getHeaders()
    }).then(r => r.json());
    
    document.getElementById('total-entregadores').textContent = entregadores.data?.length || 0;

    // Pagamentos Pendentes
    const pagamentosFornecedores = await fetch(`${API_URL}/admin-completo/pagamentos/fornecedores?status=pendente`, {
      headers: getHeaders()
    }).then(r => r.json());
    
    const pagamentosEntregadores = await fetch(`${API_URL}/admin-completo/pagamentos/entregadores?status=pendente`, {
      headers: getHeaders()
    }).then(r => r.json());
    
    const totalPagamentosPendentes = (pagamentosFornecedores.data?.length || 0) + (pagamentosEntregadores.data?.length || 0);
    document.getElementById('pagamentos-pendentes').textContent = totalPagamentosPendentes;

  } catch (error) {
    console.error('Erro ao carregar dashboard:', error);
    mostrarNotificacao('Erro ao carregar estatísticas', 'erro');
  }
}

// ===================================
// FORNECEDORES
// ===================================

async function carregarFornecedores() {
  try {
    const response = await fetch(`${API_URL}/admin-completo/fornecedores`, {
      headers: getHeaders()
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message);
    }

    const tbody = document.getElementById('lista-fornecedores');
    
    if (!result.data || result.data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 20px;">Nenhum fornecedor cadastrado</td></tr>';
      return;
    }

    tbody.innerHTML = result.data.map(f => `
      <tr>
        <td>${f.id}</td>
        <td>${f.nome}</td>
        <td>${f.email}</td>
        <td>${f.telefone || '-'}</td>
        <td>${f.total_produtos || 0}</td>
        <td>${parseFloat(f.total_vendas || 0).toFixed(2)} AKZ</td>
        <td>${f.comissao_padrao || 15}%</td>
        <td>
          <span class="badge badge-${f.status === 'ativo' ? 'success' : f.status === 'suspenso' ? 'warning' : 'danger'}">
            ${f.status}
          </span>
        </td>
        <td>
          <button class="btn-icon" onclick="verDetalhesFornecedor(${f.id})" title="Ver Detalhes">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn-icon" onclick="editarComissaoFornecedor(${f.id}, ${f.comissao_padrao})" title="Editar Comissão">
            <i class="fas fa-percent"></i>
          </button>
          <button class="btn-icon ${f.status === 'ativo' ? 'btn-danger' : 'btn-success'}" 
                  onclick="toggleStatusFornecedor(${f.id}, '${f.status}')" 
                  title="${f.status === 'ativo' ? 'Suspender' : 'Ativar'}">
            <i class="fas fa-${f.status === 'ativo' ? 'ban' : 'check'}"></i>
          </button>
        </td>
      </tr>
    `).join('');

  } catch (error) {
    console.error('Erro ao carregar fornecedores:', error);
    mostrarNotificacao('Erro ao carregar fornecedores', 'erro');
  }
}

async function toggleStatusFornecedor(id, statusAtual) {
  const novoStatus = statusAtual === 'ativo' ? 'suspenso' : 'ativo';
  const motivo = novoStatus === 'suspenso' ? prompt('Motivo da suspensão:') : null;
  
  if (novoStatus === 'suspenso' && !motivo) return;

  try {
    const response = await fetch(`${API_URL}/admin-completo/fornecedores/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status: novoStatus, motivo })
    });

    const result = await response.json();
    
    if (result.success) {
      mostrarNotificacao('Status atualizado com sucesso!', 'sucesso');
      carregarFornecedores();
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    mostrarNotificacao('Erro ao atualizar status', 'erro');
  }
}

// ===================================
// PRODUTOS PENDENTES
// ===================================

async function carregarProdutosPendentes() {
  try {
    const response = await fetch(`${API_URL}/admin-completo/produtos/pendentes`, {
      headers: getHeaders()
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message);
    }

    const tbody = document.getElementById('lista-produtos-pendentes');
    const selectFornecedor = document.getElementById('filtro-fornecedor-pendente');
    
    if (!result.data || result.data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 20px;">✅ Nenhum produto pendente de aprovação</td></tr>';
      return;
    }

    // Preencher filtro de fornecedores
    const fornecedores = [...new Set(result.data.map(p => p.fornecedor_nome))];
    selectFornecedor.innerHTML = '<option value="">Todos os fornecedores</option>' + 
      fornecedores.map(f => `<option value="${f}">${f}</option>`).join('');

    tbody.innerHTML = result.data.map(p => `
      <tr>
        <td><img src="${p.imagem_url}" alt="${p.nome}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
        <td>${p.nome}</td>
        <td>${p.fornecedor_nome || 'N/A'}</td>
        <td>${p.categoria}</td>
        <td>${parseFloat(p.preco).toFixed(2)} AKZ</td>
        <td>${p.estoque}</td>
        <td>${p.comissao_plataforma || 15}%</td>
        <td>${new Date(p.created_at).toLocaleDateString('pt-PT')}</td>
        <td>
          <button class="btn-primario" onclick="abrirModalAprovarProduto(${p.id})" style="font-size: 12px; padding: 5px 10px;">
            <i class="fas fa-check"></i> Analisar
          </button>
        </td>
      </tr>
    `).join('');

  } catch (error) {
    console.error('Erro ao carregar produtos pendentes:', error);
    mostrarNotificacao('Erro ao carregar produtos pendentes', 'erro');
  }
}

async function abrirModalAprovarProduto(id) {
  try {
    const response = await fetch(`${API_URL}/admin-completo/produtos`, {
      headers: getHeaders()
    });
    
    const result = await response.json();
    const produto = result.data.find(p => p.id === id);
    
    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    document.getElementById('produto-id-aprovacao').value = id;
    document.getElementById('produto-preco-aprovacao').value = produto.preco;
    document.getElementById('produto-comissao-aprovacao').value = produto.comissao_plataforma || 15;
    
    document.getElementById('produto-info-aprovacao').innerHTML = `
      <div style="display: flex; gap: 15px; align-items: start;">
        <img src="${produto.imagem_url}" alt="${produto.nome}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;">
        <div>
          <h3>${produto.nome}</h3>
          <p><strong>Fornecedor:</strong> ${produto.fornecedor_nome || 'N/A'}</p>
          <p><strong>Categoria:</strong> ${produto.categoria}</p>
          <p><strong>Descrição:</strong> ${produto.descricao || 'Sem descrição'}</p>
          <p><strong>Estoque:</strong> ${produto.estoque} unidades</p>
        </div>
      </div>
    `;
    
    document.getElementById('grupo-motivo-rejeicao').style.display = 'none';
    document.getElementById('modal-aprovar-produto').style.display = 'flex';
    
  } catch (error) {
    console.error('Erro ao carregar produto:', error);
    mostrarNotificacao('Erro ao carregar produto', 'erro');
  }
}

function mostrarCampoRejeicao() {
  document.getElementById('grupo-motivo-rejeicao').style.display = 'block';
  document.getElementById('motivo-rejeicao').required = true;
}

async function aprovarProduto() {
  const id = document.getElementById('produto-id-aprovacao').value;
  const preco = document.getElementById('produto-preco-aprovacao').value;
  const comissao = document.getElementById('produto-comissao-aprovacao').value;
  const motivoRejeicao = document.getElementById('motivo-rejeicao').value;

  if (motivoRejeicao) {
    // Rejeitar
    if (!confirm('Deseja realmente REJEITAR este produto?')) return;
    
    try {
      const response = await fetch(`${API_URL}/admin-completo/produtos/${id}/rejeitar`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ motivo: motivoRejeicao })
      });

      const result = await response.json();
      
      if (result.success) {
        mostrarNotificacao('Produto rejeitado com sucesso!', 'sucesso');
        fecharModal('modal-aprovar-produto');
        carregarProdutosPendentes();
        carregarDashboard();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Erro ao rejeitar produto:', error);
      mostrarNotificacao('Erro ao rejeitar produto', 'erro');
    }
  } else {
    // Aprovar
    if (!confirm('Deseja APROVAR este produto? Ele ficará visível no site.')) return;
    
    try {
      const response = await fetch(`${API_URL}/admin-completo/produtos/${id}/aprovar`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ 
          preco: parseFloat(preco),
          comissao_plataforma: parseFloat(comissao)
        })
      });

      const result = await response.json();
      
      if (result.success) {
        mostrarNotificacao('Produto aprovado com sucesso!', 'sucesso');
        fecharModal('modal-aprovar-produto');
        carregarProdutosPendentes();
        carregarDashboard();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Erro ao aprovar produto:', error);
      mostrarNotificacao('Erro ao aprovar produto', 'erro');
    }
  }
}

// ===================================
// ENTREGAS
// ===================================

async function carregarEntregas() {
  try {
    const response = await fetch(`${API_URL}/admin-completo/entregas`, {
      headers: getHeaders()
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message);
    }

    const tbody = document.getElementById('lista-entregas');
    
    // Atualizar contador de entregas aguardando
    const aguardando = result.data?.filter(e => e.status === 'concluida' && !e.aprovado_por_admin).length || 0;
    document.getElementById('entregas-aguardando').textContent = aguardando;
    
    if (!result.data || result.data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 20px;">Nenhuma entrega cadastrada</td></tr>';
      return;
    }

    tbody.innerHTML = result.data.map(e => {
      const statusClass = e.aprovado_por_admin ? 'success' : e.status === 'concluida' ? 'warning' : 'info';
      const statusTexto = e.aprovado_por_admin ? 'Aprovada' : 
                         e.status === 'concluida' ? 'Aguardando Aprovação' : 
                         e.status === 'em_transito' ? 'Em Trânsito' : 
                         'Aguardando Recolha';
      
      return `
        <tr>
          <td>${e.id}</td>
          <td>#${e.pedido_id}</td>
          <td>${e.cliente_nome || 'N/A'}</td>
          <td>${e.entregador_nome}</td>
          <td>${e.endereco_entrega || 'N/A'}</td>
          <td>${parseFloat(e.comissao || 0).toFixed(2)} AKZ</td>
          <td><span class="badge badge-${statusClass}">${statusTexto}</span></td>
          <td>${new Date(e.created_at).toLocaleDateString('pt-PT')}</td>
          <td>
            ${e.status === 'concluida' && !e.aprovado_por_admin ? `
              <button class="btn-primario" onclick="abrirModalAprovarEntrega(${e.id})" style="font-size: 12px; padding: 5px 10px;">
                <i class="fas fa-check"></i> Validar
              </button>
            ` : `
              <button class="btn-icon" onclick="verDetalhesEntrega(${e.id})" title="Ver Detalhes">
                <i class="fas fa-eye"></i>
              </button>
            `}
          </td>
        </tr>
      `;
    }).join('');

  } catch (error) {
    console.error('Erro ao carregar entregas:', error);
    mostrarNotificacao('Erro ao carregar entregas', 'erro');
  }
}

async function abrirModalCriarEntrega() {
  // Carregar pedidos sem entrega
  try {
    // TODO: Criar endpoint para pedidos sem entrega
    const selectPedido = document.getElementById('entrega-pedido');
    const selectEntregador = document.getElementById('entrega-entregador');
    
    // Carregar entregadores ativos
    const entregadores = await fetch(`${API_URL}/admin-completo/entregadores`, {
      headers: getHeaders()
    }).then(r => r.json());
    
    selectEntregador.innerHTML = '<option value="">Selecione um entregador</option>' +
      entregadores.data.filter(e => e.status === 'ativo').map(e => 
        `<option value="${e.id}">${e.nome} - ${e.zona_entrega || 'Zona não definida'}</option>`
      ).join('');
    
    document.getElementById('modal-criar-entrega').style.display = 'flex';
    
  } catch (error) {
    console.error('Erro ao abrir modal:', error);
    mostrarNotificacao('Erro ao carregar dados', 'erro');
  }
}

document.getElementById('form-criar-entrega')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const pedidoId = document.getElementById('entrega-pedido').value;
  const entregadorId = document.getElementById('entrega-entregador').value;
  const comissao = document.getElementById('entrega-comissao').value;
  const observacoes = document.getElementById('entrega-observacoes').value;
  
  try {
    const response = await fetch(`${API_URL}/admin-completo/entregas`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        pedido_id: parseInt(pedidoId),
        entregador_id: parseInt(entregadorId),
        comissao: parseFloat(comissao),
        observacoes
      })
    });

    const result = await response.json();
    
    if (result.success) {
      mostrarNotificacao('Entrega criada e atribuída com sucesso!', 'sucesso');
      fecharModal('modal-criar-entrega');
      carregarEntregas();
      document.getElementById('form-criar-entrega').reset();
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Erro ao criar entrega:', error);
    mostrarNotificacao('Erro ao criar entrega: ' + error.message, 'erro');
  }
});

async function abrirModalAprovarEntrega(id) {
  try {
    const response = await fetch(`${API_URL}/admin-completo/entregas`, {
      headers: getHeaders()
    });
    
    const result = await response.json();
    const entrega = result.data.find(e => e.id === id);
    
    if (!entrega) {
      throw new Error('Entrega não encontrada');
    }

    document.getElementById('entrega-id-aprovacao').value = id;
    
    document.getElementById('entrega-info-aprovacao').innerHTML = `
      <div style="padding: 15px; background: rgba(192,192,192,0.1); border-radius: 8px;">
        <p><strong>ID:</strong> ${entrega.id}</p>
        <p><strong>Pedido:</strong> #${entrega.pedido_id}</p>
        <p><strong>Cliente:</strong> ${entrega.cliente_nome || 'N/A'}</p>
        <p><strong>Entregador:</strong> ${entrega.entregador_nome}</p>
        <p><strong>Endereço:</strong> ${entrega.endereco_entrega || 'N/A'}</p>
        <p><strong>Comissão:</strong> ${parseFloat(entrega.comissao || 0).toFixed(2)} AKZ</p>
        <p><strong>Data Conclusão:</strong> ${new Date(entrega.data_conclusao).toLocaleString('pt-PT')}</p>
      </div>
    `;
    
    document.getElementById('grupo-motivo-rejeicao-entrega').style.display = 'none';
    document.getElementById('modal-aprovar-entrega').style.display = 'flex';
    
  } catch (error) {
    console.error('Erro ao carregar entrega:', error);
    mostrarNotificacao('Erro ao carregar entrega', 'erro');
  }
}

function mostrarCampoRejeicaoEntrega() {
  document.getElementById('grupo-observacoes-aprovacao').style.display = 'none';
  document.getElementById('grupo-motivo-rejeicao-entrega').style.display = 'block';
  document.getElementById('motivo-rejeicao-entrega').required = true;
}

async function aprovarEntrega() {
  const id = document.getElementById('entrega-id-aprovacao').value;
  const observacoes = document.getElementById('observacoes-aprovacao').value;
  const motivoRejeicao = document.getElementById('motivo-rejeicao-entrega').value;

  if (motivoRejeicao) {
    // Rejeitar
    if (!confirm('Deseja realmente REJEITAR esta entrega?')) return;
    
    try {
      const response = await fetch(`${API_URL}/admin-completo/entregas/${id}/rejeitar`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ motivo: motivoRejeicao })
      });

      const result = await response.json();
      
      if (result.success) {
        mostrarNotificacao('Entrega rejeitada com sucesso!', 'sucesso');
        fecharModal('modal-aprovar-entrega');
        carregarEntregas();
        carregarDashboard();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Erro ao rejeitar entrega:', error);
      mostrarNotificacao('Erro ao rejeitar entrega', 'erro');
    }
  } else {
    // Aprovar
    if (!confirm('Deseja APROVAR esta entrega?')) return;
    
    try {
      const response = await fetch(`${API_URL}/admin-completo/entregas/${id}/aprovar`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ observacoes })
      });

      const result = await response.json();
      
      if (result.success) {
        mostrarNotificacao('Entrega aprovada com sucesso!', 'sucesso');
        fecharModal('modal-aprovar-entrega');
        carregarEntregas();
        carregarDashboard();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Erro ao aprovar entrega:', error);
      mostrarNotificacao('Erro ao aprovar entrega', 'erro');
    }
  }
}

// ===================================
// PAGAMENTOS
// ===================================

let currentTabPagamento = 'fornecedores';

function mostrarTabPagamento(tab) {
  currentTabPagamento = tab;
  
  // Atualizar tabs
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  // Atualizar conteúdo
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  document.getElementById(`tab-pagamentos-${tab}`).classList.add('active');
  document.getElementById(`tab-relatorio-financeiro`).classList.remove('active');
  
  if (tab === 'relatorio') {
    document.getElementById('tab-relatorio-financeiro').classList.add('active');
  }
  
  // Carregar dados
  if (tab === 'fornecedores') {
    carregarPagamentosFornecedores();
  } else if (tab === 'entregadores') {
    carregarPagamentosEntregadores();
  }
}

async function carregarPagamentosFornecedores() {
  try {
    const response = await fetch(`${API_URL}/admin-completo/pagamentos/fornecedores`, {
      headers: getHeaders()
    });
    
    const result = await response.json();
    const tbody = document.getElementById('lista-pagamentos-fornecedores');
    
    if (!result.data || result.data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 20px;">Nenhum pagamento gerado</td></tr>';
      return;
    }

    tbody.innerHTML = result.data.map(p => `
      <tr>
        <td>${p.id}</td>
        <td>${p.fornecedor_nome}</td>
        <td>${new Date(p.data_inicio).toLocaleDateString('pt-PT')} - ${new Date(p.data_fim).toLocaleDateString('pt-PT')}</td>
        <td>${parseFloat(p.valor_bruto || 0).toFixed(2)} AKZ</td>
        <td>${parseFloat(p.taxa_comissao || 0)}%</td>
        <td><strong>${parseFloat(p.valor_liquido).toFixed(2)} AKZ</strong></td>
        <td>${p.quantidade_vendas || 0}</td>
        <td><span class="badge badge-${p.status === 'processado' ? 'success' : 'warning'}">${p.status}</span></td>
        <td>
          ${p.status === 'pendente' ? `
            <button class="btn-primario" onclick="abrirModalProcessarPagamento(${p.id}, 'fornecedor')" style="font-size: 12px; padding: 5px 10px;">
              <i class="fas fa-check"></i> Processar
            </button>
          ` : `
            <button class="btn-icon" onclick="verComprovantePagamento(${p.id}, 'fornecedor')">
              <i class="fas fa-file-invoice"></i>
            </button>
          `}
        </td>
      </tr>
    `).join('');

  } catch (error) {
    console.error('Erro ao carregar pagamentos:', error);
    mostrarNotificacao('Erro ao carregar pagamentos', 'erro');
  }
}

async function carregarPagamentosEntregadores() {
  try {
    const response = await fetch(`${API_URL}/admin-completo/pagamentos/entregadores`, {
      headers: getHeaders()
    });
    
    const result = await response.json();
    const tbody = document.getElementById('lista-pagamentos-entregadores');
    
    if (!result.data || result.data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px;">Nenhum pagamento gerado</td></tr>';
      return;
    }

    tbody.innerHTML = result.data.map(p => `
      <tr>
        <td>${p.id}</td>
        <td>${p.entregador_nome}</td>
        <td>${new Date(p.data_inicio).toLocaleDateString('pt-PT')} - ${new Date(p.data_fim).toLocaleDateString('pt-PT')}</td>
        <td><strong>${parseFloat(p.valor_total).toFixed(2)} AKZ</strong></td>
        <td>${p.quantidade_entregas || 0}</td>
        <td>${(parseFloat(p.valor_total) / (p.quantidade_entregas || 1)).toFixed(2)} AKZ</td>
        <td><span class="badge badge-${p.status === 'processado' ? 'success' : 'warning'}">${p.status}</span></td>
        <td>
          ${p.status === 'pendente' ? `
            <button class="btn-primario" onclick="abrirModalProcessarPagamento(${p.id}, 'entregador')" style="font-size: 12px; padding: 5px 10px;">
              <i class="fas fa-check"></i> Processar
            </button>
          ` : `
            <button class="btn-icon" onclick="verComprovantePagamento(${p.id}, 'entregador')">
              <i class="fas fa-file-invoice"></i>
            </button>
          `}
        </td>
      </tr>
    `).join('');

  } catch (error) {
    console.error('Erro ao carregar pagamentos:', error);
    mostrarNotificacao('Erro ao carregar pagamentos', 'erro');
  }
}

async function abrirModalGerarPagamentoFornecedor() {
  try {
    // Carregar fornecedores
    const response = await fetch(`${API_URL}/admin-completo/fornecedores`, {
      headers: getHeaders()
    });
    const result = await response.json();
    
    const select = document.getElementById('pagamento-fornecedor');
    select.innerHTML = '<option value="">Selecione um fornecedor</option>' +
      '<option value="todos">Todos os fornecedores</option>' +
      result.data.map(f => `<option value="${f.id}">${f.nome}</option>`).join('');
    
    document.getElementById('modal-gerar-pagamento-fornecedor').style.display = 'flex';
  } catch (error) {
    console.error('Erro:', error);
    mostrarNotificacao('Erro ao carregar fornecedores', 'erro');
  }
}

async function abrirModalGerarPagamentoEntregador() {
  try {
    // Carregar entregadores
    const response = await fetch(`${API_URL}/admin-completo/entregadores`, {
      headers: getHeaders()
    });
    const result = await response.json();
    
    const select = document.getElementById('pagamento-entregador');
    select.innerHTML = '<option value="">Selecione um entregador</option>' +
      '<option value="todos">Todos os entregadores</option>' +
      result.data.map(e => `<option value="${e.id}">${e.nome}</option>`).join('');
    
    document.getElementById('modal-gerar-pagamento-entregador').style.display = 'flex';
  } catch (error) {
    console.error('Erro:', error);
    mostrarNotificacao('Erro ao carregar entregadores', 'erro');
  }
}

document.getElementById('form-gerar-pagamento-fornecedor')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const fornecedorId = document.getElementById('pagamento-fornecedor').value;
  const dataInicio = document.getElementById('pagamento-fornecedor-inicio').value;
  const dataFim = document.getElementById('pagamento-fornecedor-fim').value;
  
  if (!fornecedorId) {
    mostrarNotificacao('Selecione um fornecedor', 'erro');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/admin-completo/pagamentos/fornecedores/gerar`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        fornecedor_id: fornecedorId === 'todos' ? null : parseInt(fornecedorId),
        data_inicio: dataInicio,
        data_fim: dataFim
      })
    });

    const result = await response.json();
    
    if (result.success) {
      mostrarNotificacao(`Pagamentos gerados com sucesso!`, 'sucesso');
      fecharModal('modal-gerar-pagamento-fornecedor');
      carregarPagamentosFornecedores();
      carregarDashboard();
      document.getElementById('form-gerar-pagamento-fornecedor').reset();
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Erro:', error);
    mostrarNotificacao('Erro ao gerar pagamentos: ' + error.message, 'erro');
  }
});

document.getElementById('form-gerar-pagamento-entregador')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const entregadorId = document.getElementById('pagamento-entregador').value;
  const dataInicio = document.getElementById('pagamento-entregador-inicio').value;
  const dataFim = document.getElementById('pagamento-entregador-fim').value;
  
  if (!entregadorId) {
    mostrarNotificacao('Selecione um entregador', 'erro');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/admin-completo/pagamentos/entregadores/gerar`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        entregador_id: entregadorId === 'todos' ? null : parseInt(entregadorId),
        data_inicio: dataInicio,
        data_fim: dataFim
      })
    });

    const result = await response.json();
    
    if (result.success) {
      mostrarNotificacao(`Pagamentos gerados com sucesso!`, 'sucesso');
      fecharModal('modal-gerar-pagamento-entregador');
      carregarPagamentosEntregadores();
      carregarDashboard();
      document.getElementById('form-gerar-pagamento-entregador').reset();
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Erro:', error);
    mostrarNotificacao('Erro ao gerar pagamentos: ' + error.message, 'erro');
  }
});

function abrirModalProcessarPagamento(id, tipo) {
  document.getElementById('pagamento-id-processar').value = id;
  document.getElementById('pagamento-tipo-processar').value = tipo;
  
  document.getElementById('pagamento-info-processar').innerHTML = `
    <div style="padding: 15px; background: rgba(255, 215, 0, 0.1); border-left: 4px solid #ffd700; border-radius: 8px;">
      <p><strong>ID do Pagamento:</strong> ${id}</p>
      <p><strong>Tipo:</strong> ${tipo === 'fornecedor' ? 'Fornecedor' : 'Entregador'}</p>
    </div>
  `;
  
  document.getElementById('modal-processar-pagamento').style.display = 'flex';
}

document.getElementById('form-processar-pagamento')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('pagamento-id-processar').value;
  const tipo = document.getElementById('pagamento-tipo-processar').value;
  const metodo = document.getElementById('metodo-pagamento').value;
  const comprovante = document.getElementById('comprovante-pagamento').value;
  const observacoes = document.getElementById('observacoes-pagamento').value;
  
  try {
    const url = tipo === 'fornecedor' 
      ? `${API_URL}/admin-completo/pagamentos/fornecedores/${id}/processar`
      : `${API_URL}/admin-completo/pagamentos/entregadores/${id}/processar`;
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({
        metodo_pagamento: metodo,
        comprovante_pagamento: comprovante,
        observacoes
      })
    });

    const result = await response.json();
    
    if (result.success) {
      mostrarNotificacao('Pagamento processado com sucesso!', 'sucesso');
      fecharModal('modal-processar-pagamento');
      
      if (tipo === 'fornecedor') {
        carregarPagamentosFornecedores();
      } else {
        carregarPagamentosEntregadores();
      }
      
      carregarDashboard();
      document.getElementById('form-processar-pagamento').reset();
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Erro:', error);
    mostrarNotificacao('Erro ao processar pagamento: ' + error.message, 'erro');
  }
});

// ===================================
// HELPERS
// ===================================

function fecharModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

function mostrarNotificacao(mensagem, tipo = 'info') {
  // Usar sistema de notificações existente ou criar alert simples
  if (typeof showNotification === 'function') {
    showNotification(mensagem, tipo);
  } else {
    alert(mensagem);
  }
}

// ===================================
// INICIALIZAÇÃO
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  if (!verificarAutenticacao()) return;
  
  carregarDashboard();
  
  // Detectar seção ativa e carregar dados
  const secaoAtual = document.querySelector('.admin-secao.ativa')?.id;
  
  switch(secaoAtual) {
    case 'fornecedores':
      carregarFornecedores();
      break;
    case 'produtos-pendentes':
      carregarProdutosPendentes();
      break;
    case 'entregas':
      carregarEntregas();
      break;
    case 'pagamentos':
      carregarPagamentosFornecedores();
      break;
  }
});

// Atualizar dashboard a cada 30 segundos
setInterval(() => {
  carregarDashboard();
}, 30000);
