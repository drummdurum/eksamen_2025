import { fetchBars } from './../../pages/allBar/fechtAllBar.js';
import { fetchBarsList } from './../../pages/allBar/fechtAllBar.js';

const searchBar = document.getElementById('searchBar');
const barContainer = document.getElementById('barContainer');
const guestTypeFilter = document.getElementById('guestTypeFilter');
const drinkTypeFilter = document.getElementById('drinkTypeFilter');
const activityTypeFilter = document.getElementById('activityTypeFilter');


function filterBarsByTypes(bars) {
    const guestType = guestTypeFilter.value;
    const drinkType = drinkTypeFilter.value;
    const activityType = activityTypeFilter.value;

    return bars.filter(bar => {
        const types = (bar.types || []).map(t => t.toLowerCase());
        return (!guestType || types.includes(guestType.toLowerCase())) &&
               (!drinkType || types.includes(drinkType.toLowerCase())) &&
               (!activityType || types.includes(activityType.toLowerCase()));
    });
}


searchBar.addEventListener('input', async function () {
    const query = searchBar.value.trim();
    let bars = [];
    let usedExternal = false;

    if (!query) {
        bars = await fetchBarsList() || [];
        const filtered = filterBarsByTypes(bars);
        renderLocalBars(filtered);
        return;
    }

   
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
                usedExternal = true;
            } else {
                console.warn('Ekstern søgning returnerede fejl:', await res.text());
            }
        } catch (err) {
            console.error('Fejl ved ekstern søgning:', err);
        }
    }
    const filtered = filterBarsByTypes(bars);
    if (usedExternal) {
        renderExternalBars(filtered);
    } else {
        renderLocalBars(filtered);
    }
});

 [guestTypeFilter, drinkTypeFilter, activityTypeFilter].forEach(filter =>
    filter.addEventListener('change', () => searchBar.dispatchEvent(new Event('input')))
    );


function renderExternalBars(bars) {
    barContainer.innerHTML = '';
    bars.forEach(bar => {
        const barCard = document.createElement('button');
        barCard.type = 'button';
        barCard.className = 'rounded-lg p-4 m-4 w-72 shadow hover:shadow-lg transition text-left cursor-pointer focus:outline-none';

        barCard.innerHTML = `
            <h3>${bar.name}</h3>
            <p><strong>Adresse:</strong> ${bar.vicinity || bar.formatted_address || ''}</p>
            <p><strong>Rating:</strong> ${bar.rating || 'Ingen rating'}</p>
            <p><strong>Antal anmeldelser:</strong> ${bar.user_ratings_total || 'Ingen anmeldelser'}</p>
            <p><strong>Typer:</strong> ${bar.types ? bar.types.join(', ') : ''}</p>
        `;

        barCard.onclick = async () => {
            const types = bar.types || [];
            if (Array.isArray(types) && types.map(t => t.toLowerCase()).includes('bar')) {
                let foundBarId = null;
                try {
                    const normalizedName = bar.name.trim();
                    const res = await fetch(`/bars/names?name=${encodeURIComponent(normalizedName)}`);
                    if (res.ok) {
                        const bars = await res.json();
                        if (bars.length > 0) {
                            foundBarId = bars[0].id;
                        }
                    }
                } catch (err) {
                    console.error('Fejl ved tjek af eksisterende bar:', err);
                }

                if (foundBarId) {
                    
                    localStorage.setItem('selectedBarId', foundBarId);
                    window.location.href = '/barInfo';
                } else {
                
                    const response = await fetch('/bars', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(bar)
                    });
                    const savedBar = await response.json();
                    localStorage.setItem('selectedBarId', savedBar.barId);
                    window.location.href = '/barInfo';
                }
            } else {
                toastr.warning('Denne placering er ikke markeret som en bar og bliver ikke gemt.');
            }
        };

        barContainer.appendChild(barCard);
    }); 
}

function renderLocalBars(bars) {
    barContainer.innerHTML = '';
    bars.forEach(bar => {
        const barCard = document.createElement('button');
        barCard.type = 'button';
        barCard.className = 'rounded-lg p-4 m-4 w-72 shadow hover:shadow-lg transition text-left cursor-pointer focus:outline-none';
        barCard.dataset.barId = bar.id;

        barCard.innerHTML = `
            <h3>${bar.name}</h3>
            <p><strong>Adresse:</strong> ${bar.vicinity || ''}</p>
            <p><strong>Rating:</strong> ${bar.rating || 'Ingen rating'}</p>
            <p><strong>Typer:</strong> ${bar.types ? bar.types.join(', ') : ''}</p>
        `;

        barCard.onclick = () => {
            localStorage.setItem('selectedBarId', bar.id);
            window.location.href = '/barInfo';
        };

        barContainer.appendChild(barCard);
    });
}