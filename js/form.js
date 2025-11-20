// Script for contact form handling
document.addEventListener('DOMContentLoaded', function () {
  const contact_form = document.querySelector('form');
  const confirmation_message = document.createElement('p');

  // Style confirmation message
  confirmation_message.style.color = 'green';
  contact_form.parentNode.insertBefore(confirmation_message, contact_form.nextSibling);

  // Handle form submission
  contact_form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Reset form fields
    contact_form.reset();

    // Display confirmation message
    confirmation_message.textContent = '¡Mensaje enviado correctamente!';
  });
});
