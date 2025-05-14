import { fetchBars } from './../../pages/allBar/fechtAllBar.js';

const searchBar = document.getElementById('searchBar');
const barContainer = document.getElementById('barContainer');
searchBar.addEventListener('input', async function () {
    const query = searchBar.value.trim();
    if (!query) {
        await fetchBars();
        return;
    }

    let bars = [];

    try {
        let res = await fetch(`/bars/search/bars?q=${encodeURIComponent(query)}`);
        if (res.ok) {
            bars = await res.json();
        }
    } catch (err) {
        console.error('Fejl ved lokal søgning:', err);
    }

    if (bars.length === 0) {
        try {
            const res = await fetch(`/bars/search-external/bars?q=${encodeURIComponent(query)}`);
            if (res.ok) {
                
                bars = await res.json();
            } else {
                console.warn('Ekstern søgning returnerede fejl:', await res.text());
            }
        } catch (err) {
            console.error('Fejl ved ekstern søgning:', err);
        }
    }

    renderBars(bars);
});

function renderBars(bars) {
    barContainer.innerHTML = '';
    bars.forEach(bar => {
        const barCard = document.createElement('button');
        barCard.type = 'button';
        barCard.className = 'rounded-lg p-4 m-4 w-72 shadow hover:shadow-lg transition text-left cursor-pointer focus:outline-none';

        
        barCard.dataset.barId = bar.id;

        barCard.innerHTML = `
            <h3>${bar.name}</h3>
            <p><strong>Adresse:</strong> ${bar.vicinity || bar.formatted_address || ''}</p>
            <p><strong>Rating:</strong> ${bar.rating || 'Ingen rating'}</p>
            <p><strong>Antal anmeldelser:</strong> ${bar.user_ratings_total || 'Ingen anmeldelser'}</p>
            <p><strong>Typer:</strong> ${bar.types ? bar.types.join(', ') : ''}</p>
        `;

        barCard.onclick = () => {
            localStorage.setItem('selectedBarId', barCard.dataset.barId);
            window.location.href = '/barInfo';
        };

        barContainer.appendChild(barCard);
    });
}