import fs from 'fs/promises';
import path from 'path';

import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function saveBarToDatabase(bar) {
    fetch('http://localhost:8080/bars', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bar)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Fejl ved gemning af bar i databasen');
        }
        console.log('Bar gemt i databasen:', bar.name);
    })
    .catch(error => console.error(error));
}

async function fetchAndGenerateBars() {
    try {
        
        const filePath = path.resolve(__dirname, '../DB/data.json');
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContent);

        const bars = data.results.map(bar => ({
            name: bar.name,
            vicinity: bar.vicinity || bar.formatted_address, // Brug "vicinity"
            rating: bar.rating,
            user_ratings_total: bar.user_ratings_total,
            types: (bar.types || []).filter(type => type !== 'point_of_interest' && type !== 'establishment')
        }));

        bars.forEach(bar => saveBarToDatabase(bar));
    } catch (error) {
        console.error('Fejl ved hentning af data:', error);
    }
}

fetchAndGenerateBars();