
class SimuladorPlaylists {
    constructor() {
        this.playlists = this.cargarDesdeStorage();
    }

    crearPlaylist(nombre, genero) {
        if (nombre && genero) {
            const nuevaPlaylist = new Playlist(nombre, genero);
            this.playlists.push(nuevaPlaylist);
            this.guardarEnStorage();
            console.log("✅ Playlist agregada:", nuevaPlaylist);
        } else {
            alert("🚫 Por favor, ingrese información válida.");
        }
    }

    buscarPlaylists(criterio, texto) {
        return this.playlists.filter(pl => pl[criterio].toLowerCase().includes(texto.toLowerCase()));
    }

    guardarEnStorage() {
        localStorage.setItem('playlists', JSON.stringify(this.playlists));
    }

    cargarDesdeStorage() {
        const playlists = JSON.parse(localStorage.getItem('playlists')) || [];
        return playlists.map(pl => {
            const playlist = new Playlist(pl.nombre, pl.genero);
            playlist.canciones = pl.canciones.map(c => new Cancion(c.nombre, c.duracion));
            playlist.duracionTotal = pl.duracionTotal;
            return playlist;
        });
    }
}

class Playlist {
    constructor(nombre, genero) {
        this.nombre = nombre;
        this.genero = genero;
        this.canciones = [];
        this.duracionTotal = 0;
    }

    agregarCancion(nombre, duracion) {
        if (nombre && duracion && !isNaN(duracion)) {
            const nuevaCancion = new Cancion(nombre, duracion);
            this.canciones.push(nuevaCancion);
            this.duracionTotal += parseFloat(duracion);
        } else {
            alert("🚫 Información de la canción no válida.");
        }
    }

    eliminarCancion(nombre) {
        const index = this.canciones.findIndex(c => c.nombre === nombre);
        if (index !== -1) {
            this.duracionTotal -= this.canciones[index].duracion;
            this.canciones.splice(index, 1);
        } else {
            alert("🚫 Canción no encontrada.");
        }
    }
}

class Cancion {
    constructor(nombre, duracion) {
        this.nombre = nombre;
        this.duracion = parseFloat(duracion);
    }
}
