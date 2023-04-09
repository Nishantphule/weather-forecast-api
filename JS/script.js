// api key
function apikey() {
  return 'f4049656624f8252a31c89dda51daa4b'
}

let historyData = [];
try {
  let history = localStorage.getItem("historyData");
  if (history) {
    historyData = JSON.parse(history)
  }
}
catch (error) {
  console.error(error)
}
localStorage.setItem('historyData', historyData)


// add city to search history
// function addhistoryData(city) {
//   let newHistorydata = localStorage.getItem('historyData')
//   newHistorydata += `${city} `
//   localStorage.setItem('historyData', newHistorydata)
//   return newHistorydata.split(" ").filter((city) => city)
// }

const historyDiv = document.getElementById("searchHistory")


// weather fetching using city name from input
async function weatherFetch(city) {

  const cardDiv = document.querySelector(".weather")

  // creating a element for loading text
  const loading = document.createElement("span")
  loading.innerHTML = '<div class="spinner-border"></div>'
  cardDiv.appendChild(loading)

  // fetching api
  try {
    const weather = await fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apikey())

    cardDiv.removeChild(loading)

    const res = await weather.json()
    // manipulating weather details in html elements
    const { name } = res;
    const { country } = res.sys;
    const { icon, description } = res.weather[0];

    let iconRes = await fetch("https://openweathermap.org/img/wn/" + icon + ".png")
    let iconBlob = await iconRes.blob();
    let iconUrl = URL.createObjectURL(iconBlob)

    const { temp, humidity } = res.main;
    const { speed } = res.wind;
    let celcius = temp - 273.15
    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".country").innerText = ", " + country
    document.querySelector(".temp").innerText = celcius.toFixed(0) + " °C";
    document.querySelector(".pic").src = iconUrl;
    document.querySelector(".description").innerText = description;
    document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText = "Wind speed: " + speed + " km/h";
    document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900?weather/" + city + " ')"
  } catch (error) {
    console.error("error fetching weather data")
  }
}


// search btn
// btn event listener
document.querySelector(".btn").addEventListener('click', async (e) => {
  e.preventDefault()
  const city = document.querySelector(".search-bar").value

  const weather = await fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apikey())

  const data = await weather.json()

  if (data.cod === 200) {
    document.querySelector(".search-bar").value = ""
    weatherFetch(city)
    if (city) {
      historyData.push(city);
      localStorage.setItem("historyData", JSON.stringify(historyData));
      updateSearchHistory();
    }
  }
  else {
    window.alert("City Not Found")
    document.querySelector(".search-bar").value = ""
  }


})

function updateSearchHistory() {
  document.getElementById("searchHistory").innerHTML = ""
  const list = document.createElement("ul")
  historyData = historyData.reduce((pre, cur) => {
    if (!pre.includes(cur)) {
      return [...pre, cur];
    }
    else {
      return pre
    }
  }, [])
  localStorage.setItem("historyData", JSON.stringify(historyData));
  historyData.forEach(element => {
    const listItem = document.createElement("li")

    listItem.innerHTML = element
    listItem.addEventListener("click", (e) => {
      document.querySelector(".search-bar").value = e.target.textContent
      weatherFetch(e.target.textContent)
    })
    list.appendChild(listItem)
  });
  historyDiv.appendChild(list)
}


// enter key to search
document.querySelector(".search-bar").addEventListener('keypress', async (e) => {
  if (e.key === "Enter") {
    e.preventDefault()

    const city = document.querySelector(".search-bar").value

    const weather = await fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apikey())

    const data = await weather.json()

    if (data.cod === 200) {
      document.querySelector(".search-bar").value = ""
      weatherFetch(city);
      if (city) {
        historyData.push(city);
        
        updateSearchHistory();
      }
    }
    else {
      window.alert("City Not Found")
      document.querySelector(".search-bar").value = ""
    }

  }
})


// to get default location
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(async function (position) {
    if (position) {
      const { latitude, longitude } = position.coords

      const weather = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}` + "&appid=" + apikey())

      const res = await weather.json()

      const { name } = res
      weatherFetch(name)
    }
    else {
      weatherFetch("Delhi")
    }
  });
}

weatherFetch("Delhi")

