// Weather App JavaScript

// OpenWeatherMap API Configuration
// Get your free API key from: https://openweathermap.org/api
const WEATHER_API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your API key
const DEFAULT_CITY = 'Tokyo';
const DEFAULT_COUNTRY = 'JP';

// Initialize the app
function initWeatherApp() {
    updateClock();
    setInterval(updateClock, 1000);
    
    // Load weather data
    if (WEATHER_API_KEY !== 'YOUR_API_KEY_HERE') {
        loadWeatherData();
        // Refresh every 10 minutes
        setInterval(loadWeatherData, 600000);
    } else {
        console.warn('Please add your OpenWeatherMap API key to weather.js');
        // Show placeholder data
    }
}

// Update clock in status bar
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        clockElement.textContent = `${hours}:${minutes}`;
    }
}

// Load weather data from API
async function loadWeatherData() {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${DEFAULT_CITY},${DEFAULT_COUNTRY}&units=metric&appid=${WEATHER_API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        
        const data = await response.json();
        updateWeatherDisplay(data);
    } catch (error) {
        console.error('Error loading weather:', error);
        showError('Unable to load weather data. Please check your API key.');
    }
}

// Update the weather display with API data
function updateWeatherDisplay(data) {
    // Location
    document.getElementById('location').textContent = 
        `${data.name.toUpperCase()}, ${data.sys.country}`;
    
    // Condition
    const condition = data.weather[0].description;
    document.getElementById('condition').textContent = condition;
    
    // Update weather icon based on condition
    updateWeatherIcon(data.weather[0].id, data.weather[0].icon);
    
    // Temperature
    document.getElementById('temperature').textContent = 
        `${Math.round(data.main.temp)}°C`;
    
    // Feels like
    document.getElementById('feels-like').textContent = 
        `${Math.round(data.main.feels_like)}°C`;
    
    // Humidity
    document.getElementById('humidity').textContent = 
        `${data.main.humidity}%`;
    
    // Precipitation (OpenWeatherMap provides rain/snow data)
    let precipitation = '0 mm';
    if (data.rain && data.rain['1h']) {
        precipitation = `${data.rain['1h']} mm`;
    } else if (data.snow && data.snow['1h']) {
        precipitation = `${data.snow['1h']} mm`;
    }
    document.getElementById('precipitation').textContent = precipitation;
    
    // Wind speed (convert m/s to km/h)
    const windSpeedKmh = (data.wind.speed * 3.6).toFixed(1);
    document.getElementById('wind-speed').textContent = `${windSpeedKmh} km/h`;
    
    // Wind direction
    const windDirection = getWindDirection(data.wind.deg);
    document.getElementById('wind-direction').textContent = windDirection;
    
    // Pressure
    document.getElementById('pressure').textContent = 
        `${data.main.pressure} hPa`;
    
    // Forecast time
    const now = new Date();
    const dataTime = new Date(data.dt * 1000);
    const minutesAgo = Math.floor((now - dataTime) / 60000);
    document.getElementById('forecast-time').textContent = 
        `Forecast as of ${minutesAgo} minutes ago`;
}

// Convert wind degrees to direction
function getWindDirection(degrees) {
    const directions = [
        'north', 'north-northeast', 'northeast', 'east-northeast',
        'east', 'east-southeast', 'southeast', 'south-southeast',
        'south', 'south-southwest', 'southwest', 'west-southwest',
        'west', 'west-northwest', 'northwest', 'north-northwest'
    ];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}

// Update weather icon based on condition code
function updateWeatherIcon(conditionCode, iconCode) {
    const iconElement = document.querySelector('.weather-icon span');
    
    // Map OpenWeatherMap condition codes to Material Design icons
    let iconClass = 'mdi-weather-cloudy'; // default
    
    if (conditionCode >= 200 && conditionCode < 300) {
        // Thunderstorm
        iconClass = 'mdi-weather-lightning';
    } else if (conditionCode >= 300 && conditionCode < 400) {
        // Drizzle
        iconClass = 'mdi-weather-rainy';
    } else if (conditionCode >= 500 && conditionCode < 600) {
        // Rain
        iconClass = 'mdi-weather-pouring';
    } else if (conditionCode >= 600 && conditionCode < 700) {
        // Snow
        iconClass = 'mdi-weather-snowy';
    } else if (conditionCode >= 700 && conditionCode < 800) {
        // Atmosphere (fog, mist, etc.)
        iconClass = 'mdi-weather-fog';
    } else if (conditionCode === 800) {
        // Clear
        if (iconCode.includes('n')) {
            iconClass = 'mdi-weather-night';
        } else {
            iconClass = 'mdi-weather-sunny';
        }
    } else if (conditionCode === 801) {
        // Few clouds
        if (iconCode.includes('n')) {
            iconClass = 'mdi-weather-night-partly-cloudy';
        } else {
            iconClass = 'mdi-weather-partly-cloudy';
        }
    } else if (conditionCode > 801) {
        // Cloudy
        iconClass = 'mdi-weather-cloudy';
    }
    
    iconElement.className = `mdi ${iconClass}`;
}

// Show error message
function showError(message) {
    const detailsSection = document.querySelector('.weather-details');
    detailsSection.innerHTML = `
        <div class="weather-error">
            <strong>Error:</strong> ${message}
        </div>
        <div style="margin-top: 20px; opacity: 0.7;">
            <p>To use this weather app:</p>
            <ol style="padding-left: 20px;">
                <li>Get a free API key from <a href="https://openweathermap.org/api" style="color: #e672df;">OpenWeatherMap</a></li>
                <li>Open weather.js</li>
                <li>Replace 'YOUR_API_KEY_HERE' with your API key</li>
            </ol>
        </div>
    `;
}

// Refresh weather button handler
document.addEventListener('DOMContentLoaded', () => {
    initWeatherApp();
    
    // Add refresh button listener
    const refreshBtn = document.querySelector('.mdi-refresh');
    if (refreshBtn) {
        refreshBtn.parentElement.addEventListener('click', () => {
            if (WEATHER_API_KEY !== 'YOUR_API_KEY_HERE') {
                loadWeatherData();
            } else {
                alert('Please add your API key first!');
            }
        });
    }
});
