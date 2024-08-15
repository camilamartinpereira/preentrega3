document.addEventListener("DOMContentLoaded", () => {
    const mainContent = document.getElementById('mainContent');
    const playlistFormContainer = document.getElementById('playlistFormContainer');
    const comenzarButton = document.getElementById('comenzarButton');
    const playlistForm = document.getElementById('playlistForm');
    const playlistNameInput = document.getElementById('playlistName');
    const playlistGenreInput = document.getElementById('playlistGenre');
    const submitButton = document.getElementById('submitButton');
    const searchDropdown = document.getElementById('searchDropdown');
    const searchModal = document.getElementById('searchModal');
    const closeModalButton = document.getElementById('closeModalButton');
    const searchResultText = document.getElementById('searchResultText');
    const searchResultButtonsContainer = document.getElementById('searchResultButtonsContainer');
    const viewPlaylistButton = document.getElementById('viewPlaylistButton');
    const createAnotherButton = document.getElementById('createAnotherButton');
    const editPlaylistButton = document.getElementById('editPlaylistButton');

    const playlists = [];

    async function showCredentialsPopup() {
        try {
            const response = await fetch('data/credentials.json');
            if (!response.ok) {
                throw new Error('Error en la carga del archivo');
            }
            const credentials = await response.json();

            const popup = document.createElement('div');
            popup.className = 'fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50';
            popup.innerHTML = `
                <div class="bg-white p-6 rounded-lg shadow-lg w-1/2">
                    <div class="text-xl font-bold mb-4">Ingrese sus credenciales</div>
                    <input type="text" id="usernameInput" class="border rounded-lg p-2 w-full mb-4" placeholder="Usuario">
                    <input type="password" id="passwordInput" class="border rounded-lg p-2 w-full mb-4" placeholder="Contraseña">
                    <button id="validateCredentialsButton" class="bg-pastel-pink text-white font-semibold py-2 px-4 rounded shadow-md hover:bg-pastel-yellow">Validar</button>
                    <button id="closePopupButton" class="text-red-500 font-bold focus:outline-none mt-2">Cancelar</button>
                </div>
            `;
            document.body.appendChild(popup);

            document.getElementById('validateCredentialsButton').addEventListener('click', () => {
                const usernameInput = document.getElementById('usernameInput').value;
                const passwordInput = document.getElementById('passwordInput').value;

                const validUser = credentials.users.find(user => 
                    user.username === usernameInput && user.password === passwordInput
                );

                if (validUser) {
                    document.body.removeChild(popup);
                    mainContent.style.display = "block";
                } else {
                    alert("🚫 Credenciales incorrectas. Intente nuevamente.");
                }
            });

            document.getElementById('closePopupButton').addEventListener('click', () => {
                document.body.removeChild(popup);
            });
        } catch (error) {
            console.error('Error al cargar las credenciales:', error);
        }
    }

    // Mostrar el popup al cargar la página
    showCredentialsPopup();

    // Lógica para crear playlists
    let currentStep = 1;

    comenzarButton.addEventListener('click', () => {
        playlistFormContainer.style.display = 'block';
        updateFormSteps();
    });

    playlistForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (currentStep === 1) {
            if (playlistNameInput.value.trim() === "") {
                alert("Por favor, ingresa un nombre para la playlist.");
                return;
            }
            currentStep++;
        } else if (currentStep === 2) {
            if (playlistGenreInput.value.trim() === "") {
                alert("Por favor, ingresa un género para la playlist.");
                return;
            }
            const newPlaylist = {
                name: playlistNameInput.value.trim(),
                genre: playlistGenreInput.value.trim(),
                songs: []
            };
            playlists.push(newPlaylist);
            alert(`¡Playlist "${newPlaylist.name}" creada exitosamente!`);
            currentStep++;
        }

        updateFormSteps();
    });

    createAnotherButton.addEventListener('click', () => {
        resetForm();
        currentStep = 1;
        updateFormSteps();
    });

    editPlaylistButton.addEventListener('click', () => {
        alert("Funcionalidad de edición pendiente de implementación.");
    });

    function updateFormSteps() {
        document.getElementById('step1').style.display = currentStep === 1 ? 'block' : 'none';
        document.getElementById('step2').style.display = currentStep === 2 ? 'block' : 'none';
        document.getElementById('step3').style.display = currentStep === 3 ? 'block' : 'none';
        document.getElementById('formName').style.display = currentStep === 1 ? 'block' : 'none';
        document.getElementById('formGenre').style.display = currentStep === 2 ? 'block' : 'none';
        submitButton.style.display = currentStep < 3 ? 'block' : 'none';
        searchDropdown.style.display = currentStep === 3 ? 'block' : 'none';
    }

    function resetForm() {
        playlistNameInput.value = '';
        playlistGenreInput.value = '';
    }

    viewPlaylistButton.addEventListener('click', () => {
        const playlistName = playlistNameInput.value.trim();
        const playlist = playlists.find(pl => pl.name === playlistName);

        if (playlist) {
            searchResultText.textContent = `Nombre: ${playlist.name} | Género: ${playlist.genre}`;
        } else {
            searchResultText.textContent = "Playlist no encontrada.";
        }

        searchModal.style.display = 'block';
    });

    closeModalButton.addEventListener('click', () => {
        searchModal.style.display = 'none';
    });
});
