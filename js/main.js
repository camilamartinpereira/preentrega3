document.addEventListener("DOMContentLoaded", () => {
    const simulador = new SimuladorPlaylists();
    const comenzarButton = document.getElementById("comenzarButton");
    const playlistFormContainer = document.getElementById("playlistFormContainer");
    const playlistForm = document.getElementById("playlistForm");
    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const step3 = document.getElementById("step3");
    const formName = document.getElementById("formName");
    const formGenre = document.getElementById("formGenre");
    const submitButton = document.getElementById("submitButton");
    const createAnotherButton = document.getElementById("createAnotherButton");
    const editPlaylistButton = document.getElementById("editPlaylistButton");
    const buscarButtonHeader = document.getElementById("buscarButtonHeader");
    const searchResultText = document.getElementById("searchResultText");
    const searchModal = document.getElementById("searchModal");
    const closeModalButton = document.getElementById("closeModalButton");
    const criterioBusquedaHeader = document.getElementById("criterioBusquedaHeader");
    const buscarTextoHeader = document.getElementById("buscarTextoHeader");
    const searchResultButtonsContainer = document.getElementById("searchResultButtonsContainer");

    comenzarButton.addEventListener("click", () => {
        playlistFormContainer.style.display = "block";
        comenzarButton.style.display = "none";
    });

    submitButton.addEventListener("click", (event) => {
        event.preventDefault();
        const playlistName = document.getElementById("playlistName").value;
        const playlistGenre = document.getElementById("playlistGenre").value;

        if (step1.style.display !== "none") {
            if (!playlistName) {
                alert("🚫 Por favor, ingrese un nombre para la playlist.");
                return;
            }
            step1.style.display = "none";
            step2.style.display = "block";
            formName.style.display = "none";
            formGenre.style.display = "block";
            submitButton.innerText = "Continuar";
        } else if (step2.style.display !== "none") {
            if (!playlistGenre) {
                alert("🚫 Por favor, ingrese el género para la playlist.");
                return;
            }
            simulador.crearPlaylist(playlistName, playlistGenre);
            playlistForm.reset();
            step2.style.display = "none";
            step3.style.display = "block";
            formName.style.display = "none";
            formGenre.style.display = "none";
            submitButton.style.display = "none";
        }
    });

    createAnotherButton.addEventListener("click", () => {
        playlistFormContainer.style.display = "block";
        step1.style.display = "block";
        step2.style.display = "none";
        step3.style.display = "none";
        formName.style.display =
        formName.style.display = "block";
        formGenre.style.display = "none";
        comenzarButton.style.display = "none";
        submitButton.style.display = "block";
        submitButton.innerText = "Continuar";
    });

    editPlaylistButton.addEventListener("click", () => {
        window.location.href = "pages/playlists.html";
    });

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
