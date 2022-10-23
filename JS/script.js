
function apikey(){
  return 'af65dba03e23ccd4e60c1594d9f6839f'
}

async function weatherFetch(city){
  const  weather =  await fetch("https://api.openweathermap.org/data/2.5/weather?q="+ city + "&appid=" + apikey())
  const res = await weather.json()
    const { name } = res;
    const { country } = res.sys
    const { icon, description } = res.weather[0];
    const { temp, humidity } = res.main;
    const { speed } = res.wind;
    let celcius = temp-273.15
    console.log(name,icon,description,temp,humidity,speed)
    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".country").innerText = ", "+country
    document.querySelector(".temp").innerText = celcius.toFixed(0) + " °C";
    document.querySelector(".pic").src = "https://openweathermap.org/img/wn/"+ icon +".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText = "Wind speed: "+ speed +" km/h";
    document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900?"+ name +" ')"
    document.querySelector(".weather").classList.remove("load")
}



document.querySelector(".btn").addEventListener('click', () => {
weatherFetch(document.querySelector(".search-bar").value);
})

document.querySelector(".search-bar").addEventListener("keyup", (e) => {
  if(e.key == "Enter") {
    weatherFetch(document.querySelector(".search-bar").value);
  }
})

weatherFetch("Nashik");

