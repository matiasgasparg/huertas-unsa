document.addEventListener('DOMContentLoaded', function() {
    // Llamada a la API de AccuWeather para obtener el pronóstico por hora
    fetch('https://dataservice.accuweather.com/forecasts/v1/hourly/1hour/10531?apikey=VLf2WhKmgx5Dfbdn9GvQ0arMJmrvSwYF&language=es-es&details=false&metric=true')
        .then(response => response.json())
        .then(data => {
            // Manejar los datos de respuesta
            const dateTime = new Date(data[0].DateTime); // Convertir la cadena de fecha y hora en un objeto de fecha
            const dayOfWeek = getDayOfWeek(dateTime.getDay()); // Obtener el día de la semana
            const hour = dateTime.getHours(); // Obtener la hora
            const temperature = data[0].Temperature.Value;
            const iconPhrase = data[0].IconPhrase;
            const precipitationProbability = data[0].PrecipitationProbability;
            const iconCode = data[0].WeatherIcon; // Obtener el código de icono

            const iconUrl = getIconUrl(iconCode); // Obtener la URL del icono basada en el código

            // Actualizar el contenido del elemento HTML con los datos obtenidos
            document.getElementById('datetime').innerText = `Día: ${dayOfWeek}, Hora: ${hour} hs`; // Mostrar solo el día de la semana y la hora
            document.getElementById('min-temperature').innerText = `Temperatura: ${temperature}°C`;
            document.getElementById('max-temperature').innerText = `Estado del cielo: ${iconPhrase}`;
            document.getElementById('day-icon-phrase').innerText = `Probabilidad de precipitación: ${precipitationProbability}%`;

            // Crear un elemento <img> para mostrar el icono de clima
            const weatherIcon = document.createElement('img');
            weatherIcon.src = iconUrl;
            weatherIcon.alt = "Icono de clima";

            // Aplicar estilos al icono
            weatherIcon.style.width = "100px"; // Reducir el ancho del icono a la mitad
            weatherIcon.style.height = "auto"; // Altura automática para mantener la proporción
            weatherIcon.style.position = "absolute"; // Establecer posición absoluta
            weatherIcon.style.right = "100px"; // Alinear a la derecha
            weatherIcon.style.bottom = "90px"; // Alinear en la parte inferior
            weatherIcon.style.zIndex = "-1"; // Establecer z-index para colocar detrás del texto

            document.getElementById('weather-icon').appendChild(weatherIcon); // Agregar el icono al elemento HTML    
        })
        .catch(error => {
            console.error('Se produjo un error al obtener los datos:', error);
        });
});

// Función para obtener el día de la semana a partir de su número
function getDayOfWeek(dayIndex) {
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return daysOfWeek[dayIndex];
}

// Función para obtener la URL del icono basada en el código de icono
function getIconUrl(iconCode) {
    return `https://www.awxcdn.com/adc-assets/images/weathericons/${iconCode}.svg`;
}
