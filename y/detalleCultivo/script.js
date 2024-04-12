document.addEventListener('DOMContentLoaded', () => {
    // Obtener el ID de la noticia de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const noticiaId = urlParams.get('id');

    // Verificar si se ha proporcionado un ID de noticia válido
    if (noticiaId) {
        // Realizar una solicitud al servidor para obtener los detalles de la noticia
        fetch(`https://unsahuertas.pythonanywhere.com/noticia/${noticiaId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo obtener los detalles de la noticia del servidor');
                }
                return response.json();
            })
            .then(noticia => {
                // Llamar a una función para mostrar los detalles de la noticia en la interfaz de usuario
                displayNoticiaDetails(noticia);
                const newsNavigation = document.querySelector('.breadcrumb-item:last-child');
                newsNavigation.textContent = noticia.titulo;
            })
            .catch(error => {
                console.error('Error al obtener los detalles de la noticia:', error);
            });
    } else {
        console.error('No se proporcionó un ID de noticia válido en la URL');
    }
});

function displayNoticiaDetails(noticia) {
    console.log(noticia);
    // Obtener los elementos donde se mostrarán los detalles de la noticia
    const newsTitle = document.getElementById('newsTitle');
    const newsContent = document.getElementById('newsContent');
    const newsImage = document.getElementById('newsImage');
    const modalImage = document.getElementById('fullImage');

    // Actualizar el contenido de los elementos con los detalles de la noticia
    newsTitle.textContent = noticia.titulo;
    newsContent.textContent = noticia.contenido;
    // Asignar la URL de la imagen a la etiqueta de imagen
    newsImage.src = noticia.imagenes[0];

}
document.addEventListener('DOMContentLoaded', function () {
    const image = document.getElementById('newsImage');
    let zoomed = false;

    image.addEventListener('click', function () {
        zoomed = !zoomed;
        if (zoomed) {
            image.style.maxWidth = "none"; // Elimina el ancho máximo para permitir el zoom
            image.style.cursor = "zoom-out"; // Cambia el cursor al hacer zoom
        } else {
            image.style.maxWidth = "100%"; // Restaura el ancho máximo
            image.style.cursor = "zoom-in"; // Cambia el cursor al hacer zoom out
        }
    });
});
