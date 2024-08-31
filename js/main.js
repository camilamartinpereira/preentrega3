document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const genreSelect = document.getElementById('genreSelect');

    // Evento para buscar playlists
    searchBtn.addEventListener('click', searchPlaylists);

    // Función para cargar credenciales desde el archivo JSON
    async function checkUserCredentials() {
        try {
            const response = await fetch('../data/credentials.json');
            if (!response.ok) throw new Error('No se pudo cargar el archivo de credenciales.');
            const credentials = await response.json();
            authenticateUser(credentials.users);
        } catch (error) {
            console.error("Error al cargar las credenciales: ", error);
            Swal.fire('Error', 'No se pudo cargar las credenciales.', 'error');
        }
    }

    // Función para autenticar al usuario
    async function authenticateUser(users) {
        const { value: formValues } = await Swal.fire({
            title: 'Iniciar sesión',
            html: '<input id="swal-input1" class="swal2-input" placeholder="Usuario">' +
                  '<input id="swal-input2" class="swal2-input" type="password" placeholder="Contraseña">',
            focusConfirm: false,
            preConfirm: () => {
                return [
                    document.getElementById('swal-input1').value,
                    document.getElementById('swal-input2').value
                ];
            },
            allowOutsideClick: false,
            backdrop: `rgba(0,0,123,0.4) left top no-repeat`
        });

        const user = users.find(u => u.username === formValues[0] && u.password === formValues[1]);

        if (!user) {
            Swal.fire('Credenciales incorrectas', '', 'error').then(() => {
                checkUserCredentials();
            });
        } else {
            Swal.fire(`Bienvenido ${user.username}`, '', 'success');
            // Aquí se puede continuar con la lógica de la aplicación después de la autenticación
        }
    }

    // Función para buscar playlists guardadas en el localStorage
    function searchPlaylists() {
        const searchTerm = searchInput.value.toLowerCase();
        const playlists = JSON.parse(localStorage.getItem('playlists')) || [];

        const matches = playlists.filter(playlist => {
            const hasNameMatch = playlist.name?.toLowerCase().includes(searchTerm);
            const hasGenreMatch = playlist.genre?.toLowerCase().includes(searchTerm);
            const hasSongMatch = playlist.songs?.some(song => song.name?.toLowerCase().includes(searchTerm));

            return hasNameMatch || hasGenreMatch || hasSongMatch;
        });

        if (matches.length > 0) {
            const results = matches.map(match => `
                <div class="mb-4">
                    <h3 class="text-xl font-bold">${match.name}</h3>
                    <p class="text-gray-700">Género: ${match.genre}</p>
                    <p class="text-gray-700">Canciones:</p>
                    <ul class="list-disc pl-5">
                        ${match.songs?.map(song => `<li>${song.name} - ${song.artist}</li>`).join('') || '<li>Sin canciones</li>'}
                    </ul>
                    <button onclick="location.href='../pages/playlists.html'" class="mt-4 bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-md">Editar Playlist</button>
                </div>
            `).join('<hr class="my-4">');

            Swal.fire({
                title: 'Resultados de la búsqueda',
                html: results,
                confirmButtonText: 'Cerrar'
            });
        } else {
            Swal.fire('No se encontraron coincidencias.', '', 'info');
        }
    }

    // Función para obtener el token de Spotify
    async function fetchSpotifyToken() {
        const clientId = '3269f6be905542e4a55dace8b033a9ac';
        const clientSecret = '5af92f6c0b0243c68a8e8c6ad412bc75';

        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await response.json();
        return data.access_token;
    }

    // Función para obtener recomendaciones de canciones de Spotify
    async function fetchSpotifyRecomendaciones() {
        const token = await fetchSpotifyToken();
        const genre = localStorage.getItem('playlistGenre').toLowerCase();

        const response = await fetch(`https://api.spotify.com/v1/recommendations?seed_genres=${genre}&limit=5`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        const tracks = data.tracks;

        const recommendedSongsContainer = document.getElementById('recommendedSongsContainer');
        recommendedSongsContainer.innerHTML = '';

        if (tracks && tracks.length > 0) {
            tracks.forEach(track => {
                const songItem = document.createElement('div');
                songItem.classList.add('bg-white', 'p-2', 'rounded-md', 'shadow-sm', 'hover:shadow-md', 'transition-shadow', 'duration-300');
                songItem.innerHTML = `
                    <input type="checkbox" id="track-${track.id}" data-song-name="${track.name}" data-song-artist="${track.artists[0].name}">
                    <label for="track-${track.id}" class="ml-2 text-gray-700">${track.name} - ${track.artists[0].name}</label>
                `;
                recommendedSongsContainer.appendChild(songItem);
            });
        } else {
            recommendedSongsContainer.innerHTML = '<p class="text-red-500">No se encontraron canciones recomendadas para este género.</p>';
        }
    }

    // Evento para el botón de crear playlist
    const crearPlaylistBtn = document.getElementById("crearPlaylistBtn");
    const crearPlaylistSection = document.getElementById("crearPlaylist");

    crearPlaylistBtn.addEventListener("click", () => {
        renderNombrePlaylistForm();
        crearPlaylistSection.style.display = 'block';
    });

    // Función para renderizar el formulario de nombre de la playlist
    function renderNombrePlaylistForm() {
        updateProgress(1);
        crearPlaylistSection.innerHTML = `
            <div class="mb-4">
                <h3 class="text-xl font-bold">¿Qué nombre le deseas poner?</h3>
                <input id="playlistName" type="text" class="mt-2 p-2 border border-gray-300 rounded w-full">
                <p id="errorPlaylistName" class="text-red-500 text-sm"></p>
            </div>
            <button id="siguienteBtn" class="bg-blue-400 text-white px-4 py-2 rounded">Siguiente</button>
        `;

        document.getElementById("siguienteBtn").addEventListener("click", renderGeneroPlaylistForm);
    }

    // Función para renderizar el formulario de selección de género
    function renderGeneroPlaylistForm() {
        const playlistName = document.getElementById("playlistName").value;
        if (playlistName && playlistName.length >= 3) {
            localStorage.setItem('playlistName', playlistName);
            updateProgress(2);
            crearPlaylistSection.innerHTML = `
                <div class="mb-4">
                    <h3 class="text-xl font-bold">¿Qué género es?</h3>
                    <select id="playlistGenre" class="mt-2 p-2 border border-gray-300 rounded w-full">
                        <option value="Pop">Pop</option>
                        <option value="Rock">Rock</option>
                        <option value="Jazz">Jazz</option>
                        <option value="Hip-hop">Hip-hop</option>
                        <option value="Clásica">Clásica</option>
                    </select>
                </div>
                <button id="crearBtn" class="bg-blue-400 text-white px-4 py-2 rounded">Crear</button>
            `;

            document.getElementById("crearBtn").addEventListener("click", renderAddSongsDecision);
        } else {
            Swal.fire('Por favor, ingresa un nombre para la playlist.', '', 'error');
        }
    }

    // Función para decidir cómo agregar canciones
    function renderAddSongsDecision() {
        const playlistGenre = document.getElementById("playlistGenre").value;
        if (playlistGenre) {
            localStorage.setItem('playlistGenre', playlistGenre);
            updateProgress(3);
            crearPlaylistSection.innerHTML = `
                <div class="mb-4">
                    <h3 class="text-xl font-bold">¿Cómo te gustaría agregar canciones?</h3>
                    <div class="flex flex-col space-y-4">
                        <button id="recommendSongsBtn" class="bg-blue-400 text-white px-4 py-2 rounded">Recomendarme canciones</button>
                        <button id="addSongsManuallyBtn" class="bg-green-400 text-white px-4 py-2 rounded">Agregar canciones manualmente</button>
                    </div>
                </div>
            `;

            document.getElementById("recommendSongsBtn").addEventListener("click", renderRecommendedSongs);
            document.getElementById("addSongsManuallyBtn").addEventListener("click", renderManualSongEntry);
        } else {
            Swal.fire('Por favor, selecciona un género para continuar.', '', 'error');
        }
    }

    // Función para mostrar canciones recomendadas por Spotify
    function renderRecommendedSongs() {
        const genre = localStorage.getItem('playlistGenre').toLowerCase();
        updateProgress(4);

        crearPlaylistSection.innerHTML = `
            <div class="mb-4">
                <h3 class="text-xl font-bold">Canciones recomendadas para ${genre.charAt(0).toUpperCase() + genre.slice(1)}</h3>
                <div id="recommendedSongsContainer" class="space-y-2">
                    <!-- Canciones recomendadas se cargarán aquí -->
                </div>
                <button id="nextBtn" class="bg-blue-400 text-white px-4 py-2 rounded">Agregar canciones seleccionadas</button>
            </div>
        `;

        fetchSpotifyRecomendaciones();

        document.getElementById("nextBtn").addEventListener("click", function() {
            const selectedSongs = document.querySelectorAll('#recommendedSongsContainer input[type="checkbox"]:checked');
            if (selectedSongs.length > 0) {
                const playlistSongs = Array.from(selectedSongs).map(song => ({
                    name: song.dataset.songName,
                    artist: song.dataset.songArtist
                }));
                localStorage.setItem('playlistSongs', JSON.stringify(playlistSongs));
                renderSummary();
            } else {
                Swal.fire('Por favor, selecciona al menos una canción.', '', 'error');
            }
        });
    }

    // Función para permitir la entrada manual de canciones
    function renderManualSongEntry() {
        updateProgress(4);
        crearPlaylistSection.innerHTML = `
            <div class="mb-4">
                <h3 class="text-xl font-bold">Agrega canciones manualmente</h3>
                <div id="manualSongsContainer" class="space-y-2">
                    <!-- Campos dinámicos para ingresar canciones -->
                </div>
                <button id="addMoreSongsBtn" class="bg-green-400 text-white px-4 py-2 rounded">Agregar otra canción</button>
                <button id="finishManualEntryBtn" class="bg-blue-400 text-white px-4 py-2 rounded">Finalizar y continuar</button>
            </div>
        `;

        addManualSongInput();

        document.getElementById("addMoreSongsBtn").addEventListener("click", addManualSongInput);
        document.getElementById("finishManualEntryBtn").addEventListener("click", function() {
            const songInputs = document.querySelectorAll('#manualSongsContainer .song-input');
            const playlistSongs = [];
            let valid = true;

            songInputs.forEach(input => {
                const name = input.querySelector('.song-name').value;
                const artist = input.querySelector('.song-artist').value;
                if (name && artist) {
                    playlistSongs.push({ name, artist });
                } else {
                    valid = false;
                }
            });

            if (valid && playlistSongs.length > 0) {
                localStorage.setItem('playlistSongs', JSON.stringify(playlistSongs));
                renderSummary();
            } else {
                Swal.fire('Por favor, completa todos los campos.', '', 'error');
            }
        });
    }

    // Función para agregar un nuevo campo de entrada para canciones
    function addManualSongInput() {
        const manualSongsContainer = document.getElementById("manualSongsContainer");
        const songInput = document.createElement('div');
        songInput.classList.add('song-input', 'flex', 'space-x-2');
        songInput.innerHTML = `
            <input type="text" placeholder="Nombre de la canción" class="song-name w-full px-4 py-2 border border-gray-300 rounded-md">
            <input type="text" placeholder="Artista" class="song-artist w-full px-4 py-2 border border-gray-300 rounded-md">
        `;
        manualSongsContainer.appendChild(songInput);
    }

    // Función para mostrar el resumen de la playlist
    function renderSummary() {
        updateProgress(5);
        const playlistName = localStorage.getItem('playlistName');
        const playlistGenre = localStorage.getItem('playlistGenre');
        const playlistSongs = JSON.parse(localStorage.getItem('playlistSongs'));

        crearPlaylistSection.innerHTML = `
            <div class="mb-4">
                <h3 class="text-xl font-bold">Resumen de tu Playlist</h3>
                <p><strong>Nombre:</strong> ${playlistName}</p>
                <p><strong>Género:</strong> ${playlistGenre}</p>
                <p><strong>Canciones:</strong></p>
                <ul class="list-disc pl-5">
                    ${playlistSongs.map(song => `<li>${song.name} - ${song.artist}</li>`).join('')}
                </ul>
                <button id="savePlaylistBtn" class="bg-blue-400 text-white px-4 py-2 rounded">Guardar Playlist</button>
            </div>
        `;

        document.getElementById("savePlaylistBtn").addEventListener("click", function() {
            const playlists = JSON.parse(localStorage.getItem('playlists')) || [];
            playlists.push({ 
                name: playlistName, 
                genre: playlistGenre, 
                songs: playlistSongs 
            });
            localStorage.setItem('playlists', JSON.stringify(playlists));

            Swal.fire({
                title: '¡Playlist creada con éxito!',
                icon: 'success',
                confirmButtonText: 'Ir a mis playlists',
                showCancelButton: true,
                cancelButtonText: 'Crear otra'
            }).then((result) => {
                if (result.isConfirmed) {
                    location.href = 'pages/playlists.html';
                } else {
                    location.reload();
                }
            });
        });
    }

    // Iniciar el proceso de autenticación si no hay una sesión activa
    checkUserCredentials();
});

