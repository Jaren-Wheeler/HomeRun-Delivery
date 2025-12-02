const axios = require("axios");

async function geocodeAddress(address) {
    const apiKey = process.env.GOOGLE_GEOCODE_API_KEY;

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
    )}&key=${apiKey}`;

    const response = await axios.get(url);

    if (response.data.status !== "OK") {
        throw new Error("Geocoding failed: " + address);
    }

    const location = response.data.results[0].geometry.location;

    return {
        latitude: location.lat,
        longitude: location.lng
    };
}

module.exports = geocodeAddress;
