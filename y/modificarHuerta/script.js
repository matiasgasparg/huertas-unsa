document.addEventListener('DOMContentLoaded', function() {
    const huertasContainer = document.getElementById('huertasContainer');
    const addHuertaBtn = document.getElementById('addHuertaBtn');

    // Cargar huertas existentes al cargar la página
    loadHuertas();

    // Agregar evento de clic al botón "+" para mostrar el formulario de agregar huertas
    addHuertaBtn.addEventListener('click', function() {
        showAddHuertaForm();
    });

    // Función para cargar las huertas existentes desde el servidor
    function loadHuertas() {
        fetch('https://unsahuertas.pythonanywhere.com/huertas/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudieron obtener las huertas del servidor');
                }
                return response.json();
            })
            .then(huertas => {
                displayHuertas(huertas);
            })
            .catch(error => {
                console.error('Error al obtener las huertas:', error);
            });
    }

    // Función para mostrar las huertas en la página
    function displayHuertas(huertas) {
        huertasContainer.innerHTML = ''; // Limpiar el contenedor de huertas
        huertas.forEach(huerta => {
            const huertaItem = createHuertaItem(huerta);
            huertasContainer.appendChild(huertaItem);
        });
    }


    function createHuertaItem(huerta) {
        const huertaItem = document.createElement('div');
        huertaItem.classList.add('huerta-item');
    
        // Contenedor para imágenes
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');
    
        // Agregar imagen principal de la huerta
        const img = document.createElement('img');
        img.src = huerta.url;
        img.alt = huerta.titulo;
        img.classList.add('huerta-img');
        imageContainer.appendChild(img);
    
        // Agregar imágenes adicionales de la huerta
        loadHuertaImages(huerta.idhuertas, imageContainer);
    
        // Agregar el contenedor de imágenes al huertaItem
        huertaItem.appendChild(imageContainer);
    
        // Agregar título
        const title = document.createElement('h2');
        title.textContent = huerta.titulo;
        huertaItem.appendChild(title);
    
        // Agregar dirección
        const direccion = document.createElement('h3');
        direccion.textContent = huerta.direccion;
        huertaItem.appendChild(direccion);
    
        // Agregar descripción
        const descripcion = document.createElement('p');
        descripcion.textContent = huerta.descripcion;
        huertaItem.appendChild(descripcion);
    
        // Agregar botón de eliminar
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.classList.add('btn', 'btn-danger', 'delete-btn');
        deleteBtn.addEventListener('click', function() {
            deleteHuerta(huerta.idhuertas); // Llama a la función para eliminar la huerta
        });
        huertaItem.appendChild(deleteBtn);
    
        // Agregar botón de editar
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Editar';
        editBtn.classList.add('btn', 'btn-primary', 'edit-btn');
        editBtn.addEventListener('click', function() {
            // Llama a la función para mostrar el formulario de edición de la noticia
            showEditNewsForm(huerta);
        });
        huertaItem.appendChild(editBtn);
    
        // Agregar botón de agregar fotos
        const agregarBtn = document.createElement('button');
        agregarBtn.textContent = 'Agregar Fotos!!';
        agregarBtn.classList.add('btn', 'btn-success', 'agregar-btn');
        agregarBtn.addEventListener('click', function() {
            // Llama a la función para agregar una huerta
            agregarImagenHuerta(huerta);
        });
        huertaItem.appendChild(agregarBtn);
    
        return huertaItem;
    }
    
 // Función para cargar las imágenes de una huerta desde el servidor
 function loadHuertaImages(idhuertas, huertaItem) {
    const url = `https://unsahuertas.pythonanywhere.com/imagen/${idhuertas}`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudieron obtener las imágenes de la huerta del servidor');
            }
            return response.json();
        })
        .then(images => {
            displayHuertaImages(images, huertaItem,idhuertas);
        })
        .catch(error => {
            console.error('Error al obtener las imágenes de la huerta:', error);
        });
}

