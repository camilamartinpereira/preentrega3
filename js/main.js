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
        formName.style.display = "block";
        formGenre.style.display = "none";
        comenzarButton.style.display = "none";
        submitButton.style.display = "block";
        submitButton.innerText = "Continuar";
    });

    editPlaylistButton.addEventListener("click", () => {
        window.location.href = "pages/playlists.html";
    });
});
