/* Global Variables */
const url = 'http://api.openweathermap.org/data/2.5/weather?';
const cityUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=';
const zipcode = document.querySelector('#zip');
const apiKey = '&appid=d0d23889dc28210a236f2464bc42818c';
const feeling = document.querySelector('#feelings');
const generate = document.querySelector('#generate');
const entry = document.querySelector('#entryHolder');

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear();

// the main function
const generateData = () => {
  const zipValue = zipcode.value;
  const feelingValue = feeling.value;
  if (!isNaN(zipValue)) {
    getTemp(url, zipValue, apiKey)
      .then((data) => {
        postData('/add', {
          date: newDate,
          temp: data.main.temp,
          feeling: feelingValue,
        });
      })
      .then(updateUI)
      .catch(function (err) {
        console.log(err);
      });
  } else {
    getCity(cityUrl, zipValue, apiKey).then((data) => {
      getCityTemp(url, data[0].lat, data[0].lon, apiKey)
        .then((data) => {
          console.log(data);
          postData('/add', {
            date: newDate,
            temp: data.main.temp,
            feeling: feelingValue,
          });
        })
        .then(updateUI)
        .catch(function (err) {
          console.log(err);
        });
    });
  }
};

//get the temp by using zipcode
const getTemp = async (url, zipValue, apiKey) => {
  const response = await fetch(`${url}zip=${zipValue}${apiKey}&units=metric`);
  try {
    const data = await response.json();
    return data;
  } catch (err) {
    console.log('err', err);
  }
};

//http://api.openweathermap.org/geo/1.0/direct?q=Toukh&limit=1&appid=d0d23889dc28210a236f2464bc42818c
//get the city coordinates by using the city name
const getCity = async (cityUrl, cityValue, apiKey) => {
  const response = await fetch(`${cityUrl}${cityValue}&limit=1${apiKey}`);
  try {
    const data = await response.json();
    return data;
  } catch (err) {
    console.log('err', err);
  }
};

//http://api.openweathermap.org/data/2.5/weather?lat=30.3540508&lon=31.200979&appid=d0d23889dc28210a236f2464bc42818c
//get the temp by using city coordinates
const getCityTemp = async (url, lat, lon, apiKey) => {
  const response = await fetch(`${url}lat=${lat}&lon=${lon}&limit=1${apiKey}&units=metric`);
  try {
    const data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    console.log('err', err);
  }
};

//post data to server endpoint
const postData = async (url = '', data = {}) => {
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  try {
    const data = await response.json();
  } catch (err) {
    console.log('errrr', err);
  }
};

//get the date from server endpoint and update the UI with it
const updateUI = async () => {
  const request = await fetch('/all');
  try {
    // Transform into JSON
    const allData = await request.json();
    console.log(allData);
    // Write updated data to DOM elements
    document.getElementById('temp').innerHTML = 'Temprature: ' + Math.round(allData.temp) + '&deg;C';
    document.getElementById('content').innerHTML = 'Feeling: ' + allData.feeling;
    document.getElementById('date').innerHTML = 'Date: ' + allData.date;
  } catch (error) {
    console.log('error', error);
    // appropriately handle the error
  }
};

//run the main function
generate.addEventListener('click', generateData);
