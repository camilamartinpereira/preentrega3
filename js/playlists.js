document.addEventListener("DOMContentLoaded", function () {
    const playlistsContainer = document.getElementById("playlistsContainer");
    let playlists = JSON.parse(localStorage.getItem('playlists')) || [];

    function renderPlaylists() {
        playlistsContainer.innerHTML = '';

        playlists.forEach((playlist, index) => {
            // Asegurar que la propiedad songs exista y sea un array
            if (!playlist.songs) {
                playlist.songs = [];
            }

            const playlistDiv = document.createElement('div');
            playlistDiv.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow-md', 'hover:shadow-lg', 'transition-shadow', 'duration-300');

            playlistDiv.innerHTML = `
                <h3 class="text-xl font-bold text-pink-600 mb-2">${playlist.name}</h3>
                <p class="text-gray-700 mb-2">Género: ${playlist.genre}</p>
                <div class="flex flex-col space-y-2">
                    <button class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md" data-index="${index}">Agregar canción</button>
                    <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md" data-index="${index}">Ver canciones</button>
                    <button class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md" data-index="${index}">Eliminar playlist</button>
                </div>
            `;

            playlistsContainer.appendChild(playlistDiv);

            // Eventos para botones
            playlistDiv.querySelector('.bg-green-500').addEventListener('click', () => agregarCancion(index));
            playlistDiv.querySelector('.bg-blue-500').addEventListener('click', () => verCanciones(index));
            playlistDiv.querySelector('.bg-red-500').addEventListener('click', () => eliminarPlaylist(index));
        });

        // Guardar el estado actualizado de las playlists en localStorage
        localStorage.setItem('playlists', JSON.stringify(playlists));
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

                // Asegurar que la playlist tiene un array de canciones
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
        // Asegurar que la playlist tiene un array de canciones
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

    // Renderiza las playlists al cargar la página
    renderPlaylists();
});
