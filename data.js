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
        const current = [
            data.currentConditions.conditions, 
            data.currentConditions.icon, 
            data.currentConditions.temp, 
            data.currentConditions.precip,
            data.currentConditions.windspeed
        ];
        const nextDescription = data.description;
        return {adress, current, nextDescription};
        }catch(error){
            console.log(`Fetch error: `, error);
                    alert(error);
        }
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
    console.log(data);
    const currentAdress = document.querySelector('#adress');
    currentAdress.textContent = data.adress;

    const weatherIcon = document.querySelector('#icon');
    const weatherDescription = document.querySelector('#description');
    weatherIcon.src = 'Icons/'+ data.current[1] + '.png';
    weatherDescription.textContent = data.current[0];

    const temp = document.querySelector('#temp');
    temp.textContent = data.current[2] + ' C';

    const precip = document.querySelector('#precip');
    precip.textContent = data.current[3] + ' mm';
    
    const wind = document.querySelector('#wind');
    wind.textContent = data.current[4] + ' m/s';

    const nextDays = document.querySelector('#nextDescription');
    nextDays.textContent = data.nextDescription;

} 

//Initial render
renderWeatherReport('Volda');
