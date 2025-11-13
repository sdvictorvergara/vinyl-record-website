// Main script for contact form handling
document.addEventListener('DOMContentLoaded', function () {
  const contact_form = document.querySelector('form');
  const confirmationMessage = document.createElement('p');

  // Style confirmation message
  confirmationMessage.style.color = 'green';
  contact_form.parentNode.insertBefore(confirmationMessage, contact_form.nextSibling);

  // Handle form submission
  contact_form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Reset form fields
    contact_form.reset();

    // Display confirmation message
    confirmationMessage.textContent = '¡Mensaje enviado correctamente!';
  });
});