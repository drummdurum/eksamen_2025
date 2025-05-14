import fetch from 'node-fetch';
import 'dotenv/config';

const GOOGLE_API_KEY = process.env.GoogleApiSearchKey;

export async function fetchBarOverview(placeId) {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,editorial_summary&key=${GOOGLE_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Google API fejl');
    const data = await response.json();
    return {
        name: data.result?.name || null,
        overview: data.result?.editorial_summary?.overview || null
    };
}