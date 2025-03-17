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

async function changeBackground() {
  try {
    const pResponse = await fetch(`${UNSPLASH_BASE_URL}${UNSPLASH_API_KEY}`);

    if (!pResponse.ok) {
      throw new Error("Det gick inte att hämta en slumpad bild.");
    }
    const pData = await pResponse.json();
    const pictureUrl = pData.urls.regular;
    document.body.style.backgroundImage = `url(${pictureUrl})`;
    newBackgroundBtn.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
    newBackgroundBtn.style.color = "black";
    document.getElementById("main-title").style.color =
      "rgba(255, 255, 255, 0.9)";
  } catch (error) {
    console.error("Error fetching background image: ", error);
  }
}

newBackgroundBtn.addEventListener("click", changeBackground);

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
    return JSON.parse(storedLinks); // Om det finns länkar, returnera som array
  } else return [];
}

// save links to localStorage
function saveLinksToLocalStorage(linksArray) {
  localStorage.setItem("links", JSON.stringify(linksArray));
}

// The HTML for a link
function createLinkHTML(link) {
  return `
    <div class="link">
      <a href="${link.url}" target="_blank">
        <b><p>${link.name}</p></b>
        <button class="remove-link-btn">&#8854;</button>
      </a>
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

  // const removeButtons = document.querySelectorAll(".remove-link-btn");
  // removeButtons.forEach((button) => {
  //   button.addEventListener("click", removeLink);
  // });
}

// Add a link
function addLink() {
  const linkUrl = document.getElementById("link-url").value;
  const linkName = document.getElementById("link-name").value;

  const newLink = {
    url: linkUrl,
    name: linkName,
  };

  const currentLinks = getLinksFromLocalStorage();
  currentLinks.push(newLink);
  saveLinksToLocalStorage(currentLinks);

  // Update DOM, close and reset modal
  displayLinks();
  modal.style.display = "none";
  addLinkForm.reset();
}

// Remove a link
function removeLink(event) {
  if (!event.target.classList.contains("remove-link-btn")) return;
  event.preventDefault();
  const linkToRemove = event.target.closest(".link");
  const linkUrlToRemove = new URL(linkToRemove.querySelector("a").href).href;

  // Remove from local storage
  let currentLinks = getLinksFromLocalStorage();
  currentLinks = currentLinks.filter((link) => link.url !== linkUrlToRemove);
  saveLinksToLocalStorage(currentLinks);

  // Display updated DOM
  displayLinks();
}

// Display modal
addLinkButton.addEventListener("click", function () {
  modal.style.display = "block";
});

window.addEventListener("click", function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Eventlisteners for adding and removing links
addLinkForm.addEventListener("submit", addLink);
links.addEventListener("click", removeLink);

// Display links when page is loaded
window.addEventListener("DOMContentLoaded", displayLinks);

// Functions related to "Dagens pappaskämt"

async function getJoke() {
  try {
    const jokeUrl = "https://official-joke-api.appspot.com/random_joke";
    const response = await fetch(jokeUrl);
    if (!response.ok) {
      throw new Error(`Fel vid hämtning. Status: ${response.status}.`);
    }
    const data = await response.json();
    displayJoke(data);
  } catch (error) {
    console.log(error);
  }
}

function displayJoke(data) {
  const setup = data.setup;
  const punchline = data.punchline;
  const jokeHTML = `<p>${data.setup}</p>
            <p>${data.punchline}</p>`;
  document.getElementById("joke").innerHTML = jokeHTML;
}

getJoke();

//Functions for "Anteckningar"

const notes = document.getElementById("notes");
const savedNote = localStorage.getItem("note");

if (savedNote) {
  notes.innerHTML = savedNote;
} else {
  notes.innerHTML = "";
}

notes.addEventListener("input", () => {
  localStorage.setItem("note", notes.innerHTML);
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
  forecast.innerHTML = "Din webbläsare stöder inte geolokalisering.";
}

async function getWeatherData(latitude, longitude) {
  try {
    const wUrl = `${BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
    const wResponse = await fetch(wUrl);

    if (!wResponse.ok) {
      throw new Error(`Error. Status: ${wResponse.status}`);
    }
    const wData = await wResponse.json();
    displayWeatherData(wData);
  } catch (error) {
    console.log(error);
    console.error("Error fetching weather data: ", error);
    forecast.innerHTML = "Kunde inte hämta väderdata. Försök igen senare.";
  }
}

function displayWeatherData(wData) {
  const temperature = Math.round(wData.main.temp);
  const feelsLike = Math.round(wData.main.feels_like);
  const weatherIcon = wData.weather[0].icon;
  const humidity = wData.main.humidity;
  const windSpeed = wData.wind.speed;

  const displayHTML = `<img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" id="weather-icon">     
  <p>Temp: ${temperature}°C</p>
  <p>Känns som: ${feelsLike}°C</p>
  <p>Luftfuktighet: ${humidity}%</p>
  <p>Vind: ${windSpeed} m/s</p>`;

  forecast.innerHTML = displayHTML;
}
