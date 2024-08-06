class Cancion {
    constructor(nombre, duracion) {
        this.nombre = nombre;
        this.duracion = Math.round(duracion); // Duración en minutos, redondeada
    }

    pluralizarMinutos() {
        return this.duracion === 1 ? this.duracion + " minuto" : this.duracion + " minutos";
    }
}

class Playlist {
    constructor(nombre, estadoAnimo) {
        this.nombre = nombre;
        this.estadoAnimo = estadoAnimo;
        this.canciones = [];
        this.duracionTotal = 0;
    }

    agregarCancion(nombreCancion, duracionCancion) {
        if (nombreCancion && !isNaN(duracionCancion)) {
            const nuevaCancion = new Cancion(nombreCancion, duracionCancion);
            this.canciones.push(nuevaCancion);
            this.duracionTotal += duracionCancion;
            alert("🎶 Canción agregada con éxito.");
        } else {
            alert("🚫 Por favor, ingrese información válida.");
        }
    }

    eliminarCancion(index) {
        if (this.canciones.length > 0 && index >= 0 && index < this.canciones.length) {
            const cancionEliminada = this.canciones.splice(index, 1)[0];
            this.duracionTotal -= cancionEliminada.duracion;
            alert("🎵 Canción eliminada con éxito: " + cancionEliminada.nombre);
        } else {
            alert("🔊 No hay canciones en la playlist " + this.nombre + " para eliminar.");
        }
    }

    verCanciones() {
        if (this.canciones.length > 0) {
            const listaCanciones = this.canciones.map(cancion => cancion.nombre + ": " + cancion.pluralizarMinutos()).join("\n");
            alert("🎵 Canciones en la playlist " + this.nombre + ":\n" + listaCanciones);
        } else {
            alert("🔊 No hay canciones en la playlist " + this.nombre);
        }
    }
}

class SimuladorPlaylists {
    constructor(nombreUsuario, cantidadPlaylists) {
        this.nombreUsuario = nombreUsuario;
        this.playlists = [];

        for (let i = 0; i < cantidadPlaylists; i++) {
            const nombrePlaylist = prompt("Ingrese el nombre de la playlist " + (i + 1) + ":");
            let estadoAnimo;
            do {
                estadoAnimo = prompt("Para poder darte recomendaciones luego te pedimos que le vincules un estado de ánimo \nEjemplo: Felicidad, Tristeza, Melancolía, Festejo\npara tu playlist " + nombrePlaylist + ":");
            } while (/^\d+$/.test(estadoAnimo) || estadoAnimo.trim() === "");

            this.playlists.push(new Playlist(nombrePlaylist, estadoAnimo));
        }

        this.preguntarEditarPlaylists();
    }

    preguntarEditarPlaylists() {
        const editarAhora = prompt("🛠️ ¿Deseas editar las playlists ahora? (sí/no)").toLowerCase();
        if (editarAhora === 'sí' || editarAhora === 'si') {
            this.editarPlaylists();
        } else {
            this.mostrarMenuPrincipal();
        }
    }

    editarPlaylists() {
        let index = 0;
        const totalPlaylists = this.playlists.length;
        const editarPlaylist = () => {
            if (index < totalPlaylists) {
                const playlist = this.playlists[index];
                alert("🎉 Arranquemos con la playlist: " + playlist.nombre);

                let opcionMenu;
                do {
                    opcionMenu = prompt("🌟 Menú de Playlist: " + playlist.nombre + " 🌟\n\n" +
                        "Duración total: " + playlist.duracionTotal + " minutos\n" +
                        "Estado de ánimo: " + playlist.estadoAnimo + "\n\n" +
                        "1️⃣ Agregar canción\n" +
                        "2️⃣ Quitar canción\n" +
                        "3️⃣ Ver lista de canciones\n" +
                        (index < totalPlaylists - 1 ? "4️⃣ Ir a siguiente playlist" : "4️⃣ Volver al menú principal") +
                        "\n\n0️⃣ Volver al menú principal");

                    switch (opcionMenu) {
                        case "1":
                            this.agregarCancion(index);
                            break;
                        case "2":
                            this.eliminarCancion(index);
                            break;
                        case "3":
                            this.playlists[index].verCanciones();
                            break;
                        case "4":
                            if (index < totalPlaylists - 1) {
                                index++;
                                editarPlaylist();
                            } else {
                                this.mostrarMenuPrincipal();
                            }
                            return;
                        case "0":
                            this.mostrarMenuPrincipal();
                            return;
                        default:
                            alert("🚫 Opción no válida. Por favor, selecciona una opción válida.");
                    }
                } while (opcionMenu !== "4" && opcionMenu !== "0");
            }
        };

        editarPlaylist();
    }

