// Función para obtener todos los datos de las noticias desde el servidor
function getNoticiasFromServer() {
    // Realizar una solicitud GET al servidor para obtener todos los datos de las noticias
    fetch('https://unsahuertas.pythonanywhere.com/noticia/')
        .then(response => {
            // Verificar si la respuesta del servidor es exitosa
            if (!response.ok) {
                throw new Error('No se pudieron obtener las noticias del servidor');
            }
            // Convertir la respuesta del servidor a formato JSON
            return response.json();
        })
        .then(noticias => {
            // Filtrar las noticias que tengan "noticia" como subtítulo
            const noticiasFiltradas = noticias.filter(noticia => noticia.subtitulo.toLowerCase() === 'noticia');
            // Llamar a la función para organizar y mostrar las noticias en el carousel
            displayNoticiasCarousel(noticiasFiltradas);
        })
        .catch(error => {
            // Manejar errores en caso de que la solicitud falle
            console.error('Error al obtener las noticias:', error);
        });
}

// Función para organizar y mostrar las noticias en el carousel
function displayNoticiasCarousel(noticias) {
    // Obtener el elemento del carousel inner
    var carouselInner = document.getElementById('carousel-inner');
    // Limpiar cualquier contenido previo del carousel
    carouselInner.innerHTML = '';
    // Iterar sobre cada noticia y crear un item para el carousel
    noticias.forEach((noticia, index) => {
        var carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');
        if (index === 0) {
            carouselItem.classList.add('active');
        }
        var img = document.createElement('img');
        img.classList.add('d-block', 'mx-auto', 'img-zoom');
        img.src = noticia.url[0]; // Se accede al primer elemento del arreglo de URLs de imagen
        img.style.maxWidth = '75%';
        img.alt = 'Imagen ' + (index + 1);
        var caption = document.createElement('div');
        caption.classList.add('carousel-caption', 'd-none', 'd-md-block');
        var titulo = document.createElement('h5');
        titulo.textContent = noticia.titulo;
        caption.appendChild(titulo);
        carouselItem.appendChild(img);
        carouselItem.appendChild(caption);
        carouselInner.appendChild(carouselItem);
    });
}

// Llamar a la función para obtener las noticias desde el servidor al cargar la página
document.addEventListener('DOMContentLoaded', getNoticiasFromServer);
