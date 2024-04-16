document.addEventListener('DOMContentLoaded', () => {
    const jwtToken = localStorage.getItem('jwt_token');

    if (jwtToken) {
        // Si el usuario ha iniciado sesión, mostrar los botones
        document.getElementById('modificarButton').style.display = 'block';
        document.getElementById('modificarHuertaButton').style.display = 'block';

        // Agregar evento de clic al botón "Modificar"
        document.getElementById('modificarButton').addEventListener('click', () => {
            window.location.href = '../modificar/modificar.html';
        });

        // Agregar evento de clic al botón "Modificar Huerta"
        document.getElementById('modificarHuertaButton').addEventListener('click', () => {
            window.location.href = '../modificarHuerta/modificarHuerta.html';
        });
    } else {
        // Si el usuario no ha iniciado sesión, ocultar los botones
        document.getElementById('modificarButton').style.display = 'none';
        document.getElementById('modificarHuertaButton').style.display = 'none';
    }
});
