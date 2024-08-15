document.addEventListener('DOMContentLoaded', function () {
    const playlistsContainer = document.getElementById('playlistsContainer');
    const playlists = JSON.parse(localStorage.getItem('playlists')) || [];
    const urlParams = new URLSearchParams(window.location.search);
    const playlistName = urlParams.get('name');

    if (playlistName) {
        const playlist = playlists.find(p => p.name === playlistName);
        if (playlist) {
            renderPlaylistDetails(playlist);
        } else {
            playlistsContainer.innerHTML = `<p class="text-center text-xl">No se encontró la playlist.</p>`;
        }
    } else {
        renderAllPlaylists(playlists);
    }

    function renderAllPlaylists(playlists) {
        playlistsContainer.innerHTML = '';
        if (playlists.length === 0) {
            playlistsContainer.innerHTML = `<p class="text-center text-xl">No tienes playlists guardadas.</p>`;
        } else {
            playlists.forEach(playlist => {
                const playlistElement = document.createElement('div');
                playlistElement.className = 'bg-white p-4 rounded-lg shadow-md';
                playlistElement.innerHTML = `
                    <h3 class="text-xl font-bold">${playlist.name}</h3>
                    <p>Género: ${playlist.genre}</p>
                    <button class="bg-pastel-pink text-white font-semibold py-2 px-4 rounded shadow-md hover:bg-pastel-yellow mt-2" onclick="editPlaylist('${playlist.name}')">Editar</button>
                    <button class="bg-red-500 text-white font-semibold py-2 px-4 rounded shadow-md hover:bg-red-700 mt-2" onclick="deletePlaylist('${playlist.name}')">Eliminar</button>
                `;
                playlistsContainer.appendChild(playlistElement);
            });
        }
    }

    function renderPlaylistDetails(playlist) {
        playlistsContainer.innerHTML = `
            <h2 class="text-2xl font-bold mb-4">${playlist.name}</h2>
            <p class="text-lg mb-4">Género: ${playlist.genre}</p>
            <button class="bg-pastel-pink text-white font-semibold py-2 px-4 rounded shadow-md hover:bg-pastel-yellow" onclick="editPlaylist('${playlist.name}')">Editar Playlist</button>
            <button class="bg-red-500 text-white font-semibold py-2 px-4 rounded shadow-md hover:bg-red-700" onclick="deletePlaylist('${playlist.name}')">Eliminar Playlist</button>
        `;
    }
});

function editPlaylist(name) {
    const newGenre = prompt("Introduce el nuevo género para la playlist:", "");
    if (newGenre) {
        let playlists = JSON.parse(localStorage.getItem('playlists')) || [];
        const playlistIndex = playlists.findIndex(p => p.name === name);
        if (playlistIndex > -1) {
            playlists[playlistIndex].genre = newGenre;
            localStorage.setItem('playlists', JSON.stringify(playlists));
            alert('Playlist actualizada');
            location.reload();
        }
    }
}

function deletePlaylist(name) {
    let playlists = JSON.parse(localStorage.getItem('playlists')) || [];
    playlists = playlists.filter(playlist => playlist.name !== name);
    localStorage.setItem('playlists', JSON.stringify(playlists));
    location.reload();
}

