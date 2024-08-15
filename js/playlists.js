document.addEventListener("DOMContentLoaded", () => {
    const simulador = new SimuladorPlaylists();
    const playlistList = document.getElementById("playlistList");
    const buscarButtonHeader = document.getElementById("buscarButtonHeader");
    const buscarTextoHeader = document.getElementById("buscarTextoHeader");
    const criterioBusquedaHeader = document.getElementById("criterioBusquedaHeader");
    const searchModal = document.getElementById('searchModal');
    const closeModalButton = document.getElementById('closeModalButton');
    const searchResultText = document.getElementById('searchResultText');
    const searchResultButtonsContainer = document.getElementById('searchResultButtonsContainer');

    function mostrarPlaylists() {
        if (!playlistList) {
            console.error("Elemento con ID 'playlistList' no encontrado.");
            return;
        }

        playlistList.innerHTML = "";
        simulador.playlists.forEach((playlist) => {
            const playlistItem = document.createElement("div");
            playlistItem.className = "bg-white p-4 rounded-lg shadow-lg flex justify-between items-center";
            playlistItem.dataset.name = playlist.nombre; // Añadido el nombre para referencia

            const playlistInfo = document.createElement("div");
            playlistInfo.innerHTML = 
                `<div class="text-xl font-bold">${playlist.nombre}</div>
                <div class="text-lg">Género: ${playlist.genero}</div>
                <div class="text-lg">Duración Total: ${playlist.duracionTotal} min</div>`;

            const buttonsContainer = document.createElement("div");
            buttonsContainer.className = "flex space-x-2";

            // Botón para agregar una canción
            const agregarCancionBtn = document.createElement("button");
            agregarCancionBtn.className = "bg-green-500 text-white font-semibold py-1 px-2 rounded shadow-md hover:bg-green-700";
            agregarCancionBtn.textContent = "Agregar Canción";
            agregarCancionBtn.addEventListener("click", () => {
                agregarCancion(playlist); // Llama a la función para agregar canción
            });

            const verCancionesBtn = document.createElement("button");
            verCancionesBtn.className = "bg-pastel-pink text-white font-semibold py-1 px-2 rounded shadow-md hover:bg-pastel-yellow";
            verCancionesBtn.textContent = "Ver Canciones";
            verCancionesBtn.addEventListener("click", () => {
                alert(`Canciones en ${playlist.nombre}:\n${playlist.canciones.map(c => `- ${c.nombre} (${c.duracion} min)`).join('\n')}`);
            });

            const eliminarPlaylistBtn = document.createElement("button");
            eliminarPlaylistBtn.className = "bg-red-500 text-white font-semibold py-1 px-2 rounded shadow-md hover:bg-red-700";
            eliminarPlaylistBtn.textContent = "Eliminar Playlist";
            eliminarPlaylistBtn.addEventListener("click", () => {
                if (confirm(`¿Estás seguro de que deseas eliminar la playlist "${playlist.nombre}"?`)) {
                    simulador.eliminarPlaylist(playlist.nombre);
                    mostrarPlaylists();
                }
            });

            buttonsContainer.appendChild(agregarCancionBtn);
            buttonsContainer.appendChild(verCancionesBtn);
            buttonsContainer.appendChild(eliminarPlaylistBtn);

            playlistItem.appendChild(playlistInfo);
            playlistItem.appendChild(buttonsContainer);
            playlistList.appendChild(playlistItem);
        });
    }

    mostrarPlaylists();

    buscarButtonHeader.addEventListener("click", () => {
        const criterio = criterioBusquedaHeader.value;
        const textoBusqueda = buscarTextoHeader.value.trim();

        if (textoBusqueda) {
            const resultados = simulador.buscarPlaylists(criterio, textoBusqueda);
            if (resultados.length > 0) {
                searchResultText.innerHTML = resultados.map(playlist => 
                    `<div>
                        <div><strong>Nombre:</strong> ${playlist.nombre}</div>
                        <div><strong>Género:</strong> ${playlist.genero}</div>
                        <button class="bg-pastel-pink text-white font-semibold py-1 px-2 rounded shadow-md hover:bg-pastel-yellow mb-2 verCancionesButton">Ver Canciones</button>
                    </div>`
                ).join("");
                searchResultButtonsContainer.innerHTML = '<button id="closeSearchModalButton" class="bg-red-500 text-white font-semibold py-2 px-4 rounded shadow-md hover:bg-red-700 w-full">Cerrar</button>';
                searchModal.style.display = "flex";

                document.querySelectorAll('.verCancionesButton').forEach((button, index) => {
                    button.addEventListener('click', () => {
                        alert(`Canciones en ${resultados[index].nombre}:\n${resultados[index].canciones.map(c => `- ${c.nombre} (${c.duracion} min)`).join('\n')}`);
                    });
                });

                document.getElementById('closeSearchModalButton').addEventListener('click', () => {
                    searchModal.style.display = "none";
                });
            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'No se encontraron playlists',
                    text: 'No se encontraron playlists con ese criterio.'
                });
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Buscar',
                text: 'Por favor, introduzca un texto para buscar.'
            });
        }
    });

    closeModalButton.addEventListener("click", () => {
        searchModal.style.display = 'none';
    });

    // Función agregarCancion
    function agregarCancion(playlist) {
        const popup = document.createElement('div');
        popup.className = 'fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50';
        popup.innerHTML =
            `<div class="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <div class="text-xl font-bold mb-4">Agregar Canción a ${playlist.nombre}</div>
                <input type="text" id="cancionNombre" class="border rounded-lg p-2 w-full mb-4" placeholder="¿Cuál es el nombre de la canción?">
                <input type="number" id="cancionDuracion" class="border rounded-lg p-2 w-full mb-4" placeholder="Duración (en minutos)">
                <button id="addCancionButton" class="bg-pastel-pink text-white font-semibold py-2 px-4 rounded shadow-md hover:bg-pastel-yellow">Agregar Canción</button>
                <button id="closeCancionPopupButton" class="text-red-500 font-bold focus:outline-none mt-2">Cancelar</button>
            </div>`;
        document.body.appendChild(popup);

        document.getElementById('addCancionButton').addEventListener('click', () => {
            const nombre = document.getElementById('cancionNombre').value.trim();
            const duracion = parseFloat(document.getElementById('cancionDuracion').value.trim());

            if (nombre === "" || isNaN(duracion)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Datos inválidos',
                    text: 'Por favor, asegúrate de que el nombre y la duración sean válidos.'
                });
            } else {
                playlist.agregarCancion(nombre, duracion);
                Swal.fire({
                    icon: 'success',
                    title: 'Canción agregada!',
                    text: `La canción "${nombre}" ha sido agregada con éxito.`
                });
                document.body.removeChild(popup);
                mostrarPlaylists(); // Actualiza la lista de playlists en la UI
            }
        });

        document.getElementById('closeCancionPopupButton').addEventListener('click', () => {
            document.body.removeChild(popup);
        });
    }
});
