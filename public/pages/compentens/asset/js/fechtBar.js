// Funktion til at hente data og generere firkanter
function fetchAndGenerateBars() {
    fetch('../pages/compentens/asset/DB/data.json') // Korrekt sti til JSON-filen
        .then(response => response.json())
        .then(data => {
            const bars = data.results.map(bar => ({
                name: bar.name,
                address: bar.vicinity || bar.formatted_address, // Håndterer hvis vicinity er undefined
                rating: bar.rating,
                userRatings: bar.user_ratings_total,
                types: (bar.types || []).filter(type => type !== 'point_of_interest' && type !== 'establishment')
            }));
            generateBars(bars); // Kald funktionen med de hentede data
        })
        .catch(error => console.error('Fejl ved hentning af data:', error));
}

// Funktion til at generere firkanter
function generateBars(bars) {
    const container = document.querySelector('.border'); // Vælg containeren i din HTML

    bars.forEach(bar => {
        // Opret en div for hver bar
        const barDiv = document.createElement('div');
        barDiv.className = 'bar rounded-lg p-2 mb-2 w-1/4';

        // Tilføj indhold til div'en
        barDiv.innerHTML = `
            <h3 class="font-bold">${bar.name}</h3>
            <p>${bar.address}</p>
            <p>Vurdering: ${bar.rating}</p>
            <p>Typer: ${bar.types.join(', ')}</p>
        `;

        // Tilføj div'en til containeren
        container.appendChild(barDiv);
    });
}

// Kald funktionen til at hente data og generere firkanter
fetchAndGenerateBars();