document.addEventListener('DOMContentLoaded', () => {
    // Obtener el ID de la huerta de la URL
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

        // Obtener el formulario de agregar usuario
        const addUsuarioForm = document.getElementById('addUsuarioForm');

        // Agregar un evento de escucha al formulario para manejar la adición de usuarios
        addUsuarioForm.addEventListener('submit', event => {
            event.preventDefault();
    
            // Obtener los valores del formulario
            const nombre = document.getElementById('nombre').value;
            const apellido = document.getElementById('apellido').value;
            const correo = document.getElementById('correo').value;
            const telefono = document.getElementById('telefono').value;
            
            // Crear un objeto con los detalles del usuario
            const nuevoUsuario = {
                name: nombre,
                lastname: apellido,
                email: correo,
                telefono: telefono
            };
            console.log(nuevoUsuario)
            // Realizar una solicitud POST al servidor para agregar el nuevo usuario
            fetch(`https://unsahuertas.pythonanywhere.com/users/crear/${huertaId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoUsuario)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo agregar el usuario');
                }
                return response.json();
            })
            .then(data => {
                // Mostrar un mensaje de éxito o realizar otras acciones si es necesario
                console.log('Usuario agregado exitosamente:', data);
                // Actualizar la lista de usuarios mostrada en la interfaz de usuario
                mostrarUsuarios(huertaId); // Asegúrate de pasar los parámetros correctos si es necesario
            })
            .catch(error => {
                console.error('Error al agregar el usuario:', error);
                // Mostrar un mensaje de error o realizar otras acciones si es necesario
            });
        });

    // Obtener el formulario de agregar práctica
    const addPracticaForm = document.getElementById('addPracticaForm');

    // Agregar un evento de escucha al formulario para manejar la adición de prácticas
    addPracticaForm.addEventListener('submit', event => {
        event.preventDefault();

        // Obtener los valores del formulario
        const descripcion = document.getElementById('descripcion').value;
        const fecha = document.getElementById('fecha').value;
        const responsables = document.getElementById('responsables').value;

        // Crear un objeto con los detalles de la práctica
        const nuevaPractica = {
            descripcion: descripcion,
            fecha: fecha,
            responsables: responsables
        };

        // Realizar una solicitud POST al servidor para agregar la nueva práctica
        fetch(`https://unsahuertas.pythonanywhere.com/practicas/crear/${huertaId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaPractica)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo agregar la práctica');
            }
            return response.json();
        })
        .then(data => {
            // Mostrar un mensaje de éxito o realizar otras acciones si es necesario
            console.log('Práctica agregada exitosamente:', data);
            // Opcional: recargar la página o actualizar las tarjetas de prácticas
            location.reload();
        })
        .catch(error => {
            console.error('Error al agregar la práctica:', error);
            // Mostrar un mensaje de error o realizar otras acciones si es necesario
        });
    });
});

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
            <div class="card" data-toggle="modal" data-target="#usuariosModal" onclick="mostrarUsuarios(${huertaId},${practica.idpractica})">
                <div class="card-body">
                    <h5 class="card-title">${practica.descripcion}</h5>
                    <p class="card-text">Fecha: ${practica.fecha}</p>
                    <p class="card-text">Responsables: ${practica.responsables}</p>
                </div>
                <div class="card-footer">
                    <button type="button" class="btn btn-danger" onclick="mostrarModal(${practica.idpractica})">Borrar</button>
                </div>
            </div>
        `;

        // Agregar la tarjeta al contenedor de prácticas
        practicasContainer.appendChild(card);
    });
}

// Función para mostrar los usuarios asociados a la práctica
function mostrarUsuarios(huertaId,practicaId) {
    // Realizar una solicitud al servidor para obtener los usuarios asociados a la práctica
    fetch(`https://unsahuertas.pythonanywhere.com/users/${huertaId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudieron obtener los usuarios asociados a la práctica del servidor');
            }
            return response.json();
        })
        .then(usuarios => {
            // Llamar a una función para mostrar los usuarios en el modal
            displayUsuarios(usuarios,practicaId);
        })
        .catch(error => {
            console.error('Error al obtener los usuarios asociados a la práctica:', error);
        });
}

