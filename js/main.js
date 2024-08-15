document.addEventListener("DOMContentLoaded", () => {
    const mainContent = document.getElementById('mainContent');
    const playlistFormContainer = document.getElementById('playlistFormContainer');
    const comenzarButton = document.getElementById('comenzarButton');
    const playlistForm = document.getElementById('playlistForm');
    const playlistNameInput = document.getElementById('playlistName');
    const playlistGenreInput = document.getElementById('playlistGenre');
    const submitButton = document.getElementById('submitButton');
    const searchModal = document.getElementById('searchModal');
    const closeModalButton = document.getElementById('closeModalButton');
    const searchResultText = document.getElementById('searchResultText');
    const searchResultButtonsContainer = document.getElementById('searchResultButtonsContainer');
    const createAnotherButton = document.getElementById('createAnotherButton');
    const editPlaylistButton = document.getElementById('editPlaylistButton');
    const buscarButtonHeader = document.getElementById("buscarButtonHeader");

    const simulador = new SimuladorPlaylists();

    async function showCredentialsPopup() {
        try {
            const response = await fetch('data/credentials.json');
            if (!response.ok) {
                throw new Error('Error en la carga del archivo');
            }
            const credentials = await response.json();

            const popup = document.createElement('div');
            popup.className = 'fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50';
            popup.innerHTML =
                `<div class="bg-white p-6 rounded-lg shadow-lg w-1/2">
                    <div class="text-xl font-bold mb-4">Ingrese sus credenciales</div>
                    <input type="text" id="usernameInput" class="border rounded-lg p-2 w-full mb-4" placeholder="Usuario">
                    <input type="password" id="passwordInput" class="border rounded-lg p-2 w-full mb-4" placeholder="Contraseña">
                    <button id="validateCredentialsButton" class="bg-pastel-pink text-white font-semibold py-2 px-4 rounded shadow-md hover:bg-pastel-yellow">Validar</button>
                    <button id="closePopupButton" class="text-red-500 font-bold focus:outline-none mt-2">Cancelar</button>
                </div>`;
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
                    Swal.fire({
                        icon: 'error',
                        title: 'Credenciales incorrectas!',
                        text: 'Intente nuevamente.'
                    });
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
                Swal.fire({
                    icon: 'error',
                    title: 'Por favor',
                    text: 'Ingresa un nombre para la playlist.'
                });
                return;
            }
            currentStep++;
        } else if (currentStep === 2) {
            if (playlistGenreInput.value.trim() === "") {
                Swal.fire({
                    icon: 'error',
                    title: 'Por favor',
                    text: 'Ingresa un género para la playlist.'
                });
                return;
            }
            simulador.crearPlaylist(playlistNameInput.value.trim(), playlistGenreInput.value.trim());
            Swal.fire({
                icon: 'success',
                title: 'Playlist creada!',
                text: `La playlist "${playlistNameInput.value}" ha sido creada exitosamente!`
            });
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
        window.location.href = "pages/playlists.html"; // Cambiado para redirigir a la página de playlists
    });

    function updateFormSteps() {
        document.getElementById('step1').style.display = currentStep === 1 ? 'block' : 'none';
        document.getElementById('step2').style.display = currentStep === 2 ? 'block' : 'none';
        document.getElementById('step3').style.display = currentStep === 3 ? 'block' : 'none';
        document.getElementById('formName').style.display = currentStep === 1 ? 'block' : 'none';
        document.getElementById('formGenre').style.display = currentStep === 2 ? 'block' : 'none';
        submitButton.style.display = currentStep < 3 ? 'block' : 'none';
    }

    function resetForm() {
        playlistNameInput.value = '';
        playlistGenreInput.value = '';
    }

    buscarButtonHeader.addEventListener("click", () => {
        const criterio = document.getElementById("criterioBusquedaHeader").value;
        const textoBusqueda = document.getElementById("buscarTextoHeader").value.trim();

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
    
    // Definición de la función agregarCancion aquí
    window.agregarCancion = function(playlist) {
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
    };
});
