document.addEventListener("DOMContentLoaded", function () {
    const playlistsContainer = document.getElementById("playlistsContainer");
    let playlists = JSON.parse(localStorage.getItem('playlists')) || [];

    function renderPlaylists() {
        playlistsContainer.innerHTML = '';

        playlists.forEach((playlist, index) => {
            if (!playlist.songs) {
                playlist.songs = [];
            }

            const playlistDiv = document.createElement('div');
            playlistDiv.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow-md', 'hover:shadow-lg', 'transition-shadow', 'duration-300');

            playlistDiv.innerHTML = `
                <h3 class="text-xl font-bold text-pink-600 mb-2">${playlist.name}</h3>
                <p class="text-gray-700 mb-2">Género: ${playlist.genre}</p>
                <div class="flex flex-col space-y-2">
                    <button class="btn-add-song bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded-md" data-index="${index}">Agregar canción</button>
                    <button class="btn-view-songs bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-md" data-index="${index}">Ver canciones</button>
                    <button class="btn-create-spotify bg-purple-400 hover:bg-purple-500 text-white px-4 py-2 rounded-md" data-index="${index}">Crear en Spotify</button>
                    <button class="btn-delete-playlist bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-md" data-index="${index}">Eliminar playlist</button>
                </div>
            `;

            playlistsContainer.appendChild(playlistDiv);

            playlistDiv.querySelector('.btn-add-song').addEventListener('click', () => agregarCancion(index));
            playlistDiv.querySelector('.btn-view-songs').addEventListener('click', () => verCanciones(index));
            playlistDiv.querySelector('.btn-create-spotify').addEventListener('click', () => crearPlaylistEnSpotify(index));
            playlistDiv.querySelector('.btn-delete-playlist').addEventListener('click', () => eliminarPlaylist(index));
        });

        tippy('.btn-add-song, .btn-view-songs, .btn-create-spotify, .btn-delete-playlist', {
            theme: 'light-border'
        });

        localStorage.setItem('playlists', JSON.stringify(playlists));
    }

    async function crearPlaylistEnSpotify(index) {
        const token = await authenticateWithSpotify();

        if (!token) {
            Swal.fire('Error', 'No se pudo autenticar con Spotify', 'error');
            return;
        }

        const playlistName = playlists[index].name;
        const songUris = await buscarCancionesEnSpotify(playlists[index].songs, token);

        if (songUris.length === 0) {
            Swal.fire('Error', 'No se pudieron encontrar las canciones en Spotify', 'error');
            return;
        }

        const playlistId = await crearNuevaPlaylistEnSpotify(playlistName, token);

        if (!playlistId) {
            Swal.fire('Error', 'No se pudo crear la playlist en Spotify', 'error');
            return;
        }

        const success = await agregarCancionesAPlaylist(playlistId, songUris, token);

        if (success) {
            Swal.fire('Playlist creada en Spotify', '¡Tu playlist ha sido creada exitosamente en Spotify!', 'success');
        } else {
            Swal.fire('Error', 'No se pudieron agregar las canciones a la playlist en Spotify', 'error');
        }
    }

    async function authenticateWithSpotify() {
        const clientId = '3269f6be905542e4a55dace8b033a9ac';
        const redirectUri = 'https://camilamartinpereira.github.io/'; // URI de redirección
        const scope = 'playlist-modify-public playlist-modify-private';
        const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;

        return new Promise((resolve, reject) => {
            const authWindow = window.open(authUrl, 'spotify-auth', 'width=500,height=700');
            const interval = setInterval(() => {
                try {
                    const url = authWindow.location.href;
                    if (url.includes('#access_token')) {
                        const accessToken = new URLSearchParams(url.split('#')[1]).get('access_token');
                        authWindow.close();
                        clearInterval(interval);
                        resolve(accessToken);
                    }
                } catch (error) {
                    clearInterval(interval);
                    reject('Error al obtener el token de acceso');
                }
            }, 1000);
        });
    }

    async function buscarCancionesEnSpotify(songs, token) {
        const songUris = [];
        for (const song of songs) {
            const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(song.name + ' ' + song.artist)}&type=track&limit=1`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.tracks.items.length > 0) {
                songUris.push(data.tracks.items[0].uri);
            }
        }
        return songUris;
    }

    async function crearNuevaPlaylistEnSpotify(playlistName, token) {
        const response = await fetch('https://api.spotify.com/v1/me/playlists', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: playlistName,
                description: 'Playlist creada desde Bo! Escuchate Esto',
                public: false
            })
        });

        const data = await response.json();
        return data.id;
    }

    async function agregarCancionesAPlaylist(playlistId, songUris, token) {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uris: songUris
            })
        });

        return response.ok; // Devuelve true si la solicitud fue exitosa
    }

    function agregarCancion(index) {
        Swal.fire({
            title: 'Agregar Canción',
            html:
                '<input id="songName" class="swal2-input" placeholder="Nombre de la canción">' +
                '<input id="songArtist" class="swal2-input" placeholder="Artista">',
            focusConfirm: false,
            preConfirm: () => {
                const songName = document.getElementById('songName').value;
                const songArtist = document.getElementById('songArtist').value;

                if (!songName || !songArtist) {
                    Swal.showValidationMessage('Por favor ingresa ambos campos.');
                    return false;
                }

                return { name: songName, artist: songArtist };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const song = result.value;

                if (!playlists[index].songs) {
                    playlists[index].songs = [];
                }

                playlists[index].songs.push(song);
                localStorage.setItem('playlists', JSON.stringify(playlists));
                Swal.fire('Canción agregada!', '', 'success');
            }
        });
    }

    function verCanciones(index) {
        const songs = playlists[index].songs || [];

        if (songs.length === 0) {
            Swal.fire('Esta playlist no tiene canciones.');
            return;
        }

        const songList = songs.map(song => `<li class="text-gray-700">${song.name} - ${song.artist}</li>`).join('');
        Swal.fire({
            title: `Canciones de ${playlists[index].name}`,
            html: `<ul class="text-left">${songList}</ul>`,
            confirmButtonText: 'Cerrar'
        });
    }

    function eliminarPlaylist(index) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminarla',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                playlists.splice(index, 1);
                localStorage.setItem('playlists', JSON.stringify(playlists));
                renderPlaylists();
                Swal.fire('Playlist eliminada!', '', 'success');
            }
        });
    }

    renderPlaylists();
});
