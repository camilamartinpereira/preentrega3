document.addEventListener("DOMContentLoaded", () => {
    const simulador = new SimuladorPlaylists();
    const comenzarButton = document.getElementById("comenzarButton");
    const buscarButtonHeader = document.getElementById("buscarButtonHeader");
    const searchModal = document.getElementById("searchModal");
    const criterioBusquedaHeader = document.getElementById("criterioBusquedaHeader");
    const buscarTextoHeader = document.getElementById("buscarTextoHeader");
    const searchResultText = document.getElementById("searchResultText");
    const searchResultButtonsContainer = document.getElementById("searchResultButtonsContainer");
    const closeModalButton = document.getElementById("closeModalButton");

    comenzarButton.addEventListener("click", () => {
        crearPlaylist();
    });

    async function crearPlaylist() {
        const { value: nombre } = await Swal.fire({
            title: 'Crear Playlist',
            input: 'text',
            inputLabel: 'Nombre de la Playlist',
            inputPlaceholder: 'Ingrese el nombre de la playlist',
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return 'Por favor ingrese un nombre!';
                }
            }
        });

        if (nombre) {
            const { value: genero } = await Swal.fire({
                title: 'Seleccionar Género',
                input: 'select',
                inputOptions: {
                    pop: 'Pop',
                    rock: 'Rock',
                    jazz: 'Jazz',
                    classical: 'Clásica',
                    other: 'Otro'
                },
                inputPlaceholder: 'Seleccione un género',
                showCancelButton: true,
                inputValidator: (value) => {
                    if (!value) {
                        return 'Por favor seleccione un género!';
                    }
                }
            });

            if (genero) {
                simulador.crearPlaylist(nombre, genero);
                await Swal.fire({
                    title: 'Playlist Creada',
                    text: 'La playlist ha sido creada exitosamente.',
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonText: 'Crear Otra',
                    cancelButtonText: 'Editar Playlist',
                    cancelButtonColor: '#3085d6',
                    confirmButtonColor: '#3085d6'
                }).then((result) => {
                    if (result.isConfirmed) {
                        crearPlaylist();
                    } else {
                        window.location.href = "pages/playlists.html";
                    }
                });
            }
        }
    }

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
                        const canciones = resultados[index].canciones.map(c => `- ${c.nombre} (${c.duracion} min)`).join('\n');
                        Swal.fire('Canciones', `Canciones en ${resultados[index].nombre}:\n${canciones}`, 'info');
                    });
                });

                document.getElementById('closeSearchModalButton').addEventListener('click', () => {
                    searchModal.style.display = "none";
                });
            } else {
                Swal.fire('Sin resultados', 'No se encontraron playlists con ese criterio.', 'info');
            }
        } else {
            Swal.fire('Error', 'Por favor, introduzca un texto para buscar.', 'error');
        }
    });

    closeModalButton.addEventListener("click", () => {
        searchModal.style.display = "none";
    });
});

