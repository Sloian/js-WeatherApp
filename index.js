// d982b206b7125a363d94918d08ebf560 - my API key
// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key} - погода в даний момент.
// http://api.openweathermap.org/data/2.5/forecast?q=${city name}&appid={API key} - погода погодинно.

let wrapper = document.querySelector('.wrapper')
let city = "Ternopil";
const key = "ca16aa945ebdea4f126db5ca6372a64d";

const dailyWeather = () => {
  fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}`)
  .then(resp => resp.json())
  .then(data =>{

    right_block_wrapper = document.querySelector('.right-block-wrapper')
    hourly_forecast_wrapper = document.querySelector('.hourly-forecast-wrapper')
    right_block_wrapper.innerHTML = "";
    hourly_forecast_wrapper.innerHTML = "";

    for (let index = 0; index < 6; index++) {

      const hourlyForecast = () =>{
        return `
        <div class="hourly-forecast-item">
          <div class="hourly-time">${data.list[index].dt_txt.slice(11,16)}</div>
          <div class="hourly-wrapper-time">
            <img class='hourly-icon' src="http://openweathermap.org/img/w/${data.list[index].weather[0].icon}.png"></img>
            <div class="hourly-temp">${Math.floor(data.list[index].main.temp_max - 273)}°</div>
          </div>
          </div>
        `
      }
      hourly_forecast_wrapper.innerHTML += hourlyForecast();
    }

    for(step = 0; step < 40; step+=8){
      const DayDate = () =>{
        let day = new Date(data.list[step].dt_txt);
        let days = day.getDay();
        console.log(days)
        switch(days){
          case 0:
            days ='Sunday';
          break;
          case 1:
            days ='Monday';
          break;
          case 2:
            days ='Tuesday';
          break;
          case 3:
            days = 'Wednesday';
          break;
          case 4:
            days = 'Thursday';
          break;
          case 5:
            days ='Friday';
          break;
          case 6:
            days ='Saturday';
          break;
        }
        return days;
      }

      const dayTemplate = () =>{
        return `
        <div class="day-weather-wrapper">
          <div class="data-time">${DayDate()}</div>
          <img class='weather-img' src="http://openweathermap.org/img/w/${data.list[step].weather[0].icon}.png"></img>
          <div class="temp-wrapper">
            <div class="max-temp">${Math.floor(data.list[step].main.temp_max - 273)}°</div>
          </div>

        </div>
      `
      }
      right_block_wrapper.innerHTML += dayTemplate();
    }
  })
}

document.addEventListener('keydown', (e) => {
  if(e.key === 'Enter') {
      let searchInp = document.querySelector('.search')
      let value = searchInp.value;
      console.log(value)
      if(!value) return false;
      city = value;
      console.log(city);
      init();
      dailyWeather();
      searchInp.value = '';
  }
})

const init = () => {

  fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`)
  .then((resp) => {return resp.json()})
  .then((data) => {

    const getTemplate = () =>{
      return `

        <input class="search" id="search" placeholder="search" autocomplete="off" autofocus></input>
        <div class="weather-wrapper">
          <div class="left-block-wrapper">

            <div class="info-block">
              <p id='city' class="city">${data.name}, ${data.sys.country}</p>
              <img class='weather-img' src="http://openweathermap.org/img/w/` + data.weather[0].icon + `.png "></img>
              <h1 id='temp' class="temperature">${temperature()}°</h1>
              <p id="main-weather" class="main-weather">${data.weather[0].main}</p>
              <div class="wind-wrapper">
                <p>Wind</p>
                <p><i class="bi bi-wind"></i><span class="wind-speed">${Math.round(data.wind.speed)}m/s</span></p>
              </div>
            </div>
          </div>

          <div class="hourly-forecast-wrapper">
          </div>

        </div>

        <div class="right-block-wrapper">
        </div>
      `
    }

    wrapper.innerHTML = "";
    wrapper.innerHTML = getTemplate();

    function temperature() {
        let getTemp = data.main.temp
        let tempC = Math.floor(getTemp) - 273
        return tempC
    }

    console.log('перезапуск')
  })
  .catch(() => {
      alert('This city not found')
      city = 'Ternopil';
      init()
      dailyWeather()
      searchInp.value = ' '
  })
}

init()
dailyWeather()

setInterval(() => {
  dailyWeather();
  init();
}, 600000) //Обновяємо інфу кожні 10 хвилин

