document.addEventListener('DOMContentLoaded', function () {
  const CONTACT_FORM = document.getElementById('contact-box');

  // Show notification modal_________________________________________________________________________
  function show_modal(message) {
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

    function close_modal() {
      MODAL.style.display = 'none';
      document.body.removeChild(MODAL);
    }

    MODAL.querySelector('.close-notification').addEventListener('click', close_modal);
    MODAL.querySelector('#notification-ok').addEventListener('click', close_modal);
    MODAL.addEventListener('click', function (e) {
      if (e.target === MODAL) close_modal();
    });
  }

  // Validate email format_________________________________________________________________________
  function validate_email(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Save contact message to localStorage_________________________________________________________________________
  function save_contact_message(CONTACT_DATA) {

    const EXISTING_MESSAGES = localStorage.getItem('contact_messages');
    const MESSAGES = EXISTING_MESSAGES ? JSON.parse(EXISTING_MESSAGES) : [];

    MESSAGES.push(CONTACT_DATA);

    localStorage.setItem('contact_messages', JSON.stringify(MESSAGES));
  }

  // Submit form_________________________________________________________________________
  CONTACT_FORM.addEventListener('submit', function (e) {
    e.preventDefault();

    let is_valid = true;
    const NAME_VALUE = document.getElementById('name').value.trim();
    const EMAIL_VALUE = document.getElementById('email').value.trim();
    const SUBJECT_VALUE = document.getElementById('subject').value.trim();
    const MESSAGE_VALUE = document.getElementById('message').value.trim();

    if (!NAME_VALUE) {
      document.getElementById('error-name').textContent = 'Por favor, ingresa tu nombre';
      is_valid = false;
    }

    if (!EMAIL_VALUE) {
      document.getElementById('error-email').textContent = 'Por favor, ingresa tu correo electrónico';
      is_valid = false;
    } else if (!validate_email(EMAIL_VALUE)) {
      document.getElementById('error-email').textContent = 'Por favor, ingresa un correo electrónico válido';
      is_valid = false;
    }

    if (!SUBJECT_VALUE) {
      document.getElementById('error-subject').textContent = 'Por favor, ingresa un asunto';
      is_valid = false;
    }

    if (!MESSAGE_VALUE) {
      document.getElementById('error-message').textContent = 'Por favor, escribe un mensaje';
      is_valid = false;
    }

    if (is_valid) {
      const CONTACT_DATA = {
        name: NAME_VALUE,
        email: EMAIL_VALUE,
        subject: SUBJECT_VALUE,
        message: MESSAGE_VALUE
      };

      save_contact_message(CONTACT_DATA);

      CONTACT_FORM.reset();
      show_modal('¡Mensaje enviado correctamente!');
    }
  });
});
