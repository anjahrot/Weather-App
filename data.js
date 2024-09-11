async function getWeatherData (location) {
    let url = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' + location + '/next7days?unitGroup=metric&key=P9N6HSPKVMA4GG5N3KZBVF9YB&contentType=json';
    const locationData = await getData(url);
    return locationData;
}


async function getData(urlString) {

    try {
        const response = await fetch(urlString, {mode: 'cors'});
         if(!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }
        const data = await response.json();
        //Retrieving only necessary information
        const adress = data.resolvedAddress;
        const timezone = data.timezone;
        const current = [
            data.currentConditions.conditions, 
            data.currentConditions.icon, 
            data.currentConditions.temp, 
            data.currentConditions.precip,
            data.currentConditions.windspeed,
            data.currentConditions.datetime
        ];
        const nextDescription = data.description;
        const next5days = getNext(data);
        return {adress, timezone, current, nextDescription, next5days};
        }catch(error){
            if (error.message.includes('401')){
                alert('API key invalid');
            } else if(error.message.includes('400')){
                alert('Location not found!')
            } else {
                console.log(`Fetch error: `, error);
                alert(error);
            }
        }
    }

function getNext(data) {
    let array = [];
    for(let i=1;i<=5;i++) {
        array.push(data.days[i]);
    }
    return array;
}

const submitBtn = document.querySelector('#submitBtn');
const searchField = document.querySelector('#keyword');

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const location = searchField.value;
    renderWeatherReport(location);
})

async function renderWeatherReport(location) {
    const data = await getWeatherData(location);
    
    const currentAdress = document.querySelector('#adress');
    currentAdress.textContent = data.adress;

    const time = document.querySelector('#timeStamp');
    time.textContent = data.timezone + ' ' + data.current[5];

    const weatherIcon = document.querySelector('#icon');
    const weatherDescription = document.querySelector('#description');
    weatherIcon.src = 'Icons/'+ data.current[1] + '.svg';
    weatherDescription.textContent = data.current[0];

    const temp = document.querySelector('#temp');
    const tempunit = document.querySelector('#tempUnit');
    temp.textContent = data.current[2];
    tempunit.textContent = ' \u00B0C';

    const precip = document.querySelector('#precip');
    precip.textContent = data.current[3] + ' mm';
    
    const wind = document.querySelector('#wind');
    wind.textContent = data.current[4] + ' m/s';

    const nextDays = document.querySelector('#nextDescription');
    nextDays.textContent = data.nextDescription;

    const items = document.querySelectorAll('.weather-item');
    items.forEach((item, index) => {
        const iconImg = document.querySelector('#icon-'+ (index+1));
        iconImg.src = 'Icons/' + data.next5days[index].icon + '.svg';
        const tempItem = document.querySelector('#temp-'+(index+1));
        const tempItemUnit = document.querySelector('#tempUnit-'+(index+1))
        tempItem.textContent = data.next5days[index].temp; 
        tempItemUnit.textContent = ' \u00B0C';
    })

} 

const toggleBtn = document.querySelector('#toggleTemp');
toggleBtn.addEventListener('click', toggleTemp);

const temp = document.querySelector('#temp');
const tempunit = document.querySelector('#tempUnit');
const tempItems = document.querySelectorAll('.item-temp');
const tempItemsUnit = document.querySelectorAll('.item-unit');
//initially rendered temperature in celsius
let tempType = 'celsius';

function toggleTemp () {
    let temperature = parseFloat(temp.textContent)
    if(tempType === 'celsius') {
        temp.textContent = tempFromCtoF(temperature);
        tempItems.forEach((item) => {
            const temp = parseFloat(item.textContent); 
            item.textContent = tempFromCtoF(temp);
        });
        tempunit.textContent = ' \u00B0F';
        tempItemsUnit.forEach((item => {
            item.textContent = ' \u00B0F';
        }))
        tempType = 'fahrenheit';
    }
    else if(tempType === 'fahrenheit') {
        temp.textContent = tempFromFtoC(temperature);
        tempItems.forEach((item) => {
            const temp = parseFloat(item.textContent); 
            item.textContent = tempFromFtoC(temp);
        });
        tempunit.textContent = ' \u00B0C';
        tempItemsUnit.forEach((item => {
            item.textContent = ' \u00B0C';
        }))
        tempType = 'celsius';
    }
}

//Takes in temp i celsius and returns temp in fahrenheit with one decimal as string
function tempFromCtoF (temp) {
    const tempF =  temp*(9/5) + 32;
    return tempF.toFixed(1);
}

function tempFromFtoC (temp) {
    const tempC = (temp - 32)*(5/9);
    return tempC.toFixed(1);
}

//Initial render
renderWeatherReport('Volda');
