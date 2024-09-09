async function getWeatherData (location) {
    let url = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' + location + '/next7days?unitGroup=metric&key=P9N6HSPKVMA4GG5N3KZBVF9YB&contentType=json';
    const locationData = await getData(url);
    console.log(locationData)
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
        const current = [data.currentConditions.conditions, data.currentConditions.icon, data.currentConditions.temp, data.currentConditions.uvindex];
        const next7Days = data.days;
        const nextDescription = data.description;
        return {adress, current, next7Days, nextDescription};
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
    getWeatherData(location);
})

getWeatherData('Volda');
