// script.js

document.addEventListener('DOMContentLoaded', function() {
    const newsContainer = document.getElementById('newsContainer');
    const addNewsBtn = document.getElementById('addNewsBtn');

    // Cargar noticias existentes al cargar la página
    loadNews();

    // Agregar evento de clic al botón "+" para mostrar el formulario de agregar noticias
    addNewsBtn.addEventListener('click', function() {
        showAddNewsForm();
    });

    // Función para cargar las noticias existentes desde el servidor
    function loadNews() {
        fetch('http://127.0.0.1:5000/noticia/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudieron obtener las noticias del servidor');
                }
                return response.json();
            })
            .then(news => {
                displayNews(news);
            })
            .catch(error => {
                console.error('Error al obtener las noticias:', error);
            });
    }

    // Función para mostrar las noticias en la página
    function displayNews(news) {
        newsContainer.innerHTML = ''; // Limpiar el contenedor de noticias
        news.forEach(noticia => {
            const newsItem = createNewsItem(noticia);
            newsContainer.appendChild(newsItem);
        });
    }

    // Función para crear un elemento de noticia
    function createNewsItem(noticia) {
        const newsItem = document.createElement('div');
        newsItem.classList.add('news-item');
        
        // Agregar imagen si está disponible
        if (noticia.url && noticia.url.length > 0) {
            const img = document.createElement('img');
            img.src = noticia.url[0];
            img.alt = noticia.titulo;
            newsItem.appendChild(img);
        }

        // Agregar título
        const title = document.createElement('h2');
        title.textContent = noticia.titulo;
        newsItem.appendChild(title);

        // Agregar subtitulo
        const subtitle = document.createElement('h3');
        subtitle.textContent = noticia.subtitulo;
        newsItem.appendChild(subtitle);

        // Agregar contenido
        const content = document.createElement('p');
        content.textContent = noticia.contenido;
        newsItem.appendChild(content);

        // Agregar botón de eliminar
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.classList.add('btn', 'btn-danger', 'delete-btn');
        deleteBtn.addEventListener('click', function() {
            deleteNews(noticia.idnoticias); // Llama a la función para eliminar la noticia
        });
        newsItem.appendChild(deleteBtn);

        // Agregar botón de editar
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Editar';
        editBtn.classList.add('btn', 'btn-primary', 'edit-btn');
        editBtn.addEventListener('click', function() {
            // Llama a la función para mostrar el formulario de edición de la noticia
            showEditNewsForm(noticia);
        });
        newsItem.appendChild(editBtn);

        return newsItem;
    }

    // Función para mostrar el formulario de agregar noticias
    function showAddNewsForm() {
        $('#addNewsModal').modal('show'); // Muestra el modal de agregar noticias
    }

// Función para mostrar el formulario de edición de noticias
function showEditNewsForm(noticia) {
    // Mostrar el modal de editar noticias
    $('#editNewsModal').modal('show');

    // Prellenar los campos del formulario con la información de la noticia a editar
    document.getElementById('editNewsId').value = noticia.idnoticias;
    document.getElementById('editTitle').value = noticia.titulo;
    document.getElementById('editSubtitle').value = noticia.subtitulo;
    document.getElementById('editContent').value = noticia.contenido;
    document.getElementById('editImageUrl').value = noticia.url[0];
    document.getElementById('editFecha').value = noticia.fecha;

    // Obtener el botón de guardar cambios
    const updateNewsBtn = document.getElementById('updateNewsBtn');

    // Agregar un evento de clic al botón de guardar cambios
    updateNewsBtn.addEventListener('click', async function() {
        // Obtener los valores actualizados del formulario
        const updatedTitle = document.getElementById('editTitle').value;
        const updatedSubtitle = document.getElementById('editSubtitle').value;
        const updatedContent = document.getElementById('editContent').value;
        const updatedImageUrl = document.getElementById('editImageUrl').value;
        const updatedFecha = document.getElementById('editFecha').value;

        // Crear un objeto con los campos modificados
        const updatedFields = {};
        if (updatedTitle !== noticia.titulo) {
            updatedFields['titulo'] = updatedTitle;
        }
        if (updatedSubtitle !== noticia.subtitulo) {
            updatedFields['subtitulo'] = updatedSubtitle;
        }
        if (updatedContent !== noticia.contenido) {
            updatedFields['contenido'] = updatedContent;
        }
 
        if (updatedFecha !== noticia.fecha) {
            updatedFields['fecha'] = updatedFecha;
        }
        if (updatedImageUrl !== noticia.url[0]) {
            updatedFields['url'] = [{ url: updatedImageUrl }]; // Enviar la URL como un objeto JSON
        }
        // Verificar si hay campos modificados
        if (Object.keys(updatedFields).length > 0) {
            // Actualizar la noticia en el servidor con los campos actualizados
            try {
                const response = await updateNewsField(noticia.idnoticias, updatedFields);
                if (!response.ok) {
                    throw new Error('No se pudo actualizar la noticia');
                }
                // Si la respuesta es exitosa, cerrar el modal y recargar las noticias para mostrar los cambios
                $('#editNewsModal').modal('hide');
                loadNews();
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
function updateNewsField(noticiaId, updatedFields) {
    const url = `http://127.0.0.1:5000/noticia/${noticiaId}`;
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
    function deleteNews(newsId) {
        // Realizar una solicitud DELETE para eliminar la noticia del servidor
        fetch(`http://127.0.0.1:5000/noticia/${newsId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo eliminar la noticia');
            }
            // Si la respuesta es exitosa, recargar las noticias para reflejar el cambio
            loadNews();
        })
        .catch(error => {
            console.error('Error al eliminar la noticia:', error);
        });
    }

// Obtener el botón de guardar
const saveNewsBtn = document.getElementById('saveNewsBtn');

// Agregar un evento de clic al botón de guardar
saveNewsBtn.addEventListener('click', function() {
    // Obtener los valores del formulario
    const title = document.getElementById('title').value;
    const subtitle = document.getElementById('subtitle').value;
    const content = document.getElementById('content').value;
    const imageUrl = document.getElementById('imageUrl').value;
    const fecha = document.getElementById('fecha').value;

    // Crear un objeto con los datos del formulario
    const formData = {
        titulo: title,
        subtitulo: subtitle,
        contenido: content,
        fecha: fecha,
        url: [imageUrl] // Convertir la URL de la imagen en un arreglo para que coincida con el formato esperado
    };

    // Realizar una solicitud POST para crear una nueva noticia
    fetch('http://127.0.0.1:5000/noticia/crear', {
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
        document.getElementById('addNewsForm').reset();
        $('#addNewsModal').modal('hide');
        // Recargar las noticias para mostrar la nueva noticia agregada
        loadNews();
    })
    .catch(error => {
        console.error('Error al crear la noticia:', error);
    });
});

// Obtener el botón de actualizar imágenes del modal de agregar noticias
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

});
