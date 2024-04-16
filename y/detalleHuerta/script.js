document.addEventListener('DOMContentLoaded', () => {
    // Obtener el ID de la noticia de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idhuertas = urlParams.get('id');

    // Verificar si se ha proporcionado un ID de noticia válido
    if (idhuertas) {
        // Realizar una solicitud al servidor para obtener los detalles de la noticia
        fetch(`https://unsahuertas.pythonanywhere.com/huertas/${idhuertas}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo obtener los detalles de la noticia del servidor');
                }
                return response.json();
            })
            .then(huerta => {
                // Llamar a una función para mostrar los detalles de la noticia en la interfaz de usuario
                displayNoticiaDetails(huerta);
                const newsNavigation = document.querySelector('.breadcrumb-item:last-child');
                newsNavigation.textContent = huerta.titulo;
            })
            .catch(error => {
                console.error('Error al obtener los detalles de la noticia:', error);
            });
    } else {
        console.error('No se proporcionó un ID de noticia válido en la URL');
    }
});

function displayNoticiaDetails(huerta) {
    console.log(huerta)
    // Obtener los elementos donde se mostrarán los detalles de la noticia
    const newsTitle = document.getElementById('newsTitle');
    const newsContent = document.getElementById('newsContent');
    const newsDireccion = document.getElementById('newsDireccion');
    const newsImage = document.getElementById('newsImage');

    // Actualizar el contenido de los elementos con los detalles de la noticia
    newsTitle.textContent = huerta.titulo;
    newsContent.textContent = huerta.descripcion;
    newsDireccion.textContent = huerta.direccion;
    // Asignar la URL de la imagen a la etiqueta de imagen
    newsImage.src = huerta.url;
}
