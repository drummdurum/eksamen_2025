async function fetchBars() {
    try {
        const response = await fetch('/bars'); 
        if (!response.ok) {
            throw new Error('Fejl ved hentning af barer');
        }
        const bars = await response.json();

      
        const barContainer = document.getElementById('barContainer');

    
        bars.forEach(bar => {
            const barCard = document.createElement('div');
            barCard.className = 'rounded-lg p-4 m-4 w-72 shadow hover:shadow-lg transition';

            barCard.innerHTML = `
                <h3>${bar.name}</h3>
                <p><strong>Adresse:</strong> ${bar.vicinity}</p>
                <p><strong>Rating:</strong> ${bar.rating || 'Ingen rating'}</p>
                <p><strong>Antal anmeldelser:</strong> ${bar.user_ratings_total || 'Ingen anmeldelser'}</p>
                <p><strong>Typer:</strong> ${bar.types.join(', ')}</p>
                <div class="flex justify-between mt-2 space-x-2">    
                </div>
            `;

            barContainer.appendChild(barCard);
        });
    } catch (error) {
        console.error('Fejl:', error);
    }
}
fetchBars();