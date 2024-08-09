document.addEventListener("DOMContentLoaded", () => {
    const simulador = new SimuladorPlaylists();
    const comenzarButton = document.getElementById("comenzarButton");
    const playlistFormContainer = document.getElementById("playlistFormContainer");
    const playlistForm = document.getElementById("playlistForm");
    const successMessage = document.getElementById("successMessage");

    comenzarButton.addEventListener("click", () => {
        playlistFormContainer.style.display = "block";
        comenzarButton.style.display = "none";
    });

    playlistForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const playlistName = document.getElementById("playlistName").value.trim();
        const playlistMood = document.getElementById("playlistMood").value.trim();

        if (playlistName && playlistMood) {
            simulador.crearPlaylist(playlistName, playlistMood);
            playlistForm.reset();
            successMessage.style.display = "block";

            setTimeout(() => {
                successMessage.style.display = "none";
                playlistFormContainer.style.display = "none";
                comenzarButton.style.display = "block";
            }, 2000);
        } else {
            alert("🚫 Por favor, completa todos los campos antes de agregar una playlist.");
        }
    });

    // Funcionalidad de búsqueda
    const buscarButtonHeader = document.getElementById("buscarButtonHeader");
    buscarButtonHeader.addEventListener("click", () => {
        const criterio = document.getElementById("criterioBusquedaHeader").value;
        const texto = document.getElementById("buscarTextoHeader").value.trim();

        if (texto) {
            const resultado = simulador.buscarPlaylists(criterio, texto);

            if (resultado) {
                alert(`✅ Playlist encontrada: ${resultado.nombre} (${resultado.genero})`);
            } else {
                alert("🚫 No se encontró ninguna playlist con ese criterio.");
            }
        } else {
            alert("🚫 Por favor, ingresa un término de búsqueda.");
        }
    });
});
