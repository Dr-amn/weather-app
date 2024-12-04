var placeholder = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";

function fetchWeatherData(location) {
    let promise = new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(
            'GET',
            `https://api.weatherapi.com/v1/forecast.json?key=7a47e755def844dea2e123856241911&q=${location}&days=3&aqi=no&alerts=no`
        );
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(JSON.parse(xhr.response));
            } else {
                reject('Error: Failed to load data');
            }
        };
        xhr.send();
    });

    promise
        .then((data) => {
            console.log(data);

            // HERO
            const dateVar = new Date(data.forecast.forecastday[0].date);
            const dayVar = dateVar.toLocaleDateString(undefined, { weekday: 'long' });

            const imgHero = data.current.condition.icon;
            const fileNameWithExtension = imgHero.split('/').pop(); // "296.png"
            const fileName = fileNameWithExtension.split('.')[0]; // "296"

            document.getElementById('weatherHeroDay').textContent = dayVar;
            document.getElementById('weatherHeroDate').textContent = data.forecast.forecastday[0].date;
            document.getElementById('weatherHeroTemp').textContent = data.current.temp_c + "°C";
            document.getElementById('weatherHeroAtmosphere').textContent = data.current.condition.text;
            document.getElementById('weatherHeroImage').src = "ico/" + fileName + ".svg";

            //FORECAST ONE
            const dateOneVar = new Date(data.forecast.forecastday[1].date);
            const dayOneVar = dateOneVar.toLocaleDateString(undefined, { weekday: 'long' });

            const imgOne = data.forecast.forecastday[1].day.condition.icon;
            const fileNameWithExtensionOne = imgOne.split('/').pop(); // "296.png"
            const fileNameOne = fileNameWithExtensionOne.split('.')[0]; // "296"

            document.getElementById('weatherOneDay').textContent = dayOneVar;
            document.getElementById('weatherOneAtmosphere').textContent = data.forecast.forecastday[1].day.condition.text;
            document.getElementById('weatherOneTemp').textContent = data.forecast.forecastday[1].day.avgtemp_c+"°C";
            document.getElementById('weatherOneImage').src = "ico/" + fileNameOne + ".svg";

            //FORECAST TWO
            const dateTwoVar = new Date(data.forecast.forecastday[2].date);
            const dayTwoVar = dateTwoVar.toLocaleDateString(undefined, { weekday: 'long' });

            const imgTwo = data.forecast.forecastday[2].day.condition.icon;
            const fileNameWithExtensionTwo = imgTwo.split('/').pop(); // "296.png"
            const fileNameTwo = fileNameWithExtensionTwo.split('.')[0]; // "296"

            document.getElementById('weatherTwoDay').textContent = dayTwoVar;
            document.getElementById('weatherTwoAtmosphere').textContent = data.forecast.forecastday[2].day.condition.text;
            document.getElementById('weatherTwoTemp').textContent = data.forecast.forecastday[2].day.avgtemp_c+"°C";
            document.getElementById('weatherTwoImage').src = "ico/" + fileNameTwo + ".svg";

            // Update the input placeholder to show the country
            const countryVar = document.getElementById('weatherInput');
            countryVar.placeholder = data.location.name;
            countryVar.addEventListener('click', () => {
              countryVar.value="";
          });
        })
        .catch((error) => {
            console.error(error);
        });
}

// Get the user's location
function fetchUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const location = `${lat},${lon}`; // Format for WeatherAPI
                fetchWeatherData(location); // Fetch weather data for the user's location
            },
            (error) => {
                console.error('Geolocation error:', error);
                fetchWeatherData('Brussels'); // Fallback to Brussels if geolocation fails
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
        fetchWeatherData('Brussels'); // Fallback to Brussels if geolocation is unavailable
    }
}

// Add event listener to the input field
const countryVar = document.getElementById('weatherInput');
countryVar.addEventListener('input', () => {
    const valueInputWeather = countryVar.value.trim(); // Get the input value and trim whitespace
    if (valueInputWeather) {
        console.log("Fetching data for:", valueInputWeather);
        fetchWeatherData(valueInputWeather); // Fetch weather data for the entered location
    }
});

// Initial fetch based on user's location or fallback
fetchUserLocation();


// Gestion de l'installation de l'application
let deferredPrompt;
const installButton = document.getElementById('installButton')
installButton.style.display = 'none';
installButton.textContent = 'Installer l\'application';

const popup = document.getElementById('pop-up');
popup.style.display = 'none';

const closepopup = document.getElementById('pop-up-close');

closepopup.addEventListener('click', () => {
    popup.style.display = 'none';
});

// Détection si l'installation est possible
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Vérification de la plateforme
    const isAppleDevice = /iPhone|iPad|iPod|Mac/.test(navigator.userAgent);

    if (isAppleDevice) {
        console.log("You are using an Apple device.");
        installButton.disabled = true;
        popup.style.display = 'flex';
    } else {
        console.log("You are not using an Apple device.");
        installButton.style.display = 'flex';
        popup.disabled = true;
    }
    
    
    document.body.appendChild(installButton);
});

// Gestion du clic sur le bouton d'installation
installButton.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    
    const result = await deferredPrompt.prompt();
    console.log(`Installation ${result.outcome}`);
    deferredPrompt = null;
    installButton.style.display = 'none';
});

// Détection si l'app est déjà installée
window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    installButton.style.display = 'none';
});