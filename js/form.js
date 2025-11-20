document.addEventListener('DOMContentLoaded', function () {
  const contact_form = document.getElementById('contact-box');
  contact_form.addEventListener('submit', function (event) {
    event.preventDefault();
    contact_form.reset();
    alert('¡Mensaje enviado correctamente!');
  });
});
