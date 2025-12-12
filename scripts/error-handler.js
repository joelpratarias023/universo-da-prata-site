// scripts/error-handler.js
// Suprime erros de extensões do Chrome que não são relevantes para o usuário

window.addEventListener('unhandledrejection', event => {
  // Ignora erros de extensões Chrome
  if (event.reason && event.reason.message && 
      (event.reason.message.includes('listener indicated an asynchronous response') ||
       event.reason.message.includes('message channel closed') ||
       event.reason.message.includes('chrome-extension'))) {
    event.preventDefault();
  }
});

// Também ignorar erros de console normais de extensões
const originalError = console.error;
console.error = function(...args) {
  const message = args.join(' ');
  
  // Ignora mensagens de extensões
  if (message.includes('listener indicated an asynchronous response') ||
      message.includes('message channel closed') ||
      message.includes('chrome-extension')) {
    return;
  }
  
  originalError.apply(console, args);
};
