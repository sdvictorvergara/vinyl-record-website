document.addEventListener('DOMContentLoaded', function () {
  const contact_form = document.getElementById('contact-box');

  // Show notification modal_________________________________________________________________________
  function show_modal(message) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';

    modal.innerHTML = `
      <div class="modal-content notification-modal">
        <span class="close-notification">&times;</span>
        <h2 class="notification-title">¡Éxito!</h2>
        <p class="notification-message">${message}</p>
        <button class="notification-btn" id="notification-ok">Aceptar</button>
      </div>
    `;

    document.body.appendChild(modal);

    function close_modal() {
      modal.style.display = 'none';
      document.body.removeChild(modal);
    }

    modal.querySelector('.close-notification').addEventListener('click', close_modal);
    modal.querySelector('#notification-ok').addEventListener('click', close_modal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) close_modal();
    });
  }

  // Validate email format_________________________________________________________________________
  function validate_email(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Save contact message to localStorage_________________________________________________________________________
  function save_contact_message(contact_data) {

    const existing_messages = localStorage.getItem('contact_messages');
    const messages = existing_messages ? JSON.parse(existing_messages) : [];

    messages.push(contact_data);

    localStorage.setItem('contact_messages', JSON.stringify(messages));
  }

  // Submit form_________________________________________________________________________
  contact_form.addEventListener('submit', function (e) {
    e.preventDefault();

    let is_valid = true;
    const name_value = document.getElementById('name').value.trim();
    const email_value = document.getElementById('email').value.trim();
    const subject_value = document.getElementById('subject').value.trim();
    const message_value = document.getElementById('message').value.trim();

    if (!name_value) {
      document.getElementById('error-name').textContent = 'Por favor, ingresa tu nombre';
      is_valid = false;
    }

    if (!email_value) {
      document.getElementById('error-email').textContent = 'Por favor, ingresa tu correo electrónico';
      is_valid = false;
    } else if (!validate_email(email_value)) {
      document.getElementById('error-email').textContent = 'Por favor, ingresa un correo electrónico válido';
      is_valid = false;
    }

    if (!subject_value) {
      document.getElementById('error-subject').textContent = 'Por favor, ingresa un asunto';
      is_valid = false;
    }

    if (!message_value) {
      document.getElementById('error-message').textContent = 'Por favor, escribe un mensaje';
      is_valid = false;
    }

    if (is_valid) {
      const contact_data = {
        name: name_value,
        email: email_value,
        subject: subject_value,
        message: message_value
      };

      save_contact_message(contact_data);

      contact_form.reset();
      show_modal('¡Mensaje enviado correctamente!');
    }
  });
});