// Función para mostrar las imágenes de una huerta en la página
function displayHuertaImages(images, huertaItem,idhuertas) {
    images.forEach(image => {
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');

        const img = document.createElement('img');
        img.src = image.url;
        img.alt = image.idimagen;
        img.classList.add('huerta-img2');
        imageContainer.appendChild(img);

        // Agregar botón de eliminar
        const deleteImgBtn = document.createElement('button');
        deleteImgBtn.textContent = 'X'; // Cambia el texto a "Eliminar"
        deleteImgBtn.classList.add('btn', 'btn-danger', 'delete-img-btn');
        deleteImgBtn.style.position = 'absolute'; // Posiciona el botón de forma absoluta
        deleteImgBtn.addEventListener('click', function() {
            deleteHuertaImage(idhuertas, image.idimagen); // Llama a la función para eliminar la imagen
        });
        imageContainer.appendChild(deleteImgBtn);

        huertaItem.appendChild(imageContainer);
    });
}
// Función para eliminar una imagen de una huerta
function deleteHuertaImage(idhuertas, idimagen) {
    // Realizar una solicitud DELETE para eliminar la imagen del servidor
    fetch(`https://unsahuertas.pythonanywhere.com/imagen/${idimagen}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('No se pudo eliminar la imagen');
        }
        alert("Imagen eliminada exitosamente");
        window.location.reload();

        // Si la respuesta es exitosa, recargar las imágenes para reflejar el cambio
    })
    .catch(error => {
        console.error('Error al eliminar la imagen:', error);
    });
}

    // Función para mostrar el formulario de agregar huertas
    function showAddHuertaForm() {
        $('#addHuertaModal').modal('show'); // Muestra el modal de agregar huertas
    }

    
// Función para mostrar el formulario de edición de noticias
function showEditNewsForm(huerta) {
    // Mostrar el modal de editar noticias
    $('#editNewsModal').modal('show');

    // Prellenar los campos del formulario con la información de la noticia a editar
    document.getElementById('editNewsId').value = huerta.idhuertas;
    document.getElementById('editTitle').value = huerta.titulo;
    document.getElementById('editDireccion').value = huerta.direccion;
    document.getElementById('editContent').value = huerta.descripcion;
    document.getElementById('editImageUrl').value = huerta.url;

    // Obtener el botón de guardar cambios
    const updateNewsBtn = document.getElementById('updateNewsBtn');

    // Agregar un evento de clic al botón de guardar cambios
    updateNewsBtn.addEventListener('click', async function() {
        // Obtener los valores actualizados del formulario
        const updatedTitle = document.getElementById('editTitle').value;
        const updatedDireccion = document.getElementById('editDireccion').value;
        const updatedContent = document.getElementById('editContent').value;
        const updatedImageUrl = document.getElementById('editImageUrl').value;

        // Crear un objeto con los campos modificados
        const updatedFields = {};
        if (updatedTitle !== huerta.titulo) {
            updatedFields['titulo'] = updatedTitle;
        }
        if (updatedDireccion !== huerta.subtitulo) {
            updatedFields['direccion'] = updatedDireccion;
        }
        if (updatedContent !== huerta.descripcion) {
            updatedFields['descripcion'] = updatedContent;
        }

        if (updatedImageUrl !== huerta.url) {
            updatedFields['url'] = updatedImageUrl; // Enviar la URL como un objeto JSON
        }
        // Verificar si hay campos modificados
        if (Object.keys(updatedFields).length > 0) {
            // Actualizar la noticia en el servidor con los campos actualizados
            try {
                const response = await updateNewsField(huerta.idhuertas, updatedFields);
                if (!response.ok) {
                    throw new Error('No se pudo actualizar la noticia');
                }
                // Si la respuesta es exitosa, cerrar el modal y recargar las noticias para mostrar los cambios
                $('#editNewsModal').modal('hide');
                loadHuertas();
                window.location.reload();

            } catch (error) {
                console.error('Error al actualizar la noticia:', error);
            }
        } else {
            // No hay campos modificados, simplemente cerrar el modal
            $('#editNewsModal').modal('hide');
        }
    });

// Obtener el botón de actualizar imágenes
const updateImageButton = document.getElementById('updateImageButton');

// Agregar un evento de clic al botón de actualizar imágenes
updateImageButton.addEventListener('click', async () => {
    const fileInput = document.getElementById('newImageInput');
    const file = fileInput.files[0]; // Obtener solo el primer archivo seleccionado

    if (file) {
        try {
            // Llamar a la función para subir una sola imagen
            const imageUrl = await uploadImage(file);
            if (imageUrl) {
                // Rellenar la casilla de URL de imagen con la URL obtenida
                document.getElementById('editImageUrl').value = imageUrl;
                alert('Imagen subida exitosamente.');
            } else {
                console.error('No se pudo obtener la URL de la imagen desde el servidor.');
                alert('Error al subir la imagen.');
            }
        } catch (error) {
            console.error('Error al subir la imagen:', error);
            alert('Error al subir la imagen.');
        }
    } else {
        alert('Seleccione una imagen para subir.');
    }
});

}
// Función para actualizar la noticia en el servidor con los campos actualizados
function updateNewsField(idhuertas, updatedFields) {
    const url = `https://unsahuertas.pythonanywhere.com/huertas/${idhuertas}`;
    console.log('Datos actualizados:', updatedFields);

    return fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedFields) // Enviar los campos modificados como un objeto JSON
    });
}

    // Función para eliminar una noticia
    function deleteHuerta(idhuertas) {
        // Realizar una solicitud DELETE para eliminar la noticia del servidor
        fetch(`https://unsahuertas.pythonanywhere.com/huertas/${idhuertas}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo eliminar la huerta');
            }
            // Si la respuesta es exitosa, recargar las noticias para reflejar el cambio
            loadHuertas();
        })
        .catch(error => {
            console.error('Error al eliminar la huerta:', error);
        });
    }

// Obtener el botón de guardar
const saveHuertaBtn = document.getElementById('saveHuertaBtn');

// Agregar un evento de clic al botón de guardar
saveHuertaBtn.addEventListener('click', function() {
    // Obtener los valores del formulario
    const title = document.getElementById('huertaTitle').value;
    const direccion = document.getElementById('huertaDireccion').value;
    const content = document.getElementById('huertaDescripcion').value;
    const imageUrl = document.getElementById('imageUrl').value;

    // Crear un objeto con los datos del formulario
    const formData = {
        titulo: title,
        direccion: direccion,
        descripcion: content,
        url: imageUrl // Convertir la URL de la imagen en un arreglo para que coincida con el formato esperado
    };

    // Realizar una solicitud POST para crear una nueva noticia
    fetch('https://unsahuertas.pythonanywhere.com/huertas/crear', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('No se pudo crear la noticia');
        }
        // Si la respuesta es exitosa, reiniciar el formulario y cerrar el modal
        document.getElementById('addHuertaForm').reset();
        $('#addHuertaModal').modal('hide');
        // Recargar las noticias para mostrar la nueva noticia agregada
        loadHuertas();
    })
    .catch(error => {
        console.error('Error al crear la noticia:', error);
    });
});

const updateImageBtn = document.getElementById('uploadedImageUrl');

// Agregar un evento de clic al botón de actualizar imágenes
updateImageBtn.addEventListener('click', async () => {
    const fileInput = document.getElementById('newImageInput2');
    const file = fileInput.files[0]; // Obtener solo el primer archivo seleccionado

    if (file) {
        try {
            // Llamar a la función para subir una sola imagen
            const imageUrl = await uploadImage(file);
            if (imageUrl) {
                // Rellenar la casilla de URL de imagen con la URL obtenida
                document.getElementById('imageUrl').value = imageUrl;
                alert('Imagen subida exitosamente.');
            } else {
                console.error('No se pudo obtener la URL de la imagen desde el servidor.');
                alert('Error al subir la imagen.');
            }
        } catch (error) {
            console.error('Error al subir la imagen:', error);
            alert('Error al subir la imagen.');
        }
    } else {
        alert('Seleccione una imagen para subir.');
    }
});

    // Función para subir una imagen al servidor
    function subirImagen(idhuertas, imageUrls) {
        const url = `https://unsahuertas.pythonanywhere.com/imagen/crear/${idhuertas}`;
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ urls: imageUrls }) // Envía la lista de URLs como un objeto JSON
        })
        .then(response => {
            if (response.ok) {
                alert('¡Imágenes subidas correctamente!');
                return response;
            } else {
                // Si hay un error, lanzamos una excepción con un mensaje de error
                throw new Error('No se pudo subir la imagen');
            }
        })
        .catch(error => {
            // Capturamos cualquier error y lo mostramos en la consola
            console.error('Error al subir la imagen:', error);
            throw error;
        });
    }