function displayUsuarios(usuarios, practicaId) { // Agregar huertaId y practicaId como parámetros
    // Obtener el contenedor donde se mostrarán los usuarios
    const modalBody = document.getElementById('usuariosList');

    // Limpiar cualquier contenido previo del contenedor
    modalBody.innerHTML = '';

    // Iterar sobre los usuarios y crear elementos para mostrar cada uno
    usuarios.forEach(usuario => {
        // Verificar si 'asistio' es null y asignar un espacio en blanco en su lugar
        const asistio = usuario.asistio !== null ? usuario.asistio : '';

        // Crear un elemento <div> para mostrar la información del usuario
        const userDiv = document.createElement('div');
        userDiv.classList.add('user');

        // Agregar la información del usuario al elemento <div>
        userDiv.innerHTML = `
            <p><strong>ID:</strong> ${usuario.id_usuario}</p>
            <p><strong>Nombre:</strong> ${usuario.name}</p>
            <p><strong>Apellido:</strong> ${usuario.lastname}</p>
            <p><strong>Email:</strong> ${usuario.email}</p>
            <p><strong>Teléfono:</strong> ${usuario.telefono}</p>
            <p>
                <strong>Asistió:</strong>
                <select id="asistenciaUsuario_${usuario.id_usuario}" onchange="actualizarAsistencia(${practicaId},${usuario.id_usuario})">
                    <option value="null" ${asistio === '' ? 'selected' : ''}>No especificado</option>
                    <option value="true" ${asistio === 'true' ? 'selected' : ''}>Sí</option>
                    <option value="false" ${asistio === 'false' ? 'selected' : ''}>No</option>
                </select>
            </p>
        `;

        // Agregar el elemento del usuario al contenedor
        modalBody.appendChild(userDiv);
    });
}
 
// Función para actualizar la asistencia del usuario
function actualizarAsistencia(practicaId, usuarioId) {
    const asistenciaSelect = document.getElementById(`asistenciaUsuario_${usuarioId}`);
    const nuevaAsistencia = asistenciaSelect.value;

    // Mostrar un mensaje de confirmación antes de actualizar la asistencia
    const confirmacion = confirm('¿Estás seguro de actualizar la asistencia?');
    if (!confirmacion) {
        // Si el usuario cancela, no realizar la actualización
        return;
    }

    // Realizar una solicitud POST al servidor para actualizar la asistencia del usuario
    fetch(`https://unsahuertas.pythonanywhere.com/users/${usuarioId}/${practicaId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ asistio: nuevaAsistencia })
    })
    .then(response => {
        if (response==400) {
            alert('Ya se indico la asistencia de este usuario')
        }
        // Deshabilitar el elemento select después de la confirmación
        asistenciaSelect.disabled = true;
        return response.json();
    })
    .then(data => {
        console.log('Asistencia actualizada exitosamente:', data);
        // Opcional: realizar acciones adicionales después de actualizar la asistencia
    })
    .catch(error => {
        console.error('Error al actualizar la asistencia del usuario:', error);
        // Mostrar un mensaje de error o realizar otras acciones si es necesario
    });
}


// Función para mostrar el modal de confirmación
function mostrarModal(idPractica) {
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    confirmDeleteButton.dataset.idPractica = idPractica; // Almacenar el ID de la práctica en el botón de confirmación
    $('#confirmDeleteModal').modal('show'); // Mostrar el modal
}

// Agregar un evento de escucha al botón de confirmación de borrado en el modal
document.getElementById('confirmDeleteButton').addEventListener('click', function() {
    const idPractica = this.dataset.idPractica;

    // Realizar la solicitud DELETE al servidor para borrar la práctica
    fetch(`https://unsahuertas.pythonanywhere.com/practicas/${idPractica}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('No se pudo borrar la práctica');
        }
        return response.json();
    })
    .then(data => {
        console.log('Práctica borrada exitosamente:', data);
        // Opcional: recargar la página o actualizar las tarjetas de prácticas
        window.location.reload();
    })
    .catch(error => {
        console.error('Error al borrar la práctica:', error);
        // Mostrar un mensaje de error o realizar otras acciones si es necesario
    });

    $('#confirmDeleteModal').modal('hide'); // Ocultar el modal después de confirmar el borrado
});