    agregarCancion(index) {
        const nombreCancion = prompt("Ingrese el nombre de la canción:");
        let duracionCancion;
        do {
            duracionCancion = prompt("Ingrese la duración de la canción (en minutos):");
        } while (isNaN(duracionCancion) || duracionCancion.trim() === "");

        duracionCancion = parseInt(duracionCancion);

        this.playlists[index].agregarCancion(nombreCancion, duracionCancion);
    }

    eliminarCancion(index) {
        const playlist = this.playlists[index];
        if (playlist.canciones.length > 0) {
            const listaCanciones = playlist.canciones.map((cancion, index) => (index + 1) + ". " + cancion.nombre + ": " + cancion.pluralizarMinutos()).join("\n");
            let numeroCancion;

            do {
                numeroCancion = prompt("Canciones en la playlist " + playlist.nombre + ":\n" + listaCanciones + "\n\nIngrese el número de la canción que desea eliminar (o 0 para volver):");
                if (numeroCancion === "0") return; // Volver al menú anterior
            } while (isNaN(numeroCancion) || numeroCancion < 1 || numeroCancion > playlist.canciones.length);

            numeroCancion = parseInt(numeroCancion);

            playlist.eliminarCancion(numeroCancion - 1);
        } else {
            alert("🔊 No hay canciones en la playlist " + playlist.nombre + " para eliminar.");
        }
    }

    mostrarMenuPrincipal() {
        let opcionMenu;
        do {
            opcionMenu = prompt("¡Hola " + this.nombreUsuario + "! 🌟 Menú Principal 🌟\n\n" +
                this.playlists.map((playlist, index) => (index + 1) + "️⃣ " + playlist.nombre).join("\n") +
                "\n\nElige una opción del 1 al " + this.playlists.length + " para gestionar una playlist, " + 
                (this.playlists.length + 1) + " para buscar playlists, " + 
                (this.playlists.length + 2) + " para agregar una nueva playlist o " + 
                (this.playlists.length + 3) + " para salir.");

            const opcionNum = parseInt(opcionMenu);
            if (opcionNum > 0 && opcionNum <= this.playlists.length) {
                this.mostrarMenuPlaylist(opcionNum - 1);
            } else if (opcionNum === this.playlists.length + 1) {
                this.buscarPlaylists();
            } else if (opcionNum === this.playlists.length + 2) {
                this.agregarNuevaPlaylist();
            } else if (opcionNum === this.playlists.length + 3) {
                alert("Gracias por usar el simulador de playlists musicales. ¡Hasta luego!");
            } else {
                alert("🚫 Opción no válida. Por favor, selecciona una opción válida.");
            }
        } while (opcionMenu !== (this.playlists.length + 3).toString());
    }

    mostrarMenuPlaylist(index) {
        let opcionMenu;
        const playlist = this.playlists[index];
        do {
            opcionMenu = prompt("🌟 Menú de Playlist: " + playlist.nombre + " 🌟\n\n" +
                "Duración total: " + playlist.duracionTotal + " minutos\n" +
                "Estado de ánimo: " + playlist.estadoAnimo + "\n\n" +
                "1️⃣ Agregar canción\n" +
                "2️⃣ Quitar canción\n" +
                "3️⃣ Ver lista de canciones\n" +
                "4️⃣ Volver al menú principal");

            switch (opcionMenu) {
                case "1":
                    this.agregarCancion(index);
                    break;
                case "2":
                    this.eliminarCancion(index);
                    break;
                case "3":
                    playlist.verCanciones();
                    break;
                case "4":
                    return;
                default:
                    alert("🚫 Opción no válida. Por favor, selecciona una opción válida.");
            }
        } while (opcionMenu !== "4");
    }