// Función para agregar imágenes a una huerta
async function agregarImagenHuerta(huerta) {
    $('#addHuertaImagesModal').modal('show');

    const guardarImagenesBtn = document.getElementById('guardarImagenesBtn');

    guardarImagenesBtn.addEventListener('click', async () => {
        const huertaId = huerta.idhuertas;
        const fileInput = document.getElementById('newImageInput3');
        const files = fileInput.files;

        if (files.length > 0) {
            try {
                const imageUrls = [];

                // Iterar sobre cada archivo de imagen seleccionado
                for (const file of files) {
                    // Llamar a uploadImage para obtener la URL de la imagen
                    const imageUrl = await uploadImage(file);
                    if (imageUrl) {
                        // Agregar la URL al array de URLs de imágenes
                        imageUrls.push(imageUrl);
                    } else {
                        console.error('No se pudo obtener la URL de una imagen desde el servidor.');
                        alert('Error al subir una o más imágenes.');
                        return; // Salir del bucle y detener el proceso si ocurre un error
                    }
                }
                // Actualizar la huerta en el servidor con las nuevas URLs de imágenes
                const response = await subirImagen(huertaId, imageUrls);
                if (!response.ok) {
                    throw new Error('No se pudieron subir las imágenes.');
                }

                $('#addHuertaImagesModal').modal('hide');
                loadHuertas();
            } catch (error) {
                console.error('Error al subir las imágenes:', error);
                alert('Error al subir las imágenes.');
            }
        } else {
            alert('Seleccione una o más imágenes para subir.');
        }
    });
}

});
