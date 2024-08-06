class Cancion {
    constructor(nombre, duracion) {
        this.nombre = nombre;
        this.duracion = Math.round(duracion);
    }

    pluralizarMinutos() {
        return this.duracion === 1 ? `${this.duracion} minuto` : `${this.duracion} minutos`;
    }
}

class Playlist {
    constructor(nombre, estadoAnimo) {
        this.nombre = nombre;
        this.estadoAnimo = estadoAnimo;
        this.canciones = [];
        this.duracionTotal = 0;
    }

    agregarCancion(nombre, duracion) {
        if (nombre && !isNaN(duracion)) {
            const nuevaCancion = new Cancion(nombre, duracion);
            this.canciones.push(nuevaCancion);
            this.duracionTotal += duracion;
            this.actualizarDOM();
            this.guardarEnStorage();
        } else {
            this.mostrarMensajeError("🚫 Por favor, ingrese información válida.");
        }
    }

    eliminarCancion(index) {
        if (index >= 0 && index < this.canciones.length) {
            const cancionEliminada = this.canciones.splice(index, 1)[0];
            this.duracionTotal -= cancionEliminada.duracion;
            this.actualizarDOM();
            this.guardarEnStorage();
        }
    }

    actualizarDOM() {
        const playlistContainer = document.getElementById(this.nombre);
        const duracionElement = playlistContainer.querySelector('.playlist-duracion');
        const listaCanciones = playlistContainer.querySelector('.lista-canciones');
        duracionElement.textContent = `Duración total: ${this.duracionTotal} minutos`;
        listaCanciones.innerHTML = this.canciones.map((cancion, index) => 
            `<li>${cancion.nombre} (${cancion.pluralizarMinutos()})
                <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="eliminarCancion('${this.nombre}', ${index})">Eliminar</button>
            </li>`
        ).join('');
    }

    mostrarMensajeError(mensaje) {
        const errorContainer = document.getElementById('errorMessages');
        errorContainer.textContent = mensaje;
        errorContainer.style.display = 'block';
        setTimeout(() => errorContainer.style.display = 'none', 3000);
    }

    guardarEnStorage() {
        localStorage.setItem('playlists', JSON.stringify(simulador.playlists));
    }

    static cargarDesdeStorage() {
        const playlists = JSON.parse(localStorage.getItem('playlists')) || [];
        return playlists.map(pl => {
            const playlist = new Playlist(pl.nombre, pl.estadoAnimo);
            playlist.canciones = pl.canciones.map(c => new Cancion(c.nombre, c.duracion));
            playlist.duracionTotal = pl.duracionTotal;
            return playlist;
        });
    }
}

class SimuladorPlaylists {
    constructor() {
        this.playlists = Playlist.cargarDesdeStorage();
        this.playlists.forEach(playlist => this.agregarPlaylistDOM(playlist));
        if (this.playlists.length > 0) {
            this.mostrarFormularioBusqueda(); // Muestra el formulario de búsqueda si ya existen playlists
        }
    }

    crearPlaylist(nombre, estadoAnimo) {
        if (nombre && estadoAnimo) {
            const nuevaPlaylist = new Playlist(nombre, estadoAnimo);
            this.playlists.push(nuevaPlaylist);
            this.agregarPlaylistDOM(nuevaPlaylist);
            this.mostrarFormularioBusqueda();
            this.guardarEnStorage();
        } else {
            this.mostrarMensajeError("🚫 Por favor, ingrese información válida.");
        }
    }

