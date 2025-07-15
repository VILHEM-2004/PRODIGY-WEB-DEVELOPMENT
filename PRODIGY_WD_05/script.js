// Weather Application JavaScript
class WeatherApp {
    constructor() {
        this.apiKey = '9fab2863c9be3783667794aa31094d4a';
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
        this.oneCallUrl = 'https://api.openweathermap.org/data/3.0/onecall';
        this.currentUnit = 'metric'; // 'metric' for Celsius, 'imperial' for Fahrenheit
        this.currentTheme = 'light';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadTheme();
        this.getCurrentLocationWeather();
        this.updateDateTime();
        
        // Update time every minute
        setInterval(() => this.updateDateTime(), 60000);
    }

    setupEventListeners() {
        // Search functionality
        document.getElementById('searchBtn').addEventListener('click', () => this.searchWeather());
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchWeather();
        });

        // Location button
        document.getElementById('locationBtn').addEventListener('click', () => this.getCurrentLocationWeather());

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // Unit toggle
        document.getElementById('unitToggle').addEventListener('click', () => this.toggleUnit());
    }

    showLoading() {
        document.getElementById('loading').classList.add('show');
        document.getElementById('mainContent').classList.remove('show');
        document.getElementById('errorMessage').classList.remove('show');
    }

    hideLoading() {
        document.getElementById('loading').classList.remove('show');
    }

    showError(message) {
        document.getElementById('errorText').textContent = message;
        document.getElementById('errorMessage').classList.add('show');
        document.getElementById('mainContent').classList.remove('show');
        this.hideLoading();
    }

    showContent() {
        document.getElementById('mainContent').classList.add('show');
        document.getElementById('errorMessage').classList.remove('show');
        this.hideLoading();
    }

    async getCurrentLocationWeather() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by this browser.');
            return;
        }

        this.showLoading();
        
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    await this.fetchWeatherByCoords(latitude, longitude);
                } catch (error) {
                    this.showError('Failed to fetch weather data. Please try again.');
                }
            },
            (error) => {
                let errorMessage = 'Unable to retrieve your location. ';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Location access was denied.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Location request timed out.';
                        break;
                    default:
                        errorMessage += 'An unknown error occurred.';
                        break;
                }
                this.showError(errorMessage);
            }
        );
    }

    async searchWeather() {
        const query = document.getElementById('searchInput').value.trim();
        if (!query) {
            this.showError('Please enter a city name.');
            return;
        }

        this.showLoading();
        
        try {
            const response = await fetch(
                `${this.baseUrl}/weather?q=${encodeURIComponent(query)}&appid=${this.apiKey}&units=${this.currentUnit}`
            );

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('City not found. Please check the spelling and try again.');
                } else if (response.status === 401) {
                    throw new Error('Invalid API key. Please check your configuration.');
                } else {
                    throw new Error('Failed to fetch weather data. Please try again.');
                }
            }

            const data = await response.json();
            await this.fetchWeatherByCoords(data.coord.lat, data.coord.lon);
            
        } catch (error) {
            this.showError(error.message);
        }
    }

    async fetchWeatherByCoords(lat, lon) {
        try {
            // Fetch current weather
            const currentResponse = await fetch(
                `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=${this.currentUnit}`
            );

            if (!currentResponse.ok) {
                throw new Error('Failed to fetch current weather data.');
            }

            const currentData = await currentResponse.json();

            // Fetch forecast data
            const forecastResponse = await fetch(
                `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=${this.currentUnit}`
            );

            if (!forecastResponse.ok) {
                throw new Error('Failed to fetch forecast data.');
            }

            const forecastData = await forecastResponse.json();

            // Update UI with weather data
            this.updateCurrentWeather(currentData);
            this.updateHourlyForecast(forecastData);
            this.updateDailyForecast(forecastData);
            this.updateWeatherDetails(currentData);
            
            this.showContent();
            
        } catch (error) {
            this.showError(error.message);
        }
    }

    updateCurrentWeather(data) {
        const unitSymbol = this.currentUnit === 'metric' ? '°C' : '°F';
        const windUnit = this.currentUnit === 'metric' ? 'km/h' : 'mph';
        const visibilityUnit = this.currentUnit === 'metric' ? 'km' : 'miles';

        document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
        document.getElementById('currentTemp').textContent = `${Math.round(data.main.temp)}${unitSymbol}`;
        document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}${unitSymbol}`;
        document.getElementById('weatherDescription').textContent = data.weather[0].description;
        document.getElementById('humidity').textContent = `${data.main.humidity}%`;
        document.getElementById('windSpeed').textContent = `${Math.round(data.wind.speed * (this.currentUnit === 'metric' ? 3.6 : 1))} ${windUnit}`;
        document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
        document.getElementById('visibility').textContent = `${Math.round(data.visibility / (this.currentUnit === 'metric' ? 1000 : 1609))} ${visibilityUnit}`;
        
        // Update weather icon
        const iconElement = document.getElementById('mainWeatherIcon');
        iconElement.className = this.getWeatherIcon(data.weather[0].icon);
    }

    updateHourlyForecast(data) {
        const hourlyContainer = document.getElementById('hourlyForecast');
        hourlyContainer.innerHTML = '';

        // Get next 24 hours (8 items, 3-hour intervals)
        const hourlyData = data.list.slice(0, 8);
        const unitSymbol = this.currentUnit === 'metric' ? '°C' : '°F';

        hourlyData.forEach(item => {
            const time = new Date(item.dt * 1000);
            const hourlyItem = document.createElement('div');
            hourlyItem.className = 'hourly-item fade-in';
            
            hourlyItem.innerHTML = `
                <div class="hourly-time">${time.getHours()}:00</div>
                <div class="hourly-icon">
                    <i class="${this.getWeatherIcon(item.weather[0].icon)}"></i>
                </div>
                <div class="hourly-temp">${Math.round(item.main.temp)}${unitSymbol}</div>
            `;
            
            hourlyContainer.appendChild(hourlyItem);
        });
    }

    updateDailyForecast(data) {
        const dailyContainer = document.getElementById('dailyForecast');
        dailyContainer.innerHTML = '';

        // Group forecast data by day
        const dailyData = this.groupForecastByDay(data.list);
        const unitSymbol = this.currentUnit === 'metric' ? '°C' : '°F';

        dailyData.slice(0, 5).forEach(day => {
            const date = new Date(day.dt * 1000);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            
            const dailyItem = document.createElement('div');
            dailyItem.className = 'daily-item fade-in';
            
            dailyItem.innerHTML = `
                <div class="daily-info">
                    <div class="daily-date">${dayName}</div>
                    <div class="daily-icon">
                        <i class="${this.getWeatherIcon(day.weather[0].icon)}"></i>
                    </div>
                    <div class="daily-desc">${day.weather[0].description}</div>
                </div>
                <div class="daily-temps">
                    <span class="daily-high">${Math.round(day.main.temp_max)}${unitSymbol}</span>
                    <span class="daily-low">${Math.round(day.main.temp_min)}${unitSymbol}</span>
                </div>
            `;
            
            dailyContainer.appendChild(dailyItem);
        });
    }

    updateWeatherDetails(data) {
        const sunrise = new Date(data.sys.sunrise * 1000);
        const sunset = new Date(data.sys.sunset * 1000);
        
        document.getElementById('sunrise').textContent = sunrise.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        document.getElementById('sunset').textContent = sunset.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        document.getElementById('cloudCover').textContent = `${data.clouds.all}%`;
        
        // Calculate UV Index (simplified - actual calculation would require additional API call)
        const uvIndex = Math.round(Math.random() * 10); // Placeholder
        document.getElementById('uvIndex').textContent = uvIndex;
    }

    groupForecastByDay(forecastList) {
        const grouped = {};
        
        forecastList.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dayKey = date.toDateString();
            
            if (!grouped[dayKey]) {
                grouped[dayKey] = {
                    dt: item.dt,
                    main: {
                        temp_min: item.main.temp_min,
                        temp_max: item.main.temp_max
                    },
                    weather: item.weather
                };
            } else {
                grouped[dayKey].main.temp_min = Math.min(grouped[dayKey].main.temp_min, item.main.temp_min);
                grouped[dayKey].main.temp_max = Math.max(grouped[dayKey].main.temp_max, item.main.temp_max);
            }
        });
        
        return Object.values(grouped);
    }

    getWeatherIcon(iconCode) {
        const iconMap = {
            '01d': 'fas fa-sun',
            '01n': 'fas fa-moon',
            '02d': 'fas fa-cloud-sun',
            '02n': 'fas fa-cloud-moon',
            '03d': 'fas fa-cloud',
            '03n': 'fas fa-cloud',
            '04d': 'fas fa-cloud',
            '04n': 'fas fa-cloud',
            '09d': 'fas fa-cloud-rain',
            '09n': 'fas fa-cloud-rain',
            '10d': 'fas fa-cloud-sun-rain',
            '10n': 'fas fa-cloud-moon-rain',
            '11d': 'fas fa-bolt',
            '11n': 'fas fa-bolt',
            '13d': 'fas fa-snowflake',
            '13n': 'fas fa-snowflake',
            '50d': 'fas fa-smog',
            '50n': 'fas fa-smog'
        };
        
        return iconMap[iconCode] || 'fas fa-question';
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        const themeIcon = document.querySelector('#themeToggle i');
        themeIcon.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        
        // Save theme preference
        localStorage.setItem('weatherAppTheme', this.currentTheme);
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('weatherAppTheme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
            document.documentElement.setAttribute('data-theme', this.currentTheme);
            
            const themeIcon = document.querySelector('#themeToggle i');
            themeIcon.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    toggleUnit() {
        this.currentUnit = this.currentUnit === 'metric' ? 'imperial' : 'metric';
        
        const unitLabel = document.querySelector('.unit-label');
        unitLabel.textContent = this.currentUnit === 'metric' ? '°C' : '°F';
        
        // Re-fetch weather data with new unit
        if (document.getElementById('mainContent').classList.contains('show')) {
            // If we have current weather data, refresh it
            this.getCurrentLocationWeather();
        }
    }

    updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        
        document.getElementById('dateTime').textContent = now.toLocaleDateString('en-US', options);
    }
}

// Initialize the weather app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});

// Add some utility functions for enhanced functionality
class WeatherUtilities {
    static getWindDirection(degrees) {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        return directions[Math.round(degrees / 22.5) % 16];
    }

    static getAirQualityDescription(aqi) {
        const descriptions = {
            1: 'Good',
            2: 'Fair',
            3: 'Moderate',
            4: 'Poor',
            5: 'Very Poor'
        };
        return descriptions[aqi] || 'Unknown';
    }

    static getUVIndexDescription(uvi) {
        if (uvi <= 2) return 'Low';
        if (uvi <= 5) return 'Moderate';
        if (uvi <= 7) return 'High';
        if (uvi <= 10) return 'Very High';
        return 'Extreme';
    }

    static formatTime(timestamp) {
        return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    static getWeatherAdvice(weatherCode, temperature) {
        const advice = {
            clear: 'Perfect day for outdoor activities!',
            clouds: 'Partly cloudy, great for a walk.',
            rain: 'Don\'t forget your umbrella!',
            snow: 'Drive carefully and dress warmly.',
            thunderstorm: 'Stay indoors if possible.',
            mist: 'Visibility may be reduced.'
        };

        if (temperature < 0) {
            return 'Very cold! Bundle up and stay warm.';
        } else if (temperature > 30) {
            return 'Very hot! Stay hydrated and seek shade.';
        }

        return advice[weatherCode] || 'Have a great day!';
    }
}

// Add some keyboard shortcuts for better user experience
document.addEventListener('keydown', (e) => {
    // Press 'S' to focus search input
    if (e.key === 's' && !e.ctrlKey && !e.altKey && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
    
    // Press 'T' to toggle theme
    if (e.key === 't' && !e.ctrlKey && !e.altKey && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        document.getElementById('themeToggle').click();
    }
    
    // Press 'U' to toggle units
    if (e.key === 'u' && !e.ctrlKey && !e.altKey && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        document.getElementById('unitToggle').click();
    }
    
    // Press 'L' to get current location weather
    if (e.key === 'l' && !e.ctrlKey && !e.altKey && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        document.getElementById('locationBtn').click();
    }
});

// Add error handling for network issues
window.addEventListener('online', () => {
    console.log('Connection restored');
    // Optionally refresh weather data when connection is restored
});

window.addEventListener('offline', () => {
    console.log('Connection lost');
    // Show offline message or cache data
});
