document.addEventListener("DOMContentLoaded", function () {
  const voltarBtn = document.getElementById("voltar");

  if (voltarBtn) {
    voltarBtn.addEventListener("click", function () {
      const caminhoAnterior = sessionStorage.getItem("caminhoAnterior");
      if (caminhoAnterior) {
        window.location.href = caminhoAnterior;
      } else {
        window.history.back();
      }
    });
  }

  // Armazenar o caminho atual antes de navegar
  const links = document.querySelectorAll("a");
  links.forEach(link => {
    link.addEventListener("click", function (e) {
      // Não bloqueia a navegação, apenas armazena o caminho
      sessionStorage.setItem("caminhoAnterior", window.location.pathname);
    }, { passive: true }); // passive: true garante que não bloqueia a navegação
  });
});
