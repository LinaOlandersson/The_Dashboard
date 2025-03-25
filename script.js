// Functions for time-and-date display

function showTimeAndDate() {
  const now = new Date();

  const day = now.getDate();
  const month = now.getMonth();
  const year = now.getFullYear();
  const months = [
    "januari",
    "februari",
    "mars",
    "april",
    "maj",
    "juni",
    "juli",
    "augusti",
    "september",
    "oktober",
    "november",
    "december",
  ];

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  document.getElementById("time").innerHTML = `${hours}:${formattedMinutes}`;
  document.getElementById("date").innerHTML = `${day} ${months[month]} ${year}`;
}

setInterval(showTimeAndDate, 1000);
showTimeAndDate();

// Functions for changing background

const newBackgroundBtn = document.getElementById("new-background-btn");
const UNSPLASH_BASE_URL = "https://api.unsplash.com/photos/random?client_id=";
const UNSPLASH_API_KEY = "G6SxHbLj1Iz-VMNf3Kf0S87oWUnb0gmvBOo6YYtwAyE";

newBackgroundBtn.addEventListener("click", changeBackground);

async function changeBackground() {
  try {
    const pictureResponse = await fetch(
      `${UNSPLASH_BASE_URL}${UNSPLASH_API_KEY}`
    );

    if (!pictureResponse.ok) {
      throw new Error("Det gick inte att hämta en slumpad bild.");
    }
    const pictureData = await pictureResponse.json();
    const pictureUrl = pictureData.urls.regular;
    document.body.style.backgroundImage = `url(${pictureUrl})`;
    backgroundSettings();
    localStorage.setItem("backgroundImage", pictureUrl);
  } catch (error) {
    console.error("Fel vid hämtning av bakgrundsbild: ", error);
  }
}

function loadBackgroundFromLocalStorage() {
  const savedBackground = localStorage.getItem("backgroundImage");
  if (savedBackground) {
    document.body.style.backgroundImage = `url(${savedBackground})`;
    backgroundSettings();
  }
}

function backgroundSettings() {
  newBackgroundBtn.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
  newBackgroundBtn.style.color = "black";
  document.getElementById("main-title").style.color =
    "rgba(255, 255, 255, 0.9)";
}

window.addEventListener("DOMContentLoaded", loadBackgroundFromLocalStorage);

//Functions for "Snabblänkar"

const addLinkButton = document.getElementById("add-link-btn");
const closeModalButton = document.getElementById("close-modal-btn");
const modal = document.getElementById("modal");
const addLinkForm = document.getElementById("add-link-form");
const links = document.getElementById("links");

// Get links from localStorage
function getLinksFromLocalStorage() {
  const storedLinks = localStorage.getItem("links");
  if (storedLinks) {
    return JSON.parse(storedLinks);
  } else return [];
}

// Save links to localStorage
function saveLinksToLocalStorage(linksArray) {
  localStorage.setItem("links", JSON.stringify(linksArray));
}

// The HTML for a link
function createLinkHTML(link) {
  const faviconBase =
    "https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=";
  return `
    <div class="link">
      <a href="${link.url}" target="_blank">
        <img src="${faviconBase + link.url}&size=128" alt="${
    link.name
  }" class="icon" />
        <b><p>${link.name}</p></b>
      </a>
      <button class="remove-link-btn">&#8854;</button>
    </div>
  `;
}

// Display the links
function displayLinks() {
  const linksArray = getLinksFromLocalStorage();
  links.innerHTML = ""; // Rensa nuvarande länkar
  linksArray.forEach((link) => {
    links.innerHTML += createLinkHTML(link);
  });
}

// Display modal
addLinkButton.addEventListener("click", function () {
  modal.style.display = "block";
});

window.addEventListener("click", function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
    addLinkForm.reset();
  }
});

// Eventlisteners for adding and removing links
addLinkForm.addEventListener("submit", addLink);
links.addEventListener("click", removeLink);

// Add a link
function addLink(e) {
  e.preventDefault();
  const linkUrl = document.getElementById("link-url").value;
  const linkName = document.getElementById("link-name").value;

  const newLink = {
    url: linkUrl,
    name: linkName,
  };

  const currentLinks = getLinksFromLocalStorage();
  currentLinks.push(newLink);
  saveLinksToLocalStorage(currentLinks);

  // Update list, close and reset modal
  displayLinks();
  modal.style.display = "none";
  addLinkForm.reset();
}

