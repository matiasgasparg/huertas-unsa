document.addEventListener('DOMContentLoaded', () => {
    // Obtener el ID de la noticia de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const huertaId = urlParams.get('id');
    // Verificar si se ha proporcionado un ID de huerta válido
    if (huertaId) {
        // Realizar una solicitud al servidor para obtener las prácticas de la huerta
        fetch(`https://unsahuertas.pythonanywhere.com/practicas/${huertaId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudieron obtener las prácticas de la huerta del servidor');
                }
                return response.json();
            })
            .then(practicas => {
                // Llamar a una función para mostrar las tarjetas de prácticas en la interfaz de usuario
                displayPracticas(practicas, huertaId);
            })
            .catch(error => {
                console.error('Error al obtener las prácticas de la huerta:', error);
            });
    } else {
        console.error('No se proporcionó un ID de huerta válido en la URL');
    }


function displayPracticas(practicas, huertaId) {
    // Obtener el contenedor de prácticas
    const practicasContainer = document.getElementById('practicas-container');

    // Limpiar cualquier contenido previo del contenedor
    practicasContainer.innerHTML = '';

    // Iterar sobre las prácticas y crear tarjetas para cada una
    practicas.forEach(practica => {
        // Crear elementos HTML para la tarjeta de práctica
        const card = document.createElement('div');
        card.classList.add('col-md-4', 'mb-4');
        card.innerHTML = `
        <div class="card bg-success text-white"> <!-- Utilizamos las clases 'bg-success' para el color de fondo verde claro y 'text-white' para el color del texto -->
        <div class="card-body">
                    <h5 class="card-title">${practica.titulo}</h5>
                    <h5 class="card-text">${practica.descripcion}</h5>
                    <p class="card-text">Responsables: ${practica.responsables}</p>
                    <p class="card-subtitle">Fecha: ${practica.fecha}</p>

        </div>
    </div>
    
        `;

        // Agregar la tarjeta al contenedor de prácticas
        practicasContainer.appendChild(card);
    });
}



});