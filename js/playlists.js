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
            agregarCancionBtn.textContent = "Agregar Canción";
            agregarCancionBtn.addEventListener("click", () => {
                const nombreCancion = prompt("Ingrese el nombre de la canción:");
                const duracionCancion = prompt("Ingrese la duración de la canción (en minutos):");
                if (nombreCancion && !isNaN(duracionCancion)) {
                    playlist.agregarCancion(nombreCancion, duracionCancion);
                    simulador.guardarEnStorage();
                    mostrarPlaylists();
                } else {
                    alert("Por favor, ingrese un nombre válido y una duración numérica para la canción.");
                }
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
                    simulador.playlists.splice(index, 1);
                    simulador.guardarEnStorage();
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
                searchResultText.innerHTML = resultados.map(playlist => `
                    <div>
                        <div><strong>Nombre:</strong> ${playlist.nombre}</div>
                        <div><strong>Género:</strong> ${playlist.genero}</div>
                        <button class="bg-pastel-pink text-white font-semibold py-1 px-2 rounded shadow-md hover:bg-pastel-yellow mb-2 verCancionesButton">Ver Canciones</button>
                    </div>
                `).join("");
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
                alert("No se encontraron playlists con ese criterio.");
            }
        } else {
            alert("Por favor, introduzca un texto para buscar.");
        }
    });

    closeModalButton.addEventListener("click", () => {
        searchModal.style.display = "none";
    });
});