// Remove a link
function removeLink(event) {
  if (!event.target.classList.contains("remove-link-btn")) return;
  event.preventDefault();
  const linkToRemove = event.target.closest(".link");
  const linkUrlToRemove = linkToRemove.querySelector("a").href;

  // Remove from local storage
  let currentLinks = getLinksFromLocalStorage();
  currentLinks = currentLinks.filter((link) => link.url !== linkUrlToRemove);
  saveLinksToLocalStorage(currentLinks);

  // Display updated list
  displayLinks();
}

// Display links when page is loaded
window.addEventListener("DOMContentLoaded", displayLinks);

// Functions related to "Random pappaskämt"

const jokeContainer = document.getElementById("joke");

async function getJoke() {
  try {
    jokeContainer.innerHTML = "Laddar skämt...";
    const jokeUrl = "https://official-joke-api.appspot.com/random_joke";
    const response = await fetch(jokeUrl);
    if (!response.ok) {
      throw new Error(`Fel vid hämtning. Status: ${response.status}.`);
    }
    const data = await response.json();
    displayJoke(data);
  } catch (error) {
    console.log(error);
    jokeContainer.innerHTML =
      "Kunde inte hämta dagens skämt. Försök igen senare.";
  }
}

function displayJoke(data) {
  const jokeHTML = `<p>${data.setup}</p>
            <p>${data.punchline}</p>`;
  jokeContainer.innerHTML = "";
  jokeContainer.innerHTML = jokeHTML;
}

getJoke();

//Functions for "Anteckningar"

const notes = document.getElementById("notes");
const savedNote = localStorage.getItem("note");

try {
  if (savedNote) {
    notes.innerHTML = savedNote;
  } else {
    notes.innerHTML = "";
  }
} catch (error) {
  console.log(error.message);
  notes.innerHTML = "Problem med att hämta anteckningar från local storage.";
}

notes.addEventListener("input", () => {
  try {
    localStorage.setItem("note", notes.innerHTML);
  } catch (error) {
    console.log(error.message);
    notes.innerHTML = "problem med att spara anteckningar till local storage.";
  }
});

//Functions for "main title"

const title = document.getElementById("main-title");
const savedTitle = localStorage.getItem("title");

if (savedTitle) {
  title.innerHTML = savedTitle;
}

title.addEventListener("input", () => {
  localStorage.setItem("title", title.innerHTML);
});

//Functions for "Dagens väder"

const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = "ad2969ede1f9ea8521988eb90da9fa52";
const forecast = document.getElementById("forecast");

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      getWeatherData(latitude, longitude);
    },
    function (error) {
      console.error("Det gick inte att hämta din position: " + error.message);
      forecast.innerHTML =
        "Kunde inte hämta din position. Vänligen kontrollera dina inställningar.";
    }
  );
} else {
  console.log("Geolocation stöds inte i den här webbläsaren.");
  forecast.innerHTML = "Geolocation stöds inte i den här webbläsaren.";
}

async function getWeatherData(latitude, longitude) {
  try {
    forecast.innerHTML = "Laddar väderdata...";
    const weatherUrl = `${BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      throw new Error(`Error. Status: ${weatherResponse.status}`);
    }
    const weatherData = await weatherResponse.json();
    displayWeatherData(weatherData);
  } catch (error) {
    console.log(error);
    console.error("Kunde inte hämta väderdata: ", error);
    forecast.innerHTML = "Kunde inte hämta väderdata. Försök igen senare.";
  }
}

function displayWeatherData(weatherData) {
  const temperature = Math.round(weatherData.main.temp);
  const feelsLike = Math.round(weatherData.main.feels_like);
  const weatherIcon = weatherData.weather[0].icon;
  const humidity = weatherData.main.humidity;
  const windSpeed = weatherData.wind.speed;

  const displayHTML = `<img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" id="weather-icon">     
  <p>Temp: ${temperature}°C</p>
  <p>Känns som: ${feelsLike}°C</p>
  <p>Luftfuktighet: ${humidity}%</p>
  <p>Vind: ${windSpeed} m/s</p>`;

  forecast.innerHTML = "";
  forecast.innerHTML = displayHTML;
}
