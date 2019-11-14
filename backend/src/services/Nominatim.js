const axios = require('axios');

const api = axios.create({
    baseURL: 'https://nominatim.openstreetmap.org/?format=json/search',
    method: 'get'
});

function getPlace(data) {
    const { boundingbox, lat, lon, display_name, class:category, type, icon, address } = data;

    const place = {
        display_name,
        category,
        type,
        icon,
        address,
        boundingbox,
        coordinates: {
            lat,
            lon
        }
    }

    place.display = {
        location: `https://www.google.com/maps/place/${place.coordinates.lat},${place.coordinates.lon}`,
        boundingbox: `http://bboxfinder.com/#${boundingbox[0]},${boundingbox[2]},${boundingbox[1]},${boundingbox[3]}`
    };
    
    return place;
}

module.exports = {
    api,

    async geosearch(... fields) {
        const response = await api.get(`&addressdetails=1&q=${fields}&format=json&limit=1`)
            .catch((err) => {
                console.log(`\n\n\t${err}\n\n`);
            });
    
        return getPlace(response.data[0]);
    },
    
    async geosearch_structuredData(data) {
        const { state, city, district, street, number } = data;
    
        var complementURL = `&addressdetails=1`;
    
        if(state) complementURL += `&state=${state}`;
        if(city) complementURL += `&city=${city}`;
        if(district) complementURL += `&district=${district}`;
        if(street) complementURL += `&street=${street}`;
        if(number) complementURL += `&number=${number}`;
    
        complementURL += `&format=json&limit=1`;
    
        const response = await api.get(complementURL);

        if(response.data.length <= 0)
            throw 'Place not found.';

        return getPlace(response.data[0]);
    }
};