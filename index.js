// d982b206b7125a363d94918d08ebf560 - my API key
// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key} - погода в даний момент.
// http://api.openweathermap.org/data/2.5/forecast?q=${city name}&appid={API key} - погода погодинно.
let wrapper = document.querySelector('.wrapper')
let cityDefault = "lviv";
let city = "";

const DAYS =  {
  0: "Tusday",
  1: "Monaday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
}

const key = "ca16aa945ebdea4f126db5ca6372a64d";



const fetchWeatherInit = async () =>{

  let resp = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city || cityDefault}&appid=${key}`);
  if (resp.ok === true) {
    const data = await resp.json();
    console.log(resp);
    return data;
  } else {

    resp = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityDefault}&appid=${key}`);
    const data = await resp.json();
    return data;
  }
}

const fetchWeatherComponent = async () =>{

  let resp = await fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city || cityDefault}&appid=${key}`);
  if (resp.ok === true) {
    const data = await resp.json();
    console.log(resp);
    return data;

  } else {
    alert('Ви ввели не існуюче місто');
    resp = await fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${cityDefault}&appid=${key}`);
    const data = await resp.json();
    return data;
  }
}


fetchWeatherInit().then((data) => {
  console.log(data)
  init(data);
})

fetchWeatherComponent().then((data) =>{
  dailyWeather(data)
})


const init = (data) => {

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
  right_block_wrapper = document.querySelector('.right-block-wrapper')
  hourly_forecast_wrapper = document.querySelector('.hourly-forecast-wrapper')

  function temperature() {
      let getTemp = data.main.temp
      let tempC = Math.floor(getTemp) - 273
      return tempC
  }
  console.log('перезапуск')
}


const dailyWeather = (data) => {

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

  for(let i = 0; i < 40; i += 8){
    const DayDate = () =>{
      let day = new Date(data.list[i].dt_txt).getDay();
      return DAYS[day];
    }

    const dayTemplate = () =>{
      return `
      <div class="day-weather-wrapper">
        <div class="data-time">${DayDate()}</div>
        <img class='weather-img' src="http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png"></img>
        <div class="temp-wrapper">
          <div class="max-temp">${Math.floor(data.list[i].main.temp_max - 273)}°</div>
        </div>

      </div>
    `
    }
    right_block_wrapper.innerHTML += dayTemplate();
  }
}

document.addEventListener('keydown', (e) => {
  if(e.key === 'Enter') {
    let searchInp = document.querySelector('.search')
    let value = searchInp.value;
    if(!value){
      console.log("noo")
      return false;

    } else{

      city = value;
      fetchWeatherInit().then((data) => {
        init(data)
      })
      fetchWeatherComponent().then((data) =>{
        dailyWeather(data)
      })
    }
  }
})


setInterval(() => {
  fetchWeatherInit().then((data) => {
    init(data)
  });
  fetchWeatherComponent().then((data) =>{
    dailyWeather(data)
  });
}, 600000) //Обновяємо інфу кожні 10 хвилин
