document.addEventListener('DOMContentLoaded', function () {
  const musician_card_container = document.getElementById('musician-card');
  const add_artist_button = document.getElementById('add-artist-btn');
  const artist_modal = document.getElementById('artist-modal');
  const close_modal_button = document.querySelector('.close');
  const artist_form = document.getElementById('artist-form');
  const modal_title = document.getElementById('modal-title');
  const cancel_modal_button = document.getElementById('cancel-btn');

  let editing_index = null;

  // Default artists_________________________________________________________________________
  const default_artists = [
    { name: 'Cacho Castaña', image: 'images/artists/cacho-castaña.jpeg', genres: ['Balada Romántica', 'Tango'] },
    { name: 'Carlos Gardel', image: 'images/artists/carlos-gardel.jpeg', genres: ['Música clásica', 'Tango'] },
    { name: 'Hugo del Carril', image: 'images/artists/hugo-carril.jpg', genres: ['Pop', 'Tango'] },
    { name: 'Andres Calamaro', image: 'images/artists/andres-calamaro.jpg', genres: ['Pop', 'Rock'] },
    { name: 'Fito Paez', image: 'images/artists/fito-paez.webp', genres: ['Rock'] },
    { name: 'Luis Alberto Spinetta', image: 'images/artists/alberto-spinetta.avif', genres: ['Rock'] },
    { name: 'Los Zafiros', image: 'images/artists/los-zafiros.webp', genres: ['Bossa Nova', 'Bolero'] },
    { name: 'Los tres Reyes', image: 'images/artists/trio-reyes.jpg', genres: ['Vals', 'Bolero'] },
    { name: 'Pedro Infante', image: 'images/artists/pedro-infante.jpg', genres: ['Valses', 'boleros'] },
    { name: 'WOS', image: 'images/artists/wos.jpg', genres: ['Rock Alternativo', 'Hip hop'] }
  ];

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

    function close_notification_modal() {
      modal.style.display = 'none';
      document.body.removeChild(modal);
    }

    modal.querySelector('.close-notification').addEventListener('click', close_notification_modal);
    modal.querySelector('#notification-ok').addEventListener('click', close_notification_modal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) close_notification_modal();
    });
  }

  // Show confirmation modal_________________________________________________________________________
  function show_confirm_modal(message, on_confirm) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';

    modal.innerHTML = `
      <div class="modal-content notification-modal">
        <span class="close-notification">&times;</span>
        <h2 class="notification-title">Confirmación</h2>
        <p class="notification-message">${message}</p>
        <div class="notification-buttons">
          <button class="notification-btn cancel" id="confirm-cancel">Cancelar</button>
          <button class="notification-btn confirm" id="confirm-ok">Eliminar</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    function close_confirm_modal() {
      modal.style.display = 'none';
      document.body.removeChild(modal);
    }

    modal.querySelector('.close-notification').addEventListener('click', close_confirm_modal);
    modal.querySelector('#confirm-cancel').addEventListener('click', close_confirm_modal);
    modal.querySelector('#confirm-ok').addEventListener('click', function () {
      on_confirm();
      close_confirm_modal();
    });
    modal.addEventListener('click', function (e) {
      if (e.target === modal) close_confirm_modal();
    });
  }

  // Validate URL_________________________________________________________________________
  function is_valid_url(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Load artists_________________________________________________________________________
  function load_artists() {
    const stored = localStorage.getItem('artists');
    return stored ? JSON.parse(stored) : default_artists;
  }

  function save_artists(artists) {
    localStorage.setItem('artists', JSON.stringify(artists));
  }

  // Render artist cards_________________________________________________________________________
  function render_artists() {
    const artists = load_artists();
    let container = document.querySelector('#musician-card .card');

    if (!container) {
      container = document.createElement('article');
      container.className = 'card';
      musician_card_container.appendChild(container);
    }

    container.innerHTML = '';

    artists.forEach((artist, index) => {
      const card = document.createElement('div');
      card.className = 'mini-card';
      card.innerHTML = `
        <img src="${artist.image}" alt="${artist.name}">
        <h3>${artist.name}</h3>
        <p>Genre:</p>
        ${artist.genres.map(genre => `<p>${genre}</p>`).join('')}
        <div class="crud-actions">
          <button class="edit-btn" data-index="${index}">Editar</button>
          <button class="delete-btn" data-index="${index}">Borrar</button>
        </div>
      `;
      container.appendChild(card);
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => edit_artist(btn.dataset.index));
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => delete_artist(btn.dataset.index));
    });
  }

  add_artist_button.addEventListener('click', () => {
    editing_index = null;
    modal_title.textContent = 'Agregar Artista';
    artist_form.reset();
    artist_modal.style.display = 'flex';
  });

  // Close modal_________________________________________________________________________
  close_modal_button.addEventListener('click', () => {
    artist_modal.style.display = 'none';
  });

  cancel_modal_button.addEventListener('click', () => {
    artist_modal.style.display = 'none';
  });

  // Save artist_________________________________________________________________________
  artist_form.addEventListener('submit', (e) => {
    e.preventDefault();

    let is_valid = true;
    const name = document.getElementById('artist-name').value.trim();
    const image = document.getElementById('artist-image').value.trim();
    const genres_input = document.getElementById('artist-genres').value.trim();

    if (!name) {
      document.getElementById('error-artist-name').textContent = 'Por favor, ingresa el nombre del artista';
      is_valid = false;
    }

    if (!image) {
      document.getElementById('error-artist-image').textContent = 'Por favor, ingresa la URL de la imagen';
      is_valid = false;
    } else if (!is_valid_url(image)) {
      document.getElementById('error-artist-image').textContent = 'Por favor, ingresa una URL válida';
      is_valid = false;
    }

    if (!genres_input) {
      document.getElementById('error-artist-genres').textContent = 'Por favor, ingresa al menos un género';
      is_valid = false;
    }

    if (is_valid) {
      const genres = genres_input.split(',').map(g => g.trim()).filter(g => g);

      if (genres.length === 0) {
        document.getElementById('error-artist-genres').textContent = 'Por favor, ingresa al menos un género válido';
        return;
      }

      const artists = load_artists();

      if (editing_index !== null) {
        artists[editing_index] = { name, image, genres };
        show_modal('¡Artista actualizado correctamente!');
      } else {
        artists.push({ name, image, genres });
        show_modal('¡Artista agregado correctamente!');
      }

      save_artists(artists);
      artist_modal.style.display = 'none';
      render_artists();
    }
  });

  // Edit artist_________________________________________________________________________
  function edit_artist(index) {
    const artists = load_artists();
    const artist = artists[index];
    editing_index = index;
    modal_title.textContent = 'Editar Artista';
    document.getElementById('artist-name').value = artist.name;
    document.getElementById('artist-image').value = artist.image;
    document.getElementById('artist-genres').value = artist.genres.join(', ');
    artist_modal.style.display = 'flex';
  }

  // Delete artist_________________________________________________________________________
  function delete_artist(index) {
    const artists = load_artists();
    const artist_name = artists[index].name;

    show_confirm_modal(
      `¿Estás seguro de que quieres eliminar a ${artist_name}?`,
      function () {
        artists.splice(index, 1);
        save_artists(artists);
        render_artists();
        show_modal('Artista eliminado correctamente');
      }
    );
  }

  render_artists();
});
