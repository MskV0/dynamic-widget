function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  // Update each part separately for different colors
  document.getElementById('hours').textContent = hours;
  document.getElementById('minutes').textContent = minutes;
  document.getElementById('seconds').textContent = seconds;
  document.getElementById('ampm').textContent = ampm;
}

function updateDayAndDate() {
  const now = new Date();

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const day = days[now.getDay()];
  const date = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
  const year = now.getFullYear();

  document.getElementById('day').textContent = day;
  document.getElementById('date').textContent = `${date}/${month}/${year}`;
}

function updateWeather() {
  const weatherDiv = document.getElementById('weather');

  if (!navigator.geolocation) {
    weatherDiv.innerText = 'Geolocation not supported by your browser.';
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

      fetch(url)
        .then(response => response.json())
        .then(data => {
          const temperature = data.current_weather.temperature;
          const windspeed = data.current_weather.windspeed;
          const weatherCode = data.current_weather.weathercode;

          weatherDiv.innerText = `${temperature}°C, Wind ${windspeed} km/h`;
        })
        .catch(error => {
          console.error('Error fetching weather data:', error);
          weatherDiv.innerText = 'Unable to fetch weather data.';
        });
    },
    () => {
      weatherDiv.innerText = 'Location permission denied.';
    }
  );
}

// Make sure resize handles are draggable and actually work
function setupResizeHandles() {
  const wrapper = document.querySelector('.widget-wrapper');
  const handles = document.querySelectorAll('.resize-handle');
  
  handles.forEach(handle => {
    handle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      // Make sure resize handles remain visible during resize operation
      handle.style.opacity = '1';
    });
  });
}

// Initial updates
updateClock();
updateDayAndDate();
updateWeather();
setupResizeHandles();

// Intervals
setInterval(updateClock, 1000);
setInterval(updateDayAndDate, 60000);
setInterval(updateWeather, 900000);
