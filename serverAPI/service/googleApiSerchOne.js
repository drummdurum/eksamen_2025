import axios from 'axios';
import 'dotenv/config';

const apiKey = process.env.GoogleApiSearchKey;

export async function searchBarByName(query) {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;
    try {
        const response = await axios.get(url);
        // Returnér bare det første resultat eller hele listen
        return response.data.results;
    } catch (error) {
        console.error("Fejl med Text Search:", error);
        return [];
    }
}