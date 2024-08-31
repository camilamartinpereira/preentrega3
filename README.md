
# Bo! Escuchate Esto

Este proyecto es la entrega final para el curso de JavaScript en Coderhouse. "Bo! Escuchate Esto" es una plataforma interactiva que permite a los usuarios crear, gestionar y recibir recomendaciones de playlists musicales. Está construido con una arquitectura moderna que incluye el uso de JavaScript avanzado, integración con la API de Spotify, y un enfoque en la experiencia del usuario mediante Tailwind CSS, SweetAlert2, y Tippy.js.
Las credenciales para ingresar se encuentran en data/credentials.json (solo funcionan desde OpenServer, no desde Github Pages debido a que se mantiene la sesion)

## Descripción del Proyecto

"Bo! Escuchate Esto" es un sitio web donde los usuarios pueden:

- **Crear Playlists Personalizadas:** A través de un proceso guiado, los usuarios pueden nombrar sus playlists, seleccionar un género y agregar canciones manualmente o a través de recomendaciones automáticas de Spotify.
- **Gestionar Playlists:** Los usuarios pueden editar, eliminar y visualizar las canciones dentro de cada playlist que han creado.
- **Recibir Recomendaciones:** Basado en el género seleccionado, el sistema sugiere playlists de Spotify, que pueden ser agregadas directamente a la colección del usuario.
- **Autenticarse en la Plataforma:** La autenticación se realiza mediante un popup que valida las credenciales almacenadas en un archivo JSON, ofreciendo una experiencia fluida y segura.

## Tecnologías Utilizadas

- **JavaScript:** Uso de sintaxis avanzada y manejo de promesas con `fetch` para interactuar con APIs externas y manejar datos locales.
- **Tailwind CSS:** Para un diseño moderno y responsivo con una paleta de colores pastel.
- **SweetAlert2:** Para implementar notificaciones interactivas y mensajes de alerta estilizados.
- **Tippy.js:** Para mejorar la usabilidad con tooltips personalizados y otras interacciones visuales.
- **Spotify API:** Integración para obtener datos de playlists y canciones recomendadas, y para crear playlists en Spotify directamente desde la aplicación.

## Requisitos del Proyecto

- **Autenticación:** Sistema de login que utiliza un archivo JSON con las credenciales del usuario.
- **Manejo de Datos:** Creación, almacenamiento y manipulación de playlists utilizando objetos, arrays, local storage y JSON.
- **Interacción con APIs:** Uso de `fetch` para obtener y manejar datos de la API de Spotify.
- **Interfaz de Usuario Dinámica:** Uso de DOM, eventos y efectos visuales avanzados para una experiencia de usuario mejorada.
- **Diseño Responsivo:** Adaptación del sitio para ser visualizado correctamente en diferentes dispositivos y resoluciones.

## Instalación

1. **Clonar el Repositorio:**
   ```bash
   git clone https://github.com/camilamartinpereira/preentrega3.git
   cd preentrega3
   ```

2. **Instalar Dependencias:**
   ```bash
   npm install
   ```

3. **Configurar la API de Spotify:**
   - Crear una cuenta en [Spotify for Developers](https://developer.spotify.com/).
   - Crear una aplicación y obtener el Client ID y Client Secret.
   - Configurar la URI de redirección en `http://127.0.0.1:5500`.
   - Colocar las credenciales en el archivo `data/credentials.json`.

4. **Iniciar el Proyecto:**
   - Abre el archivo `index.html` en un navegador web.

## Uso

- **Crear una Nueva Playlist:** Sigue los pasos guiados desde la página principal para agregar una nueva playlist a tu colección.
- **Gestionar Playlists:** Accede a la página `playlists.html` para editar, visualizar o eliminar playlists.
- **Recomendaciones de Playlists:** Selecciona un género y obtén playlists recomendadas directamente desde Spotify.

## Estructura del Proyecto

El proyecto sigue la siguiente estructura de carpetas y archivos:

```
├── data
│   └── credentials.json
├── js
│   ├── main.js
│   └── playlists.js
├── pages
│   └── playlists.html
├── src
│   ├── input.css
│   └── output.css
├── index.html
├── package-lock.json
├── package.json
└── tailwind.config.js
```