document.addEventListener('DOMContentLoaded', () => {
    const downloadExcelBtn = document.getElementById('downloadExcelBtn');
    const urlParams = new URLSearchParams(window.location.search);
    const huertaId = urlParams.get('id');

    downloadExcelBtn.addEventListener('click', () => {
        fetch(`https://unsahuertas.pythonanywhere.com/practicas/${huertaId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudieron obtener las prácticas del servidor');
                }
                return response.json();
            })
            .then(practicas => {
                let allUsersData = [];

                // Obtener la asistencia de cada usuario para cada práctica
                Promise.all(practicas.map(practica => {
                    return fetch(`https://unsahuertas.pythonanywhere.com/users/${huertaId}/${practica.idpractica}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('No se pudieron obtener los datos de asistencia de los usuarios para la práctica');
                            }
                            return response.json();
                        })
                        .then(attendanceData => {
                            // Agregar los datos de asistencia a cada usuario
                            attendanceData.forEach(user => {
                                // Agregar la información de la práctica a cada usuario
                                user.practicaId = practica.idpractica;
                                user.descripcionPractica = practica.descripcion;
                                user.fechaPractica = practica.fecha;
                                user.responsablesPractica = practica.responsables;
                            });
                            allUsersData.push(...attendanceData);
                        });
                }))
                .then(() => {
                    generateExcel(allUsersData);
                })
                .catch(error => {
                    console.error('Error al obtener los datos de asistencia de los usuarios:', error);
                });
            })
            .catch(error => {
                console.error('Error al obtener las prácticas:', error);
            });
    });
});

function generateExcel(data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Usuarios');

    worksheet.columns = [
        { header: 'ID Usuario', key: 'id_usuario', width: 15 },
        { header: 'Nombre', key: 'name', width: 20 },
        { header: 'Apellido', key: 'lastname', width: 20 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Teléfono', key: 'telefono', width: 15 },
        { header: 'ID Práctica', key: 'practicaId', width: 15 },
        { header: 'Descripción Práctica', key: 'descripcionPractica', width: 30 },
        { header: 'Fecha Práctica', key: 'fechaPractica', width: 15 },
        { header: 'Responsables Práctica', key: 'responsablesPractica', width: 30 },
        { header: 'Asistió', key: 'asistio', width: 15 }
    ];

    data.forEach(user => {
        worksheet.addRow({
            id_usuario: user.id_usuario,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            telefono: user.telefono,
            practicaId: user.practicaId,
            descripcionPractica: user.descripcionPractica,
            fechaPractica: user.fechaPractica,
            responsablesPractica: user.responsablesPractica,
            asistio: user.asistio // Este campo será llenado con la asistencia obtenida
        });
    });

    workbook.xlsx.writeBuffer()
        .then(buffer => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'usuarios.xlsx';
            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Error al generar el archivo Excel:', error);
        });
}