// Función para actualizar la barra de progreso en el proceso de creación de playlists
function updateProgress(step) {
    const progressIndicator = document.getElementById('progressIndicator');
    const progressText = document.getElementById('progressText');
    if (progressIndicator && progressText) {
        if (step === 1) {
            progressIndicator.style.width = '20%';
            progressText.textContent = 'Paso 1 de 5: Nombre de la Playlist';
        } else if (step === 2) {
            progressIndicator.style.width = '40%';
            progressText.textContent = 'Paso 2 de 5: Género de la Playlist';
        } else if (step === 3) {
            progressIndicator.style.width = '60%';
            progressText.textContent = 'Paso 3 de 5: Adición de Canciones';
        } else if (step === 4) {
            progressIndicator.style.width = '80%';
            progressText.textContent = 'Paso 4 de 5: Selección de Canciones';
        } else if (step === 5) {
            progressIndicator.style.width = '100%';
            progressText.textContent = 'Paso 5 de 5: Resumen y Guardado';
        }
    }
}

// Configuraciones de Tippy.js para agregar tooltips a los botones
tippy('.btn-add-song', {
    content: 'Añade una nueva canción a esta playlist',
    theme: 'light-border',
    placement: 'top',
});

tippy('.btn-create-spotify', {
    content: 'Crea esta playlist directamente en Spotify',
    theme: 'light-border',
    placement: 'top',
});

tippy('.btn-delete-playlist', {
    content: 'Elimina esta playlist permanentemente',
    theme: 'light-border',
    placement: 'top',
});
