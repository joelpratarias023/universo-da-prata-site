// Configuração da API
const API_URL = 'http://localhost:3001/api';

// Criar estrelas no fundo
function criarEstrelas() {
    const container = document.getElementById('stars-container');
    const numeroEstrelas = 50;

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

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    criarEstrelas();
    inicializarFormulario();
});

// Formulário de login
function inicializarFormulario() {
    const form = document.getElementById('loginForm');
    const btnLogin = document.getElementById('btnLogin');
    const btnTexto = document.getElementById('btnTexto');
    const btnLoader = document.getElementById('btnLoader');
    const mensagemErro = document.getElementById('mensagemErro');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const lembrar = document.getElementById('lembrar').checked;

        // Validação básica
        if (!email || !senha) {
            mostrarErro('Por favor, preencha todos os campos');
            return;
        }

        // Desabilitar botão
        btnLogin.disabled = true;
        btnTexto.style.display = 'none';
        btnLoader.style.display = 'inline';
        mensagemErro.style.display = 'none';

        try {
            const response = await fetch(`${API_URL}/entregadores/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, senha })
            });

            const data = await response.json();

            if (data.sucesso) {
                // Salvar token
                localStorage.setItem('entregador_token', data.token);
                localStorage.setItem('entregador_dados', JSON.stringify(data.entregador));

                if (lembrar) {
                    localStorage.setItem('entregador_lembrar', 'true');
                }

                // Redirecionar
                window.location.href = 'painel-entregador.html';
            } else {
                mostrarErro(data.mensagem || 'Erro ao fazer login');
            }

        } catch (erro) {
            console.error('Erro:', erro);
            mostrarErro('Erro ao conectar ao servidor. Tente novamente.');
        } finally {
            btnLogin.disabled = false;
            btnTexto.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    });

    function mostrarErro(mensagem) {
        mensagemErro.textContent = mensagem;
        mensagemErro.style.display = 'block';
    }
}
