document.addEventListener('DOMContentLoaded', () => {

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



let deferredPrompt;
const installButton = document.getElementById('installButton')
installButton.style.display = 'none';

const appleInstallButton = document.getElementById('appleInstallButton')
appleInstallButton.style.display = 'none';

const md = new MobileDetect(window.navigator.userAgent);

// Détection si l'installation est possible
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

  // Comprehensive device check
  function handleMobileDevice() {
    if (md.mobile()) {     
      if (md.is('iOS')) {
        //alert('iOS device');
       appleInstallButton.style.display = 'flex';

      } else if (md.is('AndroidOS')) {
        //alert('Android device');
        installButton.style.display = 'flex';

      }
    }
  }
 
  handleMobileDevice();
        
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
    appleInstallButton.style.display = 'none';
});


// POPUP EVENT
const popup = document.getElementById('popup');
popup.style.display = 'none';

appleInstallButton.addEventListener('click', () => {
    popup.style.display = 'flex';
});

const popupClose = document.getElementById('popupClose');

popupClose.addEventListener('click', () => {
    popup.style.display = 'none';
});

const popupDone = document.getElementById('popupDone');

popupDone.addEventListener('click', () => {
    popup.style.display = 'none';
    appleInstallButton.style.display = 'none';

});


// DOM LOADER END
});