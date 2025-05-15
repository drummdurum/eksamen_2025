import axios from 'axios';
import 'dotenv/config';

const apiKey = process.env.GoogleApiSearchKey;

export async function searchBarByName(query) {
    const sw = "55.5841,12.4084"; // Sydvest hjørne
    const ne = "55.7335,12.6508"; // Nordøst hjørne

    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&locationbias=rectangle:${sw}|${ne}&type=bar&region=DK&key=${apiKey}`;
    
    try {
        const response = await axios.get(url);
        return response.data.results;
    } catch (error) {
        console.error("Fejl med Text Search:", error);
        return [];
    }
}