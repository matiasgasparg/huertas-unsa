document.addEventListener('DOMContentLoaded', function() {
    // Obtener el botón para descargar el archivo Excel
    const downloadExcelBtn = document.getElementById('downloadExcelBtn');

    // Agregar un evento de clic al botón
    downloadExcelBtn.addEventListener('click', function() {
        // Realizar la llamada al endpoint para obtener los datos de los usuarios
        fetch('http://127.0.0.1:5000/users/15')
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudieron obtener los datos de los usuarios del servidor');
                }
                return response.json();
            })
            .then(users => {
                // Llamar a la función para crear y descargar el archivo Excel
                createAndDownloadExcel(users);
            })
            .catch(error => {
                console.error('Error al obtener los datos de los usuarios:', error);
            });
    });

    // Función para crear y descargar el archivo Excel
    function createAndDownloadExcel(users) {
        // Crear un objeto de tipo Blob que contiene los datos en formato CSV
        const csvData = new Blob([convertToCSV(users)], { type: 'text/csv' });

        // Crear un objeto URL para el Blob creado
        const csvUrl = URL.createObjectURL(csvData);

        // Crear un enlace <a> para descargar el archivo Excel
        const downloadLink = document.createElement('a');
        downloadLink.href = csvUrl;
        downloadLink.download = 'usuarios.csv'; // Nombre del archivo
        downloadLink.click();

        // Liberar el objeto URL después de la descarga
        URL.revokeObjectURL(csvUrl);
    }

    // Función para convertir los datos de los usuarios a formato CSV
    function convertToCSV(users) {
        // Crear un array con las cabeceras del archivo Excel
        const headers = ['ID', 'Nombre', 'Apellido', 'Correo electrónico', 'Teléfono'];

        // Crear un array vacío para almacenar las filas de datos
        const rows = [];

        // Iterar sobre los usuarios y agregarlos al array de filas
        users.forEach(user => {
            const rowData = [
                user.id_usuario,
                user.name,
                user.lastname,
                user.email,
                user.telefono
            ];
            rows.push(rowData.join(',')); // Convertir los datos de la fila a texto CSV y agregarlos al array
        });

        // Unir las cabeceras con las filas usando saltos de línea
        return headers.join(',') + '\n' + rows.join('\n');
    }
});
