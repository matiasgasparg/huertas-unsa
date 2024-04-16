    // Función para obtener y mostrar las noticias desde el servidor
function getHuertasFromServer() {
    // Realizar una solicitud GET al servidor para obtener todos los datos de las noticias
    fetch('https://unsahuertas.pythonanywhere.com/huertas/')
        .then(response => {
            // Verificar si la respuesta del servidor es exitosa
            if (!response.ok) {
                throw new Error('No se pudieron obtener las noticias del servidor');
            }
            // Convertir la respuesta del servidor a formato JSON
            return response.json();
        })
        .then(huertas => {
            console.log(huertas)
            displayHuertas(huertas)
            })
        
        .catch(error => {
            // Manejar errores en caso de que la solicitud falle
            console.error('Error al obtener las noticias:', error);
        });
}
// Función para mostrar las noticias en la página
function displayHuertas(huertas) {
    // Obtener el contenedor de noticias
    const huertasContainer = document.getElementById('huertas-container');

    // Limpiar cualquier contenido previo del contenedor de noticias
    huertasContainer.innerHTML = '';

    // Iterar sobre cada noticia y crear una tarjeta para mostrarla
    huertas.forEach(huerta => {
        // Crear la estructura de la tarjeta
        console.log(huerta)
        const card = document.createElement('div');
        const descripcionCortado = huerta.descripcion.slice(0, 50); // Ajustar el valor '150' según la cantidad de caracteres que deseas mostrar

        card.classList.add('col-md-4', 'mb-4', 'huerta'); // Agregar clase 'noticia' para los efectos visuales
        card.innerHTML = `
            <div class="card h-100">
                <img src="${huerta.url}" class="card-img-top" alt="${huerta.titulo}">
                <div class="card-body">
                    <h5 class="card-title ">${huerta.titulo}</h5>
                    <p class="card-text">${huerta.direccion}</p>
                    <p class="card-text">${descripcionCortado}</p>
                    <a href="./detalleNoticias/detalleNoticias.html?id=${huerta.idhuertas}" class="card-link">Ver más...</a> 
                </div>
            </div>
        `;

        // Agregar efecto de cursor y evento de clic a la tarjeta
        card.style.cursor = 'pointer'; // Cambiar el cursor al pasar el mouse sobre la tarjeta
        card.addEventListener('click', () => {
            // Redirigir al usuario a la página de detalles de la noticia con el ID como parámetro
            window.location.href = `./detalleHuerta/detalleHuerta.html?id=${huerta.idhuertas}`;
        });

        // Agregar la tarjeta al contenedor de noticias
        huertasContainer.appendChild(card);
    });
}
document.addEventListener('DOMContentLoaded', getHuertasFromServer);
