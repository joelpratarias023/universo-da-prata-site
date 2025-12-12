// scripts/notifications.js
// Sistema unificado de notificações para todo o site

/**
 * Exibe uma notificação personalizada
 * @param {string} message - Mensagem a exibir
 * @param {string} type - Tipo: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duração em ms (0 = indefinido)
 */
function showNotification(message, type = 'info', duration = 3000) {
  // Remover notificação anterior se existir
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Criar elemento de notificação
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  // Adicionar ícone baseado no tipo
  let icon = 'ℹ️';
  switch(type) {
    case 'success':
      icon = '✅';
      break;
    case 'error':
      icon = '❌';
      break;
    case 'warning':
      icon = '⚠️';
      break;
    case 'info':
      icon = 'ℹ️';
      break;
  }

  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${icon}</span>
      <span class="notification-message">${message}</span>
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;

  // Adicionar ao DOM
  document.body.appendChild(notification);

  // Adicionar classe 'show' para animar
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  // Auto-remover se duração especificada
  if (duration > 0) {
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, duration);
  }

  return notification;
}

/**
 * Atalhos para tipos específicos de notificação
 */
function showSuccess(message, duration = 3000) {
  return showNotification(message, 'success', duration);
}

function showError(message, duration = 5000) {
  return showNotification(message, 'error', duration);
}

function showWarning(message, duration = 4000) {
  return showNotification(message, 'warning', duration);
}

function showInfo(message, duration = 3000) {
  return showNotification(message, 'info', duration);
}
