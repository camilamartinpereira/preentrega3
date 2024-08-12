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
            Swal.fire('Éxito', 'Canción agregada exitosamente', 'success');
        } else {
            Swal.fire('Error', 'Información de la canción no válida.', 'error');
        }
    }

    eliminarCancion(nombre) {
        const index = this.canciones.findIndex(c => c.nombre === nombre);
        if (index !== -1) {
            this.duracionTotal -= this.canciones[index].duracion;
            this.canciones.splice(index, 1);
            Swal.fire('Éxito', 'Canción eliminada', 'success');
        } else {
            Swal.fire('Error', 'Canción no encontrada.', 'error');
        }
    }
}

class Cancion {
    constructor(nombre, duracion) {
        this.nombre = nombre;
        this.duracion = parseFloat(duracion);
    }
}

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
            Swal.fire('Éxito', 'Playlist agregada exitosamente', 'success');
        } else {
            Swal.fire('Error', 'Por favor, ingrese información válida.', 'error');
        }
    }

    buscarPlaylists(criterio, valor) {
        if (!valor) return [];
        return this.playlists.filter(playlist => {
            return playlist[criterio].toLowerCase().includes(valor.toLowerCase());
        });
    }

    eliminarPlaylist(nombre) {
        const index = this.playlists.findIndex(p => p.nombre === nombre);
        if (index !== -1) {
            this.playlists.splice(index, 1);
            this.guardarEnStorage();
            Swal.fire('Éxito', 'Playlist eliminada', 'success');
        } else {
            Swal.fire('Error', 'Playlist no encontrada.', 'error');
        }
    }

    guardarEnStorage() {
        localStorage.setItem("playlists", JSON.stringify(this.playlists));
    }

    cargarDesdeStorage() {
        const data = localStorage.getItem("playlists");
        return data ? JSON.parse(data) : [];
    }
}
