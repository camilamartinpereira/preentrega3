document.addEventListener("DOMContentLoaded", () => {
    const simulador = new SimuladorPlaylists();
    const playlistList = document.getElementById("playlistList");

    function mostrarPlaylists() {
        if (!playlistList) {
            console.error("Elemento con ID 'playlistList' no encontrado.");
            return;
        }

        playlistList.innerHTML = "";
        simulador.playlists.forEach((playlist, index) => {
            const playlistItem = document.createElement("div");
            playlistItem.className = "bg-white p-4 rounded-lg shadow-lg flex justify-between items-center";

            const playlistInfo = document.createElement("div");
            playlistInfo.innerHTML = `
                <div class="text-xl font-bold">${playlist.nombre}</div>
                <div class="text-lg">Género: ${playlist.genero}</div>
                <div class="text-lg">Duración Total: ${playlist.duracionTotal} min</div>
            `;

            const buttonsContainer = document.createElement("div");
            buttonsContainer.className = "flex space-x-2";
            
            const agregarCancionBtn = document.createElement("button");
            agregarCancionBtn.className = "bg-pastel-pink text-white font-semibold py-1 px-2 rounded shadow-md hover:bg-pastel-yellow";
            agregarCancionBtn.innerText = "Agregar Canción";
            agregarCancionBtn.addEventListener("click", () => {
                Swal.fire({
                    title: 'Agregar Canción',
                    html: `
                        <input type="text" id="nombreCancion" class="swal2-input" placeholder="Nombre de la Canción">
                        <input type="number" id="duracionCancion" class="swal2-input" placeholder="Duración en minutos">
                    `,
                    showCancelButton: true,
                    confirmButtonText: 'Agregar',
                    cancelButtonText: 'Cancelar',
                    preConfirm: () => {
                        const nombre = Swal.getPopup().querySelector('#nombreCancion').value;
                        const duracion = Swal.getPopup().querySelector('#duracionCancion').value;
                        if (!nombre || !duracion) {
                            Swal.showValidationMessage('Por favor ingrese nombre y duración');
                        }
                        return { nombre, duracion };
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        playlist.agregarCancion(result.value.nombre, result.value.duracion);
                        simulador.guardarEnStorage();
                        mostrarPlaylists();
                    }
                });
            });

            const eliminarPlaylistBtn = document.createElement("button");
            eliminarPlaylistBtn.className = "bg-red-500 text-white font-semibold py-1 px-2 rounded shadow-md hover:bg-red-700";
            eliminarPlaylistBtn.innerText = "Eliminar Playlist";
            eliminarPlaylistBtn.addEventListener("click", () => {
                Swal.fire({
                    title: '¿Está seguro?',
                    text: "Esta acción eliminará la playlist y no se podrá deshacer.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        simulador.eliminarPlaylist(playlist.nombre);
                        simulador.guardarEnStorage();
                        mostrarPlaylists();
                        Swal.fire('Eliminado', 'La playlist ha sido eliminada.', 'success');
                    }
                });
            });

            buttonsContainer.appendChild(agregarCancionBtn);
            buttonsContainer.appendChild(eliminarPlaylistBtn);
            playlistItem.appendChild(playlistInfo);
            playlistItem.appendChild(buttonsContainer);
            playlistList.appendChild(playlistItem);
        });
    }

    mostrarPlaylists();
});
