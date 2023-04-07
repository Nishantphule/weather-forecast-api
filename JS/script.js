// api key
function apikey() {
  return 'f4049656624f8252a31c89dda51daa4b'
}

// weather fetching using city name from input
async function weatherFetch(city) {

  const cardDiv = document.querySelector(".weather")

  // creating a element for loading text
  const loading = document.createElement("span")
  loading.innerHTML = '<div class="spinner-border"></div>'
  cardDiv.appendChild(loading)

  // fetching api
  const weather = await fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apikey())

  cardDiv.removeChild(loading)

  const res = await weather.json()
  // manipulating weather details in html elements
  const { name } = res;
  const { country } = res.sys;
  const { icon, description } = res.weather[0];
  const { temp, humidity } = res.main;
  const { speed } = res.wind;
  let celcius = temp - 273.15
  document.querySelector(".city").innerText = "Weather in " + name;
  document.querySelector(".country").innerText = ", " + country
  document.querySelector(".temp").innerText = celcius.toFixed(0) + " °C";
  document.querySelector(".pic").src = "https://openweathermap.org/img/wn/" + icon + ".png";
  document.querySelector(".description").innerText = description;
  document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
  document.querySelector(".wind").innerText = "Wind speed: " + speed + " km/h";
  document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900?" + name + " ')"

}

// btn event listener
document.querySelector(".btn").addEventListener('click', async (e) => {
  e.preventDefault()
  const city = document.querySelector(".search-bar").value

  const weather = await fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apikey())

  const data = await weather.json()

  if (data.cod === 200) {
    weatherFetch(city);
  }
  else {
    document.querySelector(".search-bar").value = "City Not Found"
  }


})

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(async function(position){
    if(position){
      const {latitude,longitude} = position.coords
      console.log(position.coords)
      const weather = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}` + "&appid=" + apikey())

      const res = await weather.json()
      const {name} = res
      console.log(name)
    }
    else{
      weatherFetch("Delhi")
    }
  });
}
weatherFetch("Delhi")



