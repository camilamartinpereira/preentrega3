let simulador; // Definimos simulador en un ámbito global.

document.addEventListener('DOMContentLoaded', () => {
    simulador = new SimuladorPlaylists();
    simulador.playlists.forEach(playlist => {
        agregarPlaylistDOM(playlist);
    });
});

function agregarPlaylistDOM(playlist) {
    const playlistContainer = document.createElement('div');
    playlistContainer.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow-lg', 'mb-4');
    playlistContainer.id = playlist.nombre;

    playlistContainer.innerHTML = `
        <h3 class="text-xl font-bold mb-2">${playlist.nombre}</h3>
        <p class="mb-2">Estado de ánimo: ${playlist.estadoAnimo}</p>
        <p class="playlist-duracion mb-2">Duración total: ${playlist.duracionTotal
        } minutos</p>
        <ul class="lista-canciones mb-2"></ul>
        <button onclick="mostrarFormularioAgregarCancion('${playlist.nombre}')">Agregar Canción</button>
        <button onclick="verCanciones('${playlist.nombre}')">Ver Canciones</button>
        <button onclick="eliminarPlaylist('${playlist.nombre}')">Eliminar Playlist</button>
        <div class="formulario-agregar-cancion mt-4" style="display:none;">
            <input type="text" placeholder="Nombre de la canción" class="cancion-nombre border rounded-lg p-2 w-full mb-2">
            <input type="number" placeholder="Duración en minutos" class="cancion-duracion border rounded-lg p-2 w-full mb-2">
            <button onclick="agregarCancion('${playlist.nombre}')">Agregar Canción</button>
        </div>
        <div id="mensaje-${playlist.nombre}" class="text-green-500 font-semibold mt-2" style="display:none;"></div>
    `;
    document.getElementById('playlistList').appendChild(playlistContainer);
    actualizarPlaylistDOM(playlist);
}

function mostrarFormularioAgregarCancion(nombrePlaylist) {
    const playlistContainer = document.getElementById(nombrePlaylist);
    const formulario = playlistContainer.querySelector('.formulario-agregar-cancion');
    formulario.style.display = formulario.style.display === 'none' ? 'block' : 'none';
}

function agregarCancion(nombrePlaylist) {
    const playlist = simulador.playlists.find(p => p.nombre === nombrePlaylist);
    const nombreCancion = document.querySelector(`#${nombrePlaylist} .cancion-nombre`).value;
    const duracionCancion = document.querySelector(`#${nombrePlaylist} .cancion-duracion`).value;
    if (nombreCancion && duracionCancion) {
        playlist.canciones.push(new Cancion(nombreCancion, duracionCancion));
        playlist.duracionTotal += parseInt(duracionCancion);
        simulador.guardarEnStorage();
        actualizarPlaylistDOM(playlist);
        mostrarMensaje(nombrePlaylist, "🎵 Canción agregada con éxito!");
    } else {
        mostrarMensaje(nombrePlaylist, "🚫 Por favor, completa todos los campos de la canción.");
    }
}

function verCanciones(nombrePlaylist) {
    const playlist = simulador.playlists.find(p => p.nombre === nombrePlaylist);
    actualizarPlaylistDOM(playlist);
}

function eliminarPlaylist(nombrePlaylist) {
    if (confirm(`¿Estás seguro de que deseas eliminar la playlist ${nombrePlaylist}?`)) {
        simulador.playlists = simulador.playlists.filter(p => p.nombre !== nombrePlaylist);
        simulador.guardarEnStorage();
        document.getElementById(nombrePlaylist).remove();
        alert("🗑️ Playlist eliminada con éxito!");
    }
}

function mostrarMensaje(nombrePlaylist, mensaje) {
    const mensajeDiv = document.getElementById(`mensaje-${nombrePlaylist}`);
    mensajeDiv.textContent = mensaje;
    mensajeDiv.style.display = 'block';
    setTimeout(() => {
        mensajeDiv.style.display = 'none';
    }, 3000);
}

function actualizarPlaylistDOM(playlist) {
    const playlistContainer = document.getElementById(playlist.nombre);
    const listaCanciones = playlistContainer.querySelector('.lista-canciones');
    listaCanciones.innerHTML = '';
    playlist.canciones.forEach(cancion => {
        const cancionItem = document.createElement('li');
        cancionItem.textContent = `${cancion.nombre} - ${cancion.duracion} min`;
        listaCanciones.appendChild(cancionItem);
    });
    const duracionTotalElem = playlistContainer.querySelector('.playlist-duracion');
    duracionTotalElem.textContent = `Duración total: ${playlist.duracionTotal} minutos`;
}
