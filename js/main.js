document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    searchBtn.addEventListener('click', searchPlaylists);

    // Función para validar las credenciales de usuario
    async function checkUserCredentials() {
        const response = await fetch('../data/credentials.json');
        const data = await response.json();
        const { users } = data;

        const { value: formValues } = await Swal.fire({
            title: 'Iniciar sesión',
            html:
                '<input id="swal-input1" class="swal2-input" placeholder="Usuario">' +
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
        }
    }

    // Función para realizar búsquedas en las playlists
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
                    <button onclick="location.href='../pages/playlists.html'" class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">Editar Playlist</button>
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

    // Función para obtener el token de acceso de Spotify
    async function fetchSpotifyToken() {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa('3269f6be905542e4a55dace8b033a9ac:5af92f6c0b0243c68a8e8c6ad412bc75')
            },
            body: 'grant_type=client_credentials'
        });

        const data = await response.json();
        return data.access_token;
    }

    // Función para obtener recomendaciones de playlists de Spotify
    async function fetchSpotifyRecomendaciones() {
        const token = await fetchSpotifyToken();

        const response = await fetch('https://api.spotify.com/v1/browse/featured-playlists?country=US&limit=6', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        const data = await response.json();
        const playlists = data.playlists.items;

        // Seleccionamos 3 playlists aleatorias
        const selectedPlaylists = playlists.sort(() => 0.5 - Math.random()).slice(0, 3);

        const spotifyContainer = document.getElementById('spotifyRecomendaciones');
        spotifyContainer.style.display = 'grid';
        spotifyContainer.innerHTML = '';

        selectedPlaylists.forEach(async (playlist) => {
            const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const playlistDetails = await playlistResponse.json();

            const songs = playlistDetails.tracks.items.slice(0, 5).map(item => ({
                name: item.track.name,
                artist: item.track.artists[0].name
            }));

            const playlistElement = document.createElement('div');
            playlistElement.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow-md', 'hover:shadow-lg', 'transition-shadow', 'duration-300');

            playlistElement.innerHTML = `
                <h3 class="text-xl font-bold text-pink-600 mb-2">${playlist.name}</h3>
                <p class="text-gray-700 mb-2">Género: ${playlistDetails.genres ? playlistDetails.genres[0] : 'Desconocido'}</p>
                <p class="text-gray-700 mb-4">Canciones:</p>
                <ul class="list-disc pl-5 mb-4">
                    ${songs.map(song => `<li>${song.name} - ${song.artist}</li>`).join('')}
                </ul>
                <button class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md mt-2">Agregar a mis playlists</button>
            `;

            playlistElement.querySelector('button').addEventListener('click', () => {
                const userPlaylists = JSON.parse(localStorage.getItem('playlists')) || [];
                userPlaylists.push({ 
                    name: playlist.name, 
                    genre: playlistDetails.genres ? playlistDetails.genres[0] : 'Desconocido', 
                    songs 
                });
                localStorage.setItem('playlists', JSON.stringify(userPlaylists));
                Swal.fire('Playlist añadida a tus playlists', '', 'success');
            });

            spotifyContainer.appendChild(playlistElement);
        });
    }

    // Funcionalidad para crear una nueva playlist
    const crearPlaylistBtn = document.getElementById("crearPlaylistBtn");
    const crearPlaylistSection = document.getElementById("crearPlaylist");

    crearPlaylistBtn.addEventListener("click", () => {
        renderNombrePlaylistForm();
        crearPlaylistSection.style.display = 'block';
    });

    function renderNombrePlaylistForm() {
        crearPlaylistSection.innerHTML = `
            <div class="mb-4">
                <h3 class="text-xl font-bold">¿Qué nombre le deseas poner?</h3>
                <input id="playlistName" type="text" class="mt-2 p-2 border border-gray-300 rounded w-full">
            </div>
            <button id="siguienteBtn" class="bg-blue-500 text-white px-4 py-2 rounded">Siguiente</button>
        `;

        document.getElementById("siguienteBtn").addEventListener("click", renderGeneroPlaylistForm);
    }

    function renderGeneroPlaylistForm() {
        const playlistName = document.getElementById("playlistName").value;
        if (playlistName) {
            localStorage.setItem('playlistName', playlistName);
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
                <button id="crearBtn" class="bg-blue-500 text-white px-4 py-2 rounded">Crear</button>
            `;

            document.getElementById("crearBtn").addEventListener("click", () => {
                const playlistGenre = document.getElementById("playlistGenre").value;
                const playlists = JSON.parse(localStorage.getItem('playlists')) || [];
                playlists.push({ name: playlistName, genre: playlistGenre, songs: [] });
                localStorage.setItem('playlists', JSON.stringify(playlists));

                Swal.fire({
                    title: 'Playlist creada con éxito!',
                    icon: 'success',
                    confirmButtonText: 'Editar ahora!',
                    showCancelButton: true,
                    cancelButtonText: 'Crear otra'
                }).then((result) => {
                    if (result.isConfirmed) {
                        location.href = '../pages/playlists.html';
                    } else {
                        renderNombrePlaylistForm();
                    }
                });
            });
        } else {
            Swal.fire('Por favor, ingresa un nombre para la playlist.', '', 'error');
        }
    }

    const recomendarBtn = document.getElementById("recomendarBtn");
    recomendarBtn.addEventListener("click", fetchSpotifyRecomendaciones);

    // Iniciar validación de credenciales al cargar la página
    checkUserCredentials();
});