    buscarPlaylists() {
        let opcionMenu;
        do {
            opcionMenu = prompt("🔍 Buscar Playlists 🔍\n\n" +
                "1️⃣ Buscar por estado de ánimo\n" +
                "2️⃣ Buscar por duración\n" +
                "3️⃣ Volver al menú principal");

            switch (opcionMenu) {
                case "1":
                    this.buscarPorEstadoAnimo();
                    break;
                case "2":
                    this.buscarPorDuracion();
                    break;
                case "3":
                    return;
                default:
                    alert("🚫 Opción no válida. Por favor, selecciona una opción válida.");
            }
        } while (opcionMenu !== "3");
    }

    buscarPorEstadoAnimo() {
        const estadoAnimo = prompt("Ingrese el estado de ánimo para buscar playlists:");
        const playlistsEncontradas = this.playlists.filter(playlist => playlist.estadoAnimo.toLowerCase() === estadoAnimo.toLowerCase());

        if (playlistsEncontradas.length > 0) {
            const listaPlaylists = playlistsEncontradas.map(playlist => playlist.nombre + " (" + playlist.duracionTotal + " minutos)").join("\n");
            alert("🔍 Playlists encontradas:\n" + listaPlaylists);
        } else {
            alert("🚫 No se encontraron playlists con el estado de ánimo: " + estadoAnimo);
        }
    }

    buscarPorDuracion() {
        const duracionMinima = parseInt(prompt("Ingrese la duración mínima en minutos:"));
        const duracionMaxima = parseInt(prompt("Ingrese la duración máxima en minutos:"));

        const playlistsEncontradas = this.playlists.filter(playlist => playlist.duracionTotal >= duracionMinima && playlist.duracionTotal <= duracionMaxima);

        if (playlistsEncontradas.length > 0) {
            const listaPlaylists = playlistsEncontradas.map(playlist => playlist.nombre + " (" + playlist.duracionTotal + " minutos)").join("\n");
            alert("🔍 Playlists encontradas:\n" + listaPlaylists);
        } else {
            alert("🚫 No se encontraron playlists en el rango de duración: " + duracionMinima + " - " + duracionMaxima + " minutos.");
        }
    }

    agregarNuevaPlaylist() {
        const nombrePlaylist = prompt("Ingrese el nombre de la nueva playlist:");
        let estadoAnimo;
        do {
            estadoAnimo = prompt("Para poder darte recomendaciones luego te pedimos que le vincules un estado de ánimo \nEjemplo: Felicidad, Tristeza, Melancolía, Festejo\npara tu nueva playlist " + nombrePlaylist + ":");
        } while (/^\d+$/.test(estadoAnimo) || estadoAnimo.trim() === "");

        this.playlists.push(new Playlist(nombrePlaylist, estadoAnimo));
        alert("✅ Playlist agregada con éxito.");
    }
}

document.getElementById("startButton").addEventListener("click", () => {
    let nombreUsuario;
    do {
        nombreUsuario = prompt("Bienvenido al simulador de playlists musicales 🎵\nPor favor, ingresa tu nombre:");
    } while (!nombreUsuario || !isNaN(nombreUsuario));

    let cantidadPlaylists;
    do {
        cantidadPlaylists = prompt("¿Cuántas playlists deseas crear?");
        cantidadPlaylists = parseInt(cantidadPlaylists);
        if (isNaN(cantidadPlaylists) || cantidadPlaylists <= 0) {
            alert("🚫 Por favor, ingrese un número válido.");
        }
    } while (isNaN(cantidadPlaylists) || cantidadPlaylists <= 0);

    new SimuladorPlaylists(nombreUsuario, cantidadPlaylists);
});
