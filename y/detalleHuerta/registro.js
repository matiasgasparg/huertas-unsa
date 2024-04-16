document.getElementById('registro-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío predeterminado del formulario
    
    // Obtener la URL actual
    const urlParams = new URLSearchParams(window.location.search);
    
    // Obtener el valor del parámetro 'id' de la URL
    const idhuertas = urlParams.get('id');

    // Verificar si se obtuvo correctamente el valor de 'id'
    if (idhuertas) {
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

        // Enviar solicitud HTTP POST al servidor
        fetch(`https://unsahuertas.pythonanywhere.com/users/crear/${idhuertas}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            if (response.ok) {
                alert('Usuario creado exitosamente.');
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
    } else {
        console.error('No se encontró el parámetro "id" en la URL.');
        // Manejar el caso en el que no se encuentre el parámetro 'id' en la URL
    }
});
