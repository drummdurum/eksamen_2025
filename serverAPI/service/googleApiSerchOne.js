import axios from 'axios';
import 'dotenv/config';
const axios = axios;

const apiKey = process.env.GoogleApiSearchKey;
const query = "Mikkeller Bar Copenhagen";

const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;

axios.get(url)
  .then(response => {
    const places = response.data.results;

    places.forEach(place => {
      console.log(`${place.name} - ${place.formatted_address}`);
    });
  })
  .catch(error => {
    console.error("Fejl med Text Search:", error);
  });