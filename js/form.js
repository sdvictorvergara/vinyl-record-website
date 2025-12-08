document.addEventListener('DOMContentLoaded', function () {
  const CONTACT_FORM = document.getElementById('contact-box');

  // Show notification modal_________________________________________________________________________
  function showModal(message) {
    const MODAL = document.createElement('div');
    MODAL.className = 'modal';
    MODAL.style.display = 'flex';

    MODAL.innerHTML = `
      <div class="modal-content notification-modal">
        <span class="close-notification">&times;</span>
        <h2 class="notification-title">¡Éxito!</h2>
        <p class="notification-message">${message}</p>
        <button class="notification-btn" id="notification-ok">Aceptar</button>
      </div>
    `;

    document.body.appendChild(MODAL);

    function closeModal() {
      MODAL.style.display = 'none';
      document.body.removeChild(MODAL);
    }

    MODAL.querySelector('.close-notification').addEventListener('click', closeModal);
    MODAL.querySelector('#notification-ok').addEventListener('click', closeModal);
    MODAL.addEventListener('click', function (e) {
      if (e.target === MODAL) closeModal();
    });
  }

  // Validate email format_________________________________________________________________________
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Save contact message to localStorage_________________________________________________________________________
  function saveContactMessage(contactData) {

    const EXISTING_MESSAGES = localStorage.getItem('contact_messages');
    const MESSAGES = EXISTING_MESSAGES ? JSON.parse(EXISTING_MESSAGES) : [];

    MESSAGES.push(contactData);

    localStorage.setItem('contact_messages', JSON.stringify(MESSAGES));
  }

  // Submit form_________________________________________________________________________
  CONTACT_FORM.addEventListener('submit', function (e) {
    e.preventDefault();

    let isValid = true;
    const NAME_VALUE = document.getElementById('name').value.trim();
    const EMAIL_VALUE = document.getElementById('email').value.trim();
    const SUBJECT_VALUE = document.getElementById('subject').value.trim();
    const MESSAGE_VALUE = document.getElementById('message').value.trim();

    if (!NAME_VALUE) {
      document.getElementById('error-name').textContent = 'Por favor, ingresa tu nombre';
      isValid = false;
    }

    if (!EMAIL_VALUE) {
      document.getElementById('error-email').textContent = 'Por favor, ingresa tu correo electrónico';
      isValid = false;
    } else if (!validateEmail(EMAIL_VALUE)) {
      document.getElementById('error-email').textContent = 'Por favor, ingresa un correo electrónico válido';
      isValid = false;
    }

    if (!SUBJECT_VALUE) {
      document.getElementById('error-subject').textContent = 'Por favor, ingresa un asunto';
      isValid = false;
    }

    if (!MESSAGE_VALUE) {
      document.getElementById('error-message').textContent = 'Por favor, escribe un mensaje';
      isValid = false;
    }

    if (isValid) {
      const CONTACT_DATA = {
        name: NAME_VALUE,
        email: EMAIL_VALUE,
        subject: SUBJECT_VALUE,
        message: MESSAGE_VALUE
      };

      saveContactMessage(CONTACT_DATA);

      CONTACT_FORM.reset();
      showModal('¡Mensaje enviado correctamente!');
    }
  });
});