document.getElementById('registro-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío predeterminado del formulario

    // Obtener los valores del formulario
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const correo = document.getElementById('correo').value;
    const telefono = document.getElementById('telefono').value;

    // Crear objeto de usuario
    const userData = {
        name: nombre,
        lastname: apellido,
        email: correo,
        telefono: telefono
    };
    console.log(userData)

    // Enviar solicitud HTTP POST al servidor
    fetch('http://127.0.0.1:5000/users/crear', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (response.ok) {
            console.log('Usuario creado exitosamente.');
            // Muestra un mensaje en algún elemento HTML
            document.getElementById('mensaje').innerText = '¡Creado exitosamente!';
            // Aquí puedes realizar cualquier acción adicional después de crear el usuario
        } else {
            console.error('Error al crear el usuario.');
            // Aquí puedes manejar errores de la solicitud
        }
    })
    .catch(error => {
        console.error('Error de red:', error);
        // Manejar errores de red
    });

    // Reiniciar el formulario después del envío exitoso
    document.getElementById('registro-form').reset();
});
