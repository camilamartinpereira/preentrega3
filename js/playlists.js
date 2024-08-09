document.addEventListener("DOMContentLoaded", () => {
    const simulador = new SimuladorPlaylists();
    const playlistList = document.getElementById("playlistList");

    function mostrarPlaylists() {
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
                playlist.agregarCancion(nombreCancion, duracionCancion);
                simulador.guardarEnStorage();
                mostrarPlaylists();
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
                simulador.playlists.splice(index, 1);
                simulador.guardarEnStorage();
                mostrarPlaylists();
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
});
