const uploadImage = async (file) => {
    try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('https://unsahuertas.pythonanywhere.com/imagen/', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Error al subir la imagen');
        }

        const data = await response.json();
        const fileName = data.fileName;
        const storageUrl = `https://firebasestorage.googleapis.com/v0/b/huertas-salta-unsa.appspot.com/o/${encodeURIComponent(fileName)}?alt=media`;

        return storageUrl;
    } catch (error) {
        console.error('Error al enviar la imagen:', error);
        return null;
    }
};