    agregarPlaylistDOM(playlist) {
        const playlistDiv = document.createElement('div');
        playlistDiv.className = 'bg-white p-4 rounded-lg shadow-lg flex flex-col';
        playlistDiv.id = playlist.nombre;
        playlistDiv.innerHTML = 
            `<div class="playlist-header mb-3">
                <span class="text-xl font-bold">${playlist.nombre}</span>
            </div>
            <p>Estado de ánimo: ${playlist.estadoAnimo}</p>
            <p class="playlist-duracion">Duración total: ${playlist.duracionTotal} minutos</p>
            <div class="canciones-container" style="display:none;">
                <ul class="lista-canciones mb-3"></ul>
            </div>
            <div class="mt-auto">
                <button class="bg-gray-500 text-white px-2 py-1 rounded" onclick="toggleCanciones('${playlist.nombre}')">Ver Canciones</button>
                <button class="bg-blue-500 text-white px-2 py-1 rounded mt-2" onclick="toggleAgregarCancion('${playlist.nombre}')">Agregar Canción</button>
                <form class="agregar-cancion-form space-y-2" style="display:none;" onsubmit="event.preventDefault(); agregarCancion('${playlist.nombre}')">
                    <div>
                        <label for="nombreCancion-${playlist.nombre}" class="block text-lg font-semibold mb-2">Nombre de la Canción</label>
                        <input type="text" id="nombreCancion-${playlist.nombre}" class="border rounded-lg p-2 w-full" placeholder="Nombre de la canción">
                    </div>
                    <div>
                        <label for="duracionCancion-${playlist.nombre}" class="block text-lg font-semibold mb-2">Duración (minutos)</label>
                        <input type="number" id="duracionCancion-${playlist.nombre}" class="border rounded-lg p-2 w-full" placeholder="Duración en minutos">
                    </div>
                    <button type="submit" class="bg-pastel-pink text-white font-semibold py-2 px-4 rounded shadow-md hover:bg-pastel-yellow">Agregar Canción</button>
                </form>
            </div>`;
        document.getElementById('playlistList').appendChild(playlistDiv);
    }

    mostrarFormularioBusqueda() {
        document.getElementById('busquedaFormContainer').style.display = 'block';
    }

    mostrarMensajeError(mensaje) {
        const errorContainer = document.getElementById('errorMessages');
        errorContainer.textContent = mensaje;
        errorContainer.style.display = 'block';
        setTimeout(() => errorContainer.style.display = 'none', 3000);
    }

    guardarEnStorage() {
        localStorage.setItem('playlists', JSON.stringify(this.playlists));
    }
}

const simulador = new SimuladorPlaylists();

document.getElementById('comenzarButton').addEventListener('click', () => {
    document.getElementById('playlistFormContainer').style.display = 'block';
    document.getElementById('comenzarButton').style.display = 'none';
});

document.getElementById('playlistForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const nombre = document.getElementById('playlistName').value;
    const estadoAnimo = document.getElementById('playlistMood').value;
    simulador.crearPlaylist(nombre, estadoAnimo);
    this.reset();
});

function agregarCancion(nombrePlaylist) {
    const nombreCancion = document.getElementById(`nombreCancion-${nombrePlaylist}`).value;
    const duracionCancion = parseFloat(document.getElementById(`duracionCancion-${nombrePlaylist}`).value);
    const playlist = simulador.playlists.find(pl => pl.nombre === nombrePlaylist);
    playlist.agregarCancion(nombreCancion, duracionCancion);
}

function eliminarCancion(nombrePlaylist, index) {
    const playlist = simulador.playlists.find(pl => pl.nombre === nombrePlaylist);
    playlist.eliminarCancion(index);
}

function toggleCanciones(nombrePlaylist) {
    const container = document.querySelector(`#${nombrePlaylist} .canciones-container`);
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
}

function toggleAgregarCancion(nombrePlaylist) {
    const form = document.querySelector(`#${nombrePlaylist} .agregar-cancion-form`);
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

document.getElementById('buscarButton').addEventListener('click', () => {
    const criterio = document.getElementById('criterioBusqueda').value;
    const textoBusqueda = document.getElementById('buscarTexto').value.toLowerCase();
    const resultados = simulador.playlists.filter(pl => 
        (criterio === 'estadoAnimo' && pl.estadoAnimo.toLowerCase().includes(textoBusqueda)) ||
        (criterio === 'duracion' && pl.duracionTotal.toString().includes(textoBusqueda))
    );
    document.getElementById('resultadosBusqueda').innerHTML = resultados.length > 0
        ? resultados.map(pl => `<div class="bg-white p-4 rounded-lg shadow-md mb-4">
                                    <h3 class="text-xl font-bold">${pl.nombre}</h3>
                                    <p>Estado de ánimo: ${pl.estadoAnimo}</p>
                                    <p>Duración total: ${pl.duracionTotal} minutos</p>
                                  </div>`).join('')
        : '<p class="text-gray-600">No se encontraron resultados.</p>';
});
