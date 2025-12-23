// ===== INICIALIZAÇÃO DE CARDS =====

// Função para fechar modais de cards
function fecharModalCard(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
  }
}

// Inicializar event listeners dos modals quando o DOM estiver pronto
function inicializarModalsCards() {
  // Fechar modal ao clicar fora dele
  document.querySelectorAll('.modal-card').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  });

  // Fechar com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-card').forEach(modal => {
        modal.style.display = 'none';
      });
    }
  });
}

// Chamar inicialização quando DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarModalsCards);
} else {
  // Se o script rodar após o DOM estar pronto
  inicializarModalsCards();
}
