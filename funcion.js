

document.addEventListener('DOMContentLoaded', () => {
  const copyIcons = document.querySelectorAll('.copy-icon');
  const toast = document.getElementById('toast');
  let toastTimeout = null;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2000);
  }

  function copyText(text) {
    if (!navigator.clipboard) {
      // fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        return successful;
      } catch (err) {
        document.body.removeChild(textarea);
        console.error('Fallback: Oops, unable to copy', err);
        return false;
      }
    } else {
      return navigator.clipboard.writeText(text).then(() => true, () => false);
    }
  }

  copyIcons.forEach(icon => {
    icon.addEventListener('click', () => {
      const textToCopy = icon.getAttribute('data-copy');
      if (!textToCopy) return;

      const result = copyText(textToCopy);
      if (result && typeof result.then === 'function') {
        // Promise (modern clipboard API)
        result.then(success => {
          if (success) {
            showToast('Texto copiado 👍');
          } else {
            showToast('Error al copiar');
          }
        });
      } else {
        // Sync fallback
        if (result) {
          showToast('Texto copiado 👍');
        } else {
          showToast('Error al copiar');
        }
      }
    });

    icon.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        icon.click();
      }
    });
  });
});
