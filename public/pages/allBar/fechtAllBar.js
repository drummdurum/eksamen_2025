export async function fetchBars() {
    try {
        const response = await fetch('/bars'); 
        if (!response.ok) {
            throw new Error('Fejl ved hentning af barer');
        }
        const bars = await response.json();

      
        const barContainer = document.getElementById('barContainer');

    
       bars.forEach(bar => {
            const barCard = document.createElement('button');
            barCard.type = 'button';
            barCard.className = 'rounded-lg p-4 m-4 w-72 shadow hover:shadow-lg transition text-left cursor-pointer focus:outline-none';

            barCard.dataset.barId = bar.id;

            barCard.innerHTML = `
                <h3>${bar.name}</h3>
                <p><strong>Adresse:</strong> ${bar.vicinity}</p>
                <p><strong>Rating:</strong> ${bar.rating || 'Ingen rating'}</p>
                <p><strong>Antal anmeldelser:</strong> ${bar.user_ratings_total || 'Ingen anmeldelser'}</p>
                <p><strong>Typer:</strong> ${bar.types.join(', ')}</p>
            `;

           
           barCard.onclick = () => {
            localStorage.setItem('selectedBarId', barCard.dataset.barId);
            window.location.href = '/barInfo'; 
            };

            barContainer.appendChild(barCard);
        });
    } catch (error) {
        console.error('Fejl:', error);
    }
}
fetchBars();


export async function fetchBarsList() {
    try {
        const response = await fetch('/bars');
        if (!response.ok) throw new Error('Fejl ved hentning af barer');
        return await response.json(); // Returnér kun listen!
    } catch (error) {
        console.error('Fejl:', error);
        return [];
    }
}