// Funktion för datum och tid
function updateDateTime() {
    const dateTimeElement = document.getElementById('datetimeBox');
    const now = new Date();
    
    const dateTimeOptions = { 
      hour: 'numeric', 
      minute: 'numeric', 
      hour12: false,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    
    const dateTimeString = new Intl.DateTimeFormat('sv-SE', dateTimeOptions).format(now);
    const [time, date] = dateTimeString.split(".");
    const dateTimeFormatted = `${time} ${date}`;
    
    dateTimeElement.textContent = dateTimeFormatted;
  }
  
  setInterval(updateDateTime, 1000);
  
  // Funktion för att redigera titel
  const titleElement = document.getElementById('dashboard-title');
  
  titleElement.addEventListener('dblclick', function() {
    const originalHeight = titleElement.offsetHeight;
    titleElement.contentEditable = true;
    titleElement.focus(); // Få fokus på det redigerbara elementet
  
    titleElement.addEventListener('blur', function() {
      titleElement.contentEditable = false;
    }, { once: true });
  });
  
  // Funktion för att lägga till länkar
  document.addEventListener("DOMContentLoaded", () => {
    const linkInput = document.getElementById("linkInput");
    const linkContainer = document.getElementById("linkContainer");
    const removeLastLinkBtn = document.getElementById("removeLastLinkBtn");
    const addedLinks = loadLinksFromLocalStorage();
  
    removeLastLinkBtn.addEventListener("click", removeLastLink);
    linkInput.addEventListener("keypress", handleKeyPress);
  
    function handleKeyPress(event) {
      if (event.key === 'Enter') {
        addLink();
      }
    }

    async function addLink() {
      const link = linkInput.value.trim();
      if (link !== '') {
        const linkElement = await createLinkWithLogo(link);
        if (linkElement) { 
          linkContainer.appendChild(linkElement);
          addedLinks.push(link);
          saveLinksToLocalStorage(addedLinks);
        }

        resetLinkInput(linkInput);
      }
    }
  
    async function createLinkWithLogo(link) {
      const linkElement = document.createElement('div');
      linkElement.classList.add('linkWithLogo');
  
      try {
        const linkText = document.createElement('a');
        linkText.href = link;
        linkText.target = "_blank";
        linkText.textContent = link;
  
        linkElement.appendChild(linkText);
  
        return linkElement;
      } catch (error) {
        console.error('Error creating link with logo:', error);
      }
      return null;
    }
  
    function resetLinkInput(input) {
      input.value = '';
    }
  
    function removeLastLink() {
      if (addedLinks.length > 0) {
       
        removeLastLinkElement();
        
       
        addedLinks.pop();
        saveLinksToLocalStorage(addedLinks);
      }
    }
  
    function removeLastLinkElement() {
      const lastLinkElement = linkContainer.lastElementChild;
      if (lastLinkElement) {
        lastLinkElement.remove();
      }
    }
    addedLinks.forEach(link => {
      createLinkWithLogo(link).then(linkElement => {
        if (linkElement) {
          linkContainer.appendChild(linkElement);
        }
      });
    });
   
    function loadLinksFromLocalStorage() {
      const savedLinks = localStorage.getItem('addedLinks');
      return savedLinks ? JSON.parse(savedLinks) : [];
    } 
    function saveLinksToLocalStorage(links) {
      localStorage.setItem('addedLinks', JSON.stringify(links));
    }
  });
  
  
  
  // Funktion för bakgrundsbild
  const UNSPLASH_API_KEY = "7R0aFkI7rzvnyK35200gEzvas3mP6dMzYq9uiAqsYoc";
  const changeBackgroundBtn = document.getElementById("changeBackgroundBtn");
  
  changeBackgroundBtn.addEventListener("click", () => {
    const query = document.getElementById("backgroundInput").value || "nature";
    fetch(`https://api.unsplash.com/photos/random?query=${query}&client_id=${UNSPLASH_API_KEY}`)
      .then(response => response.json())
      .then(imageData => {
        const imageUrl = imageData.urls.regular;
        document.body.style.backgroundImage = `url(${imageUrl})`;
        localStorage.setItem("backgroundImage", imageUrl);
      })
      .catch(error => console.error(error));
  });
  
  window.addEventListener("load", () => {
    const storedBackground = localStorage.getItem("backgroundImage");
    if (storedBackground) {
      document.body.style.backgroundImage = `url(${storedBackground})`;
    }
  });
  


  // Funktion för väder
  const apiKey = 'e6e79e8c5c4df108bf63ca3a99fad56f';
  const weatherInfoElement = document.getElementById('weatherInfo');
  const cityNameElement = document.getElementById('cityNameElement');
  let cityNameDisplayed = false;
  
  function getWeather(url) {
    axios.get(url)
      .then(response => {
        const cityName = response.data.city.name;
        if (!cityNameDisplayed) displayCityName(cityName);
  
        const [today, tomorrow, saturday] = [0, 8, 16].map(index => response.data.list[index]);
        displayWeather(today, 'Today');
        displayWeather(tomorrow, 'Tomorrow');
        displayWeather(saturday, 'Saturday');
      })
      .catch(handleError);
  }
  
  function getWeatherByLocation() {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.latitude}&lon=${coords.longitude}&appid=${apiKey}`;
      getWeather(url);
    }, () => {
      console.error('Error getting current location');
      console.log('Falling back to default city (Stockholm)');
      getWeatherByCity('Stockholm');
    });
  }
  
  function getWeatherByCity(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    getWeather(url);
  }
  
  function displayCityName(cityName) {
    if (cityNameElement) cityNameElement.textContent = cityName;
    else console.error('City element not found');
  }
  
  function displayWeather(weatherData, day) {
    const temperatureCelsius = (weatherData.main.temp - 273.15).toFixed(2);
    const weatherIcon = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`;
  
    // Lägg till en klass för att styla vädersymbolen
    weatherInfoElement.innerHTML += `
      <div>
        <h3 style="color: #3366ff;">${day === 'Today' ? `${day} in ${cityNameElement.textContent}` : day}</h3>
        <p class="temperature-text" style="color: #990000; margin-left: 10px;">Temperature: ${temperatureCelsius} °C</p>
        <div class="weather-icon">
          <img src="${weatherIcon}" alt="weather Icon" class="colored-icon">
        </div>
      </div>`;
  }
  
  function handleError(error) {
    console.error('Error fetching weather data:', error);
    console.error('Response status:', error.response ? error.response.status : 'N/A');
    console.error('Response data:', error.response ? error.response.data : 'N/A');
  }
  
  // Lägg till händelselyssnare för att hantera användarinmatning
  const cityInput = document.getElementById('cityInput');
  const cityForm = document.getElementById('cityForm'); 
  
  cityForm.addEventListener('submit', event => {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (city !== '') {
      cityNameDisplayed = false;
      weatherInfoElement.innerHTML = '';
      getWeatherByCity(city);
    }
  });
  
  getWeatherByLocation();
  
  // Funktion för radio
  document.addEventListener('DOMContentLoaded', () => {
    const circle = document.getElementById('circle');
    const stopButton = document.getElementById('stopButton');
    const playButton = document.getElementById('playButton');
    const nextButton = document.getElementById('nextButton');
    const soundMap = new Map();
    let currentChannelIndex = 0;
  
    function stopAllSounds() {
      soundMap.forEach(sound => {
        sound.stop();
      });
    }
  
    function updateCurrentChannel() {
      const currentChannel = data.channels[currentChannelIndex];
      const channelId = currentChannel.id;
  
      // Sätt bakgrundsbilden baserat på kanalens logotyp (om det finns en)
      if (currentChannel.logo) {
        circle.style.backgroundImage = `url('${currentChannel.logo}')`;
      } else {
        // Om det inte finns någon logotyp, använd en standardbakgrundsbild
        circle.style.backgroundImage = 'url("path/to/default-image.jpg")'; // Byt ut sökvägen efter behov
      }
    }
  
    function playCurrentChannel() {
      const channelId = data.channels[currentChannelIndex].id;
      const sound = soundMap.get(channelId);
  
      if (sound) {
        sound.play();
      } else {
        console.error(`Ljudobjektet för kanal med id ${channelId} saknas.`);
      }
    }
  
    circle.addEventListener('click', () => {
      stopAllSounds();
      currentChannelIndex = (currentChannelIndex + 1) % data.channels.length;
      updateCurrentChannel();
      playCurrentChannel();
    });
  
    stopButton.addEventListener('click', () => {
      stopAllSounds();
    });
  
    playButton.addEventListener('click', () => {
      playCurrentChannel();
    });
  
    nextButton.addEventListener('click', () => {
      stopAllSounds();
      currentChannelIndex = (currentChannelIndex + 1) % data.channels.length;
      updateCurrentChannel();
      playCurrentChannel();
    });
  
    fetch('https://api.sr.se/api/v2/channels?format=json&size=100')
      .then(response => response.json())
      .then(data => {
        window.data = data;
  
        data.channels.forEach(channel => {
          const sound = new Howl({
            src: [channel.liveaudio.url],
            html5: true,
            format: ['mp3', 'aac'],
            volume: 0.5,
            autoplay: false,
          });
  
          soundMap.set(channel.id, sound);
        });
  
        updateCurrentChannel();
      })
      .catch(error => console.error('Error fetching data:', error));
  });
  
  // Funktion för att spara anteckningar
  document.addEventListener('DOMContentLoaded', () => {
    const innerBox = document.querySelector('.inner-box');
  
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      innerBox.innerHTML = savedNotes;
    }
  
    innerBox.addEventListener('input', () => {
      const notes = innerBox.innerHTML;
      localStorage.setItem('notes', notes);
    });
  });
  
  
  function manualSave() {
    const innerBox = document.querySelector('.inner-box');
    const notes = innerBox.innerHTML;
    localStorage.setItem('notes', notes);
    innerBox.innerHTML = ''; 
  }
  
  function viewNotes() {
    const innerBox = document.querySelector('.inner-box');
    const savedNotes = localStorage.getItem('notes');
  
    if (savedNotes) {
      const notesList = document.createElement('ul');
      const notesArray = savedNotes.split('\n'); 
  
      notesArray.forEach((note) => {
        const listItem = document.createElement('li');
        listItem.textContent = note;
        notesList.appendChild(listItem);
      });
  
      innerBox.innerHTML = '';
      innerBox.appendChild(notesList);
    } else {
      alert("Inga sparade anteckningar.");
    }
  }
  


  

  









        
         
        

