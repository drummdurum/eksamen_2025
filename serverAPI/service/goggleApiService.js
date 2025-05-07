import axios from 'axios';
import 'dotenv/config';
const axios = axios;


const apiKey = process.env.GoogleApiSearchKey;
const location = "55.6761,12.5683"; 
const radius = 1500; 
const type = "restaurant";

const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${apiKey}`;

axios.get(url)
  .then(response => {
    const places = response.data.results;

    places.forEach(place => {
      console.log(`${place.name} - ${place.vicinity}`);
    });
  })
  .catch(error => {
    console.error("Fejl ved API-kald:", error);
  });
