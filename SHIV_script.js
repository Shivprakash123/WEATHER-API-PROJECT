const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const todaysweatherdetailsEl = document.getElementById('todays-weather-details');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const todaysTempEl = document.getElementById('todays-temp');


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const API_KEY = 'd9532a158f4372914b01748c05c4c356';

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const ampm = hour >= 12 ? 'PM' : 'AM'

    timeEl.innerHTML = (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds) + ' ' + `<span id="am-pm">${ampm}</span>`
    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month] + ' ' + time.getFullYear()

}, 1000);

getWeatherData()

function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {

        let { latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {

            console.log(data)
            showWeatherData(data);
        })

    })
}

function showWeatherData(data) {
    let { humidity, sunrise, sunset, wind_speed } = data.current;

    timezone.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat + 'N ' + data.lon + 'E'

    todaysweatherdetailsEl.innerHTML =
        `<div class="weather-details">
        <div><center>Humidity</center></div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-details">
        <div><center>Wind Speed</center></div>
        <div>${wind_speed}</div>
    </div>

    <div class="weather-details">
        <div><center>Sunrise</center></div>
        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-details">
        <div><center>Sunset</center></div>
        <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
    </div>`;

    let otherDayForcast = ''
    data.daily.forEach((day, idx) => {
        if (idx == 0) {
            todaysTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn/11d@2x.png" alt="weather icon" class="w-icon">
            <div class="details">
                <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                <div class="temp">Day ${idx} - ${day.temp.day}&#176;C</div>
            </div>
            
            `
        } else {
            otherDayForcast += `
            <div class="weather-forecast-details">
                <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                <img src="http://openweathermap.org/img/wn/11d@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Day ${idx} - ${day.temp.day}&#176;C</div>
            </div>
            
            `
        }
    })


    weatherForecastEl.innerHTML = otherDayForcast;
}