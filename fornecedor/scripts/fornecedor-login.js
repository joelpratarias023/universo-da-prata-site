// Configuração da API
const API_URL = 'http://localhost:3001/api';

// Elementos do DOM
const loginForm = document.getElementById('loginForm');
const btnLogin = document.getElementById('btnLogin');
const btnText = btnLogin.querySelector('.btn-text');
const btnLoader = btnLogin.querySelector('.btn-loader');
const errorMessage = document.getElementById('errorMessage');

// Event listener para o formulário
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await fazerLogin();
});

// Função para fazer login
async function fazerLogin() {
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;

    // Validações
    if (!email || !senha) {
        mostrarErro('Por favor, preencha todos os campos');
        return;
    }

    // Desabilitar botão e mostrar loader
    btnLogin.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'flex';
    esconderErro();

    try {
        const response = await fetch(`${API_URL}/fornecedores/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.mensagem || 'Erro ao fazer login');
        }

        // Salvar token e dados do fornecedor no localStorage
        localStorage.setItem('fornecedor_token', data.token);
        localStorage.setItem('fornecedor_dados', JSON.stringify(data.fornecedor));

        // Mostrar sucesso
        mostrarSucesso('Login realizado com sucesso! Redirecionando...');

        // Redirecionar para o painel
        setTimeout(() => {
            window.location.href = 'painel-fornecedor.html';
        }, 1000);

    } catch (error) {
        console.error('Erro no login:', error);
        mostrarErro(error.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
        // Reabilitar botão e esconder loader
        btnLogin.disabled = false;
        btnText.style.display = 'block';
        btnLoader.style.display = 'none';
    }
}

// Função para mostrar erro
function mostrarErro(mensagem) {
    errorMessage.textContent = mensagem;
    errorMessage.style.display = 'block';
    errorMessage.style.background = '#fee';
    errorMessage.style.color = '#c33';
}

// Função para mostrar sucesso
function mostrarSucesso(mensagem) {
    errorMessage.textContent = mensagem;
    errorMessage.style.display = 'block';
    errorMessage.style.background = '#efe';
    errorMessage.style.color = '#3c3';
    errorMessage.style.borderLeft = '4px solid #3c3';
}

// Função para esconder mensagem
function esconderErro() {
    errorMessage.style.display = 'none';
}

// Verificar se já está logado
window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('fornecedor_token');
    if (token) {
        // Verificar se o token ainda é válido
        verificarToken(token);
    }
});

// Função para verificar token
async function verificarToken(token) {
    try {
        const response = await fetch(`${API_URL}/fornecedores/perfil`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            // Token válido, redirecionar para o painel
            window.location.href = 'painel-fornecedor.html';
        } else {
            // Token inválido, remover do localStorage
            localStorage.removeItem('fornecedor_token');
            localStorage.removeItem('fornecedor_dados');
        }
    } catch (error) {
        console.error('Erro ao verificar token:', error);
        localStorage.removeItem('fornecedor_token');
        localStorage.removeItem('fornecedor_dados');
    }
}

// Link de recuperar senha
document.getElementById('recuperarSenha').addEventListener('click', (e) => {
    e.preventDefault();
    alert('Funcionalidade de recuperação de senha será implementada em breve.\nEntre em contato com o suporte.');
});
