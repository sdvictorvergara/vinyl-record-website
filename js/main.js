document.addEventListener('DOMContentLoaded', function() {
  const musician_card_container = document.getElementById('musician-card');
  const add_artist_button = document.getElementById('add-artist-btn');
  const artist_modal = document.getElementById('artist-modal');
  const close_modal_button = document.querySelector('.close');
  const artist_form = document.getElementById('artist-form');
  const modal_title = document.getElementById('modal-title');
  const save_artist_button = document.getElementById('save-artist-btn');
  const cancel_modal_button = document.getElementById('cancel-btn');

  let editing_artist_index = null;

  // Datos de artistas predeterminados
  const default_artists = [
    { name: 'Cacho Castaña', image: 'images/artists/cacho-castaña.jpeg', genres: ['Balada Romántica', 'Tango'] },
    { name: 'Carlos Gardel', image: 'images/artists/carlos-gardel.jpeg', genres: ['Música clásica', 'Tango'] },
    { name: 'Hugo del Carril', image: 'images/artists/hugo-carril.jpg', genres: ['Pop', 'Tango'] },
    { name: 'Andres Calamaro', image: 'images/artists/andres-calamaro.jpg', genres: ['Reggae', 'Pop', 'Rock'] },
    { name: 'Fito Paez', image: 'images/artists/fito-paez.webp', genres: ['Rock'] },
    { name: 'Luis Alberto Spinetta', image: 'images/artists/alberto-spinetta.avif', genres: ['Rock'] },
    { name: 'Los Zafiros', image: 'images/artists/los-zafiros.webp', genres: ['Bossa Nova', 'Bolero'] },
    { name: 'Los tres Reyes', image: 'images/artists/trio-reyes.jpg', genres: ['Vals', 'Bolero'] },
    { name: 'Pedro Infante', image: 'images/artists/pedro-infante.jpg', genres: ['Valses', 'chachachás', 'rancheras', 'boleros'] },
    { name: 'WOS', image: 'images/artists/wos.jpg', genres: ['Rock Alternativo', 'Hip hop'] }
  ];

  // Cargar artistas desde localStorage
  function load_artists() {
    const stored_artists = localStorage.getItem('artists');
    return stored_artists ? JSON.parse(stored_artists) : default_artists;
  }

  // Guardar artistas en localStorage
  function save_artists(artists_list) {
    localStorage.setItem('artists', JSON.stringify(artists_list));
  }

  // Renderizar las tarjetas de artistas
  function render_artist_cards() {
    const artists_list = load_artists();
    const cards_container = document.querySelector('#musician-card .card') || document.createElement('article');
    cards_container.className = 'card';
    cards_container.innerHTML = '';

    artists_list.forEach((artist, index) => {
      const artist_card = document.createElement('div');
      artist_card.className = 'mini-card';
      artist_card.innerHTML = `
        <img src="${artist.image}" alt="${artist.name}">
        <h3>${artist.name}</h3>
        <p>Género:</p>
        ${artist.genres.map(genre => `<p>${genre}</p>`).join('')}
        <div class="crud-actions">
          <button class="edit-btn" data-index="${index}">Editar</button>
          <button class="delete-btn" data-index="${index}">Eliminar</button>
        </div>
      `;
      cards_container.appendChild(artist_card);
    });

    musician_card_container.appendChild(cards_container);

    // Eventos para editar y eliminar
    document.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', (e) => edit_artist(e.target.dataset.index));
    });
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', (e) => delete_artist(e.target.dataset.index));
    });
  }

  // Abrir modal para agregar artista
  add_artist_button.addEventListener('click', () => {
    editing_artist_index = null;
    modal_title.textContent = 'Agregar Artista';
    artist_form.reset();
    artist_modal.style.display = 'flex';
  });

  // Cerrar modal
  close_modal_button.addEventListener('click', () => artist_modal.style.display = 'none');
  cancel_modal_button.addEventListener('click', () => artist_modal.style.display = 'none');

  // Guardar artista
  artist_form.addEventListener('submit', (e) => {
    e.preventDefault();
    const artist_name = document.getElementById('artist-name').value;
    const artist_image = document.getElementById('artist-image').value;
    const artist_genres = document.getElementById('artist-genres').value.split(',').map(g => g.trim());

    const artists_list = load_artists();
    if (editing_artist_index !== null) {
      artists_list[editing_artist_index] = { name: artist_name, image: artist_image, genres: artist_genres };
    } else {
      artists_list.push({ name: artist_name, image: artist_image, genres: artist_genres });
    }

    save_artists(artists_list);
    artist_modal.style.display = 'none';
    render_artist_cards();
  });

  // Editar artista
  function edit_artist(index) {
    const artists_list = load_artists();
    const artist_to_edit = artists_list[index];
    editing_artist_index = index;
    modal_title.textContent = 'Editar Artista';
    document.getElementById('artist-name').value = artist_to_edit.name;
    document.getElementById('artist-image').value = artist_to_edit.image;
    document.getElementById('artist-genres').value = artist_to_edit.genres.join(', ');
    artist_modal.style.display = 'flex';
  }

  // Eliminar artista
  function delete_artist(index) {
    if (confirm('¿Estás seguro de que quieres eliminar este artista?')) {
      const artists_list = load_artists();
      artists_list.splice(index, 1);
      save_artists(artists_list);
      render_artist_cards();
    }
  }

  render_artist_cards();
});
