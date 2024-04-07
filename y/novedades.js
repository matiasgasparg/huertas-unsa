// Función para obtener y mostrar las noticias desde el servidor
function getNoticiasFromServer() {
    // Realizar una solicitud GET al servidor para obtener todos los datos de las noticias
    fetch('http://127.0.0.1:5000/noticia/')
        .then(response => {
            // Verificar si la respuesta del servidor es exitosa
            if (!response.ok) {
                throw new Error('No se pudieron obtener las noticias del servidor');
            }
            // Convertir la respuesta del servidor a formato JSON
            return response.json();
        })
        .then(noticias => {
            // Filtrar las noticias que no tengan "noticia", "Noticias" o "NOTICIAS" como subtítulo
            const noticiasFiltradas = noticias.filter(noticia => {
                const subtitulo = noticia.subtitulo.toLowerCase();
                return subtitulo !== 'noticia' && subtitulo !== 'noticias';
            });
            // Llamar a la función para mostrar las noticias filtradas en la página
            displayNoticias(noticiasFiltradas);
        })
        .catch(error => {
            // Manejar errores en caso de que la solicitud falle
            console.error('Error al obtener las noticias:', error);
        });
}


// Función para mostrar las noticias en la página
function displayNoticias(noticias) {
    // Obtener el contenedor de noticias
    const noticiasContainer = document.querySelector('.container .row');

    // Limpiar cualquier contenido previo del contenedor de noticias
    noticiasContainer.innerHTML = '';

    // Iterar sobre cada noticia y crear una tarjeta para mostrarla
    noticias.forEach(noticia => {
        // Crear la estructura de la tarjeta
        
        const card = document.createElement('div');
        const contenidoCortado = noticia.contenido.slice(0, 50); // Ajustar el valor '150' según la cantidad de caracteres que deseas mostrar

        card.classList.add('col-md-4', 'mb-4', 'noticia'); // Agregar clase 'noticia' para los efectos visuales
        card.innerHTML = `
            <div class="card h-100">
                <img src="${noticia.url[0]}" class="card-img-top" alt="${noticia.titulo}">
                <div class="card-body">
                    <h5 class="card-title">${noticia.titulo}</h5>
                    <p class="card-text">${noticia.subtitulo}</p>
                    <p class="card-text">${contenidoCortado}</p>
                    <a href="./detalleNoticias/detalleNoticias.html?id=${noticia.idnoticias}" class="card-link">Ver más...</a> 
                </div>
            </div>
        `;

        // Agregar efecto de cursor y evento de clic a la tarjeta
        card.style.cursor = 'pointer'; // Cambiar el cursor al pasar el mouse sobre la tarjeta
        card.addEventListener('click', () => {
            // Redirigir al usuario a la página de detalles de la noticia con el ID como parámetro
            window.location.href = `./detalleNoticias/detalleNoticias.html?id=${noticia.idnoticias}`;
        });

        // Agregar la tarjeta al contenedor de noticias
        noticiasContainer.appendChild(card);
    });
}

// Llamar a la función para obtener y mostrar las noticias desde el servidor al cargar la página
document.addEventListener('DOMContentLoaded', getNoticiasFromServer);
