document.addEventListener('DOMContentLoaded', function () {
  const MUSICIAN_CARD_CONTAINER = document.getElementById('musician-card');
  const ADD_ARTIST_BUTTON = document.getElementById('add-artist-btn');
  const ARTIST_MODAL = document.getElementById('artist-modal');
  const CLOSE_MODAL_BUTTON = document.querySelector('.close');
  const ARTIST_FORM = document.getElementById('artist-form');
  const MODAL_TITLE = document.getElementById('modal-title');
  const CANCEL_MODAL_BUTTON = document.getElementById('cancel-btn');

  let editing_index = null;

  // Default artists_________________________________________________________________________
  const DEFAULT_ARTISTS = [
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

    function close_notification_modal() {
      MODAL.style.display = 'none';
      document.body.removeChild(MODAL);
    }

    MODAL.querySelector('.close-notification').addEventListener('click', close_notification_modal);
    MODAL.querySelector('#notification-ok').addEventListener('click', close_notification_modal);
    MODAL.addEventListener('click', function (e) {
      if (e.target === MODAL) close_notification_modal();
    });
  }

  // Show confirmation modal_________________________________________________________________________
  function show_confirm_modal(message, on_confirm) {
    const MODAL = document.createElement('div');
    MODAL.className = 'modal';
    MODAL.style.display = 'flex';

    MODAL.innerHTML = `
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

    document.body.appendChild(MODAL);

    function close_confirm_modal() {
      MODAL.style.display = 'none';
      document.body.removeChild(MODAL);
    }

    MODAL.querySelector('.close-notification').addEventListener('click', close_confirm_modal);
    MODAL.querySelector('#confirm-cancel').addEventListener('click', close_confirm_modal);
    MODAL.querySelector('#confirm-ok').addEventListener('click', function () {
      on_confirm();
      close_confirm_modal();
    });
    MODAL.addEventListener('click', function (e) {
      if (e.target === MODAL) close_confirm_modal();
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
    const STORED = localStorage.getItem('artists');
    return STORED ? JSON.parse(STORED) : DEFAULT_ARTISTS;
  }

  function save_artists(artists) {
    localStorage.setItem('artists', JSON.stringify(artists));
  }

  // Render artist cards_________________________________________________________________________
  function render_artists() {
    const ARTISTS = load_artists();
    let container = document.querySelector('#musician-card .card');

    if (!container) {
      container = document.createElement('article');
      container.className = 'card';
      MUSICIAN_CARD_CONTAINER.appendChild(container);
    }

    container.innerHTML = '';

    ARTISTS.forEach((artist, index) => {
      const CARD = document.createElement('div');
      CARD.className = 'mini-card';
      CARD.innerHTML = `
        <img src="${artist.image}" alt="${artist.name}">
        <h3>${artist.name}</h3>
        <p>Genre:</p>
        ${artist.genres.map(genre => `<p>${genre}</p>`).join('')}
        <div class="crud-actions">
          <button class="edit-btn" data-index="${index}">Editar</button>
          <button class="delete-btn" data-index="${index}">Borrar</button>
        </div>
      `;
      container.appendChild(CARD);
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => edit_artist(btn.dataset.index));
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => delete_artist(btn.dataset.index));
    });
  }

  ADD_ARTIST_BUTTON.addEventListener('click', () => {
    editing_index = null;
    MODAL_TITLE.textContent = 'Agregar Artista';
    ARTIST_FORM.reset();
    ARTIST_MODAL.style.display = 'flex';
  });

  // Close modal_________________________________________________________________________
  CLOSE_MODAL_BUTTON.addEventListener('click', () => {
    ARTIST_MODAL.style.display = 'none';
  });

  CANCEL_MODAL_BUTTON.addEventListener('click', () => {
    ARTIST_MODAL.style.display = 'none';
  });

  // Save artist_________________________________________________________________________
  ARTIST_FORM.addEventListener('submit', (e) => {
    e.preventDefault();

    let is_valid = true;
    const NAME = document.getElementById('artist-name').value.trim();
    const IMAGE = document.getElementById('artist-image').value.trim();
    const GENRES_INPUT = document.getElementById('artist-genres').value.trim();

    if (!NAME) {
      document.getElementById('error-artist-name').textContent = 'Por favor, ingresa el nombre del artista';
      is_valid = false;
    }

    if (!IMAGE) {
      document.getElementById('error-artist-image').textContent = 'Por favor, ingresa la URL de la imagen';
      is_valid = false;
    } else if (!is_valid_url(IMAGE)) {
      document.getElementById('error-artist-image').textContent = 'Por favor, ingresa una URL válida';
      is_valid = false;
    }

    if (!GENRES_INPUT) {
      document.getElementById('error-artist-genres').textContent = 'Por favor, ingresa al menos un género';
      is_valid = false;
    }

    if (is_valid) {
      const GENRES = GENRES_INPUT.split(',').map(g => g.trim()).filter(g => g);

      if (GENRES.length === 0) {
        document.getElementById('error-artist-genres').textContent = 'Por favor, ingresa al menos un género válido';
        return;
      }

      const ARTISTS = load_artists();

      if (editing_index !== null) {
        ARTISTS[editing_index] = { name: NAME, image: IMAGE, genres: GENRES };
        show_modal('¡Artista actualizado correctamente!');
      } else {
        ARTISTS.push({ name: NAME, image: IMAGE, genres: GENRES });
        show_modal('¡Artista agregado correctamente!');
      }

      save_artists(ARTISTS);
      ARTIST_MODAL.style.display = 'none';
      render_artists();
    }
  });

  // Edit artist_________________________________________________________________________
  function edit_artist(index) {
    const ARTISTS = load_artists();
    const ARTIST = ARTISTS[index];
    editing_index = index;
    MODAL_TITLE.textContent = 'Editar Artista';
    document.getElementById('artist-name').value = ARTIST.name;
    document.getElementById('artist-image').value = ARTIST.image;
    document.getElementById('artist-genres').value = ARTIST.genres.join(', ');
    ARTIST_MODAL.style.display = 'flex';
  }

  // Delete artist_________________________________________________________________________
  function delete_artist(index) {
    const ARTISTS = load_artists();
    const ARTIST_NAME = ARTISTS[index].name;

    show_confirm_modal(
      `¿Estás seguro de que quieres eliminar a ${ARTIST_NAME}?`,
      function () {
        ARTISTS.splice(index, 1);
        save_artists(ARTISTS);
        render_artists();
        show_modal('Artista eliminado correctamente');
      }
    );
  }

  render_artists();
});
