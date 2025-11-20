document.addEventListener('DOMContentLoaded', function() {
  const musicianCard = document.getElementById('musician-card');
  const addArtistBtn = document.getElementById('add-artist-btn');
  const modal = document.getElementById('artist-modal');
  const closeModal = document.querySelector('.close');
  const artistForm = document.getElementById('artist-form');
  const modalTitle = document.getElementById('modal-title');
  const saveBtn = document.getElementById('save-artist-btn');
  const cancelBtn = document.getElementById('cancel-btn');

  let editingIndex = null;

  // Datos predeterminados de artistas
  const defaultArtists = [
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

  // Cargar artistas desde localStorage o usar predeterminados
  function loadArtists() {
    const storedArtists = localStorage.getItem('artists');
    return storedArtists ? JSON.parse(storedArtists) : defaultArtists;
  }

  // Guardar artistas en localStorage
  function saveArtists(artists) {
    localStorage.setItem('artists', JSON.stringify(artists));
  }

  // Renderizar tarjetas de artistas
  function renderArtists() {
    const artists = loadArtists();
    const cardsContainer = document.querySelector('#musician-card .card') || document.createElement('article');
    cardsContainer.className = 'card';
    cardsContainer.innerHTML = '';

    artists.forEach((artist, index) => {
      const miniCard = document.createElement('div');
      miniCard.className = 'mini-card';
      miniCard.innerHTML = `
        <img src="${artist.image}" alt="${artist.name}">
        <h3>${artist.name}</h3>
        <p>Género:</p>
        ${artist.genres.map(genre => `<p>${genre}</p>`).join('')}
        <div class="crud-actions">
          <button class="edit-btn" data-index="${index}">Editar</button>
          <button class="delete-btn" data-index="${index}">Eliminar</button>
        </div>
      `;
      cardsContainer.appendChild(miniCard);
    });

    musicianCard.appendChild(cardsContainer);

    // Agregar event listeners a botones de editar/eliminar
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => editArtist(e.target.dataset.index));
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => deleteArtist(e.target.dataset.index));
    });
  }

  // Mostrar modal para agregar
  addArtistBtn.addEventListener('click', () => {
    editingIndex = null;
    modalTitle.textContent = 'Agregar Artista';
    artistForm.reset();
    modal.style.display = 'flex';
  });

  // Cerrar modal
  closeModal.addEventListener('click', () => modal.style.display = 'none');
  cancelBtn.addEventListener('click', () => modal.style.display = 'none');

  // Guardar artista (crear o actualizar)
  artistForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('artist-name').value;
    const image = document.getElementById('artist-image').value;
    const genres = document.getElementById('artist-genres').value.split(',').map(g => g.trim());

    const artists = loadArtists();
    if (editingIndex !== null) {
      artists[editingIndex] = { name, image, genres };
    } else {
      artists.push({ name, image, genres });
    }

    saveArtists(artists);
    modal.style.display = 'none';
    renderArtists();
  });

  // Editar artista
  function editArtist(index) {
    const artists = loadArtists();
    const artist = artists[index];
    editingIndex = index;
    modalTitle.textContent = 'Editar Artista';
    document.getElementById('artist-name').value = artist.name;
    document.getElementById('artist-image').value = artist.image;
    document.getElementById('artist-genres').value = artist.genres.join(', ');
    modal.style.display = 'flex';
  }

  // Eliminar artista
  function deleteArtist(index) {
    if (confirm('¿Estás seguro de que quieres eliminar este artista?')) {
      const artists = loadArtists();
      artists.splice(index, 1);
      saveArtists(artists);
      renderArtists();
    }
  }

  // Inicializar
  renderArtists();
});