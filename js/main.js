document.addEventListener('DOMContentLoaded', () => {
    const simulador = new SimuladorPlaylists();
    const comenzarButton = document.getElementById('comenzarButton');
    const playlistFormContainer = document.getElementById('playlistFormContainer');
    const playlistForm = document.getElementById('playlistForm');
    const buscarButton = document.getElementById('buscarButton');
    const busquedaFormContainer = document.getElementById('busquedaFormContainer');
    const successMessage = document.getElementById('successMessage');

    comenzarButton.addEventListener('click', () => {
        playlistFormContainer.style.display = 'block';
        busquedaFormContainer.style.display = 'block';
    });

    playlistForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('playlistName').value;
        const genero = document.getElementById('playlistMood').value;
        simulador.crearPlaylist(nombre, genero);
        successMessage.style.display = 'block';
        setTimeout(() => {
            successMessage.style.display = 'none';
            playlistForm.reset();
        }, 3000);
    });

    buscarButton.addEventListener('click', () => {
        const criterio = document.getElementById('criterioBusqueda').value;
        const texto = document.getElementById('buscarTexto').value;
        simulador.buscarPlaylists(criterio, texto);
    });
});

class SimuladorPlaylists {
    constructor() {
        this.playlists = Playlist.cargarDesdeStorage();
        console.log("Playlists loaded from storage:", this.playlists);
    }

    crearPlaylist(nombre, genero) {
        if (nombre && genero) {
            const nuevaPlaylist = new Playlist(nombre, genero);
            this.playlists.push(nuevaPlaylist);
            this.guardarEnStorage();
        } else {
            alert("🚫 Por favor, ingrese información válida.");
        }
    }

    buscarPlaylists(criterio, texto) {
        // Implementación de la lógica de búsqueda
    }

    guardarEnStorage() {
        localStorage.setItem('playlists', JSON.stringify(this.playlists));
        console.log("Playlists saved to storage:", this.playlists);
    }
}

class Playlist {
    constructor(nombre, genero) {
        this.nombre = nombre;
        this.genero = genero;
        this.canciones = [];
        this.duracionTotal = 0;
    }

    static cargarDesdeStorage() {
        const playlists = JSON.parse(localStorage.getItem('playlists')) || [];
        console.log("Raw playlists from storage:", playlists);
        return playlists.map(pl => {
            const playlist = new Playlist(pl.nombre, pl.genero);
            playlist.canciones = pl.canciones.map(c => new Cancion(c.nombre, c.duracion));
            playlist.duracionTotal = pl.duracionTotal;
            return playlist;
        });
    }

    actualizarDOM() {
        const listaCanciones = document.querySelector(`#${this.nombre} .lista-canciones`);
        listaCanciones.innerHTML = '';
        this.canciones.forEach(cancion => {
            const li = document.createElement('li');
            li.textContent = `${cancion.nombre} - ${cancion.duracion} minutos`;
            listaCanciones.appendChild(li);
        });
        document.querySelector(`#${this.nombre} .playlist-duracion`).textContent = `Duración total: ${this.duracionTotal} minutos`;
    }
}

class Cancion {
    constructor(nombre, duracion) {
        this.nombre = nombre;
        this.duracion = Math.round(duracion);
    }
}

