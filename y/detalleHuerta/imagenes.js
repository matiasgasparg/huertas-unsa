document.addEventListener('DOMContentLoaded', () => {
    // Obtener el ID de la huerta de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idhuertas = urlParams.get('id');

    // Verificar si se ha proporcionado un ID de huerta válido
    if (idhuertas) {
        // Realizar una solicitud al servidor para obtener las imágenes de la huerta
        fetch(`https://unsahuertas.pythonanywhere.com/imagen/${idhuertas}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo obtener las imágenes de la huerta del servidor');
                }
                return response.json();
            })
            .then(imagenes => {
                // Llamar a una función para mostrar las imágenes en el carrusel
                displayCarousel(imagenes);
            })
            .catch(error => {
                console.error('Error al obtener las imágenes de la huerta:', error);
            });
    } else {
        console.error('No se proporcionó un ID de huerta válido en la URL');
    }
});

function displayCarousel(imagenes) {
    // Obtener el elemento del carrusel interno
    var carouselInner = document.getElementById('carousel-inner');
    // Limpiar cualquier contenido previo del carrusel
    carouselInner.innerHTML = '';
    // Iterar sobre cada imagen y crear un elemento para el carrusel
    imagenes.forEach((imagen, index) => {
        // Crear un elemento para el ítem del carrusel
        var carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');
        if (index === 0) {
            carouselItem.classList.add('active');
        }
        // Crear un elemento de imagen
        var img = document.createElement('img');
        img.classList.add('d-block', 'mx-auto', 'img-zoom');
        img.src = imagen.url; // Obtener la URL de la imagen
        img.alt = 'Imagen ' + (index + 1);

        // Ajustar el ancho máximo de la imagen
        img.style.maxWidth = '720px';

        // Añadir la imagen al ítem del carrusel
        carouselItem.appendChild(img);

        // Añadir el ítem del carrusel al carrusel interno
        carouselInner.appendChild(carouselItem);
    });
}
