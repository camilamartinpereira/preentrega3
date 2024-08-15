document.addEventListener('DOMContentLoaded', function () {
    const searchButtons = document.querySelectorAll('#buscarButtonHeader');
    const searchModal = document.getElementById('searchModal');
    const closeModalButton = document.getElementById('closeModalButton');
    const searchResultText = document.getElementById('searchResultText');
    const searchResultButtonsContainer = document.getElementById('searchResultButtonsContainer');

    searchButtons.forEach(button => {
        button.addEventListener('click', () => {
            const criterio = document.getElementById('criterioBusquedaHeader').value;
            const texto = document.getElementById('buscarTextoHeader').value.toLowerCase();
            const playlists = JSON.parse(localStorage.getItem('playlists')) || [];

            const result = playlists.find(playlist => {
                if (criterio === 'nombre') {
                    return playlist.name.toLowerCase().includes(texto);
                } else if (criterio === 'genero') {
                    return playlist.genre.toLowerCase().includes(texto);
                }
            });

            if (result) {
                searchResultText.textContent = `Playlist encontrada: ${result.name} (${result.genre})`;
                searchResultButtonsContainer.innerHTML = `
                    <button class="bg-pastel-pink text-white font-semibold py-2 px-4 rounded shadow-md hover:bg-pastel-yellow" onclick="viewPlaylist('${result.name}')">Ver Playlist</button>
                    <button class="bg-red-500 text-white font-semibold py-2 px-4 rounded shadow-md hover:bg-red-700" onclick="deletePlaylist('${result.name}')">Eliminar Playlist</button>
                `;
            } else {
                searchResultText.textContent = 'No se encontró ninguna playlist con ese criterio.';
            }

            searchModal.classList.remove('hidden');
        });
    });

    closeModalButton.addEventListener('click', () => {
        searchModal.classList.add('hidden');
    });
});

function viewPlaylist(name) {
    window.location.href = `playlists.html?name=${encodeURIComponent(name)}`;
}

function deletePlaylist(name) {
    let playlists = JSON.parse(localStorage.getItem('playlists')) || [];
    playlists = playlists.filter(playlist => playlist.name !== name);
    localStorage.setItem('playlists', JSON.stringify(playlists));
    location.reload();
}
