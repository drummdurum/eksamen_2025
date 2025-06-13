import { fetchBarsList } from './../../pages/allBar/fechtAllBar.js';

document.getElementById('mapFrame').src = "https://www.google.com/maps?q=København&output=embed";
const searchBar = document.getElementById('searchBar');
const barContainer = document.getElementById('barContainer');
const typeFilter = document.getElementById('typeFilter'); 
const guestTypeFilter = document.getElementById('guestTypeFilter');
const drinkTypeFilter = document.getElementById('drinkTypeFilter');
const activityTypeFilter = document.getElementById('activityTypeFilter');

const filters = [typeFilter, guestTypeFilter, drinkTypeFilter, activityTypeFilter].filter(Boolean);
filters.forEach(filter =>
    filter.addEventListener('change', () => searchBar.dispatchEvent(new Event('input')))
);

if (typeFilter) {
    typeFilter.addEventListener('change', () => {
        searchBar.dispatchEvent(new Event('input'));
    });
}

export const selectedBars = [];

document.getElementById('travelMode').addEventListener('change', () => {
    updateRouteOnMap();
});

document.getElementById('RefredsRoute').addEventListener('click', () => {
    updateRouteOnMap();
});

document.getElementById('clearRouteBtn').addEventListener('click', () => {
    selectedBars.length = 0; 
    updateRouteOnMap();      
    document.getElementById('selectedBarsList').innerHTML = '';
});

async function showAllBars() {
    const bars = await fetchBarsList();
    renderLocalBars(bars);
}

showAllBars();

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

    if (usedExternal) {
        renderExternalBars(bars);
    } else {
        renderLocalBars(bars);
    }
});


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

        barCard.onclick = () => {
            const address = bar.vicinity || bar.formatted_address || '';
            if (address && !selectedBars.includes(address)) {
                selectedBars.push(address);
            }
            updateRouteOnMap();
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
            const rawAddress = bar.vicinity || bar.formatted_address || '';
            const address = simplifyAddress(rawAddress);
            if (address && !selectedBars.some(b => b.address === address)) {
                selectedBars.push({ name: bar.name, address, barId: bar.id });
            }
            updateRouteOnMap();
        };

        barContainer.appendChild(barCard);
    });
}


export async function updateRouteOnMap() {
    const start = document.getElementById('startInput').value.trim() || "København";
    const selectedBarsList = document.getElementById('selectedBarsList');
    selectedBarsList.innerHTML = '';

    selectedBars.forEach((barObj, idx) => {
        const li = document.createElement('li');
        li.textContent = barObj.name;
        li.className = "cursor-move hover:text-red-400 transition";
        li.title = "Træk for at ændre rækkefølge eller klik for at fjerne";
        li.draggable = true;

        li.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', idx);
            li.classList.add('opacity-50');
        });
        li.addEventListener('dragend', () => {
            li.classList.remove('opacity-50');
        });
        li.addEventListener('dragover', (e) => {
            e.preventDefault();
            li.classList.add('bg-blue-900');
        });
        li.addEventListener('dragleave', () => {
            li.classList.remove('bg-blue-900');
        });
        li.addEventListener('drop', (e) => {
            e.preventDefault();
            li.classList.remove('bg-blue-900');
            const fromIdx = Number(e.dataTransfer.getData('text/plain'));
            const toIdx = idx;
            if (fromIdx !== toIdx) {
                
                const [moved] = selectedBars.splice(fromIdx, 1);
                selectedBars.splice(toIdx, 0, moved);
                updateRouteOnMap();
            }
        });

        li.onclick = (ev) => {
            
            if (ev.type === "click" && !ev.defaultPrevented) {
                selectedBars.splice(idx, 1);
                updateRouteOnMap();
            }
        };

        selectedBarsList.appendChild(li);
    });

    if (selectedBars.length === 0) {
        document.getElementById('mapFrame').src = "https://www.google.com/maps?q=København&output=embed";
        return;
    }

    const bars = selectedBars.map(b => b.address).join(';');
    const mode = document.getElementById('travelMode').value;
    const res = await fetch(`/embedRoutes?start=${encodeURIComponent(start)}&bars=${encodeURIComponent(bars)}&mode=${mode}`);
    const data = await res.json();
    document.getElementById('mapFrame').src = data.embedUrl;
}

function simplifyAddress(address) {
    if (!address) return '';
    const parts = address.split(',').map(s => s.trim());
    if (parts.length >= 2) {
        const simplified = `${parts[0]}, ${parts[1]}`;
        return simplified;
    }
    return parts[0];
}

function filterBarsByTypes(bars) {
    const type = typeFilter ? typeFilter.value : '';
    const guestType = guestTypeFilter ? guestTypeFilter.value : '';
    const drinkType = drinkTypeFilter ? drinkTypeFilter.value : '';
    const activityType = activityTypeFilter ? activityTypeFilter.value : '';

    return bars.filter(bar => {
        const types = (bar.types || []).map(t => t.toLowerCase());
        return (!type || types.includes(type.toLowerCase())) &&
               (!guestType || types.includes(guestType.toLowerCase())) &&
               (!drinkType || types.includes(drinkType.toLowerCase())) &&
               (!activityType || types.includes(activityType.toLowerCase()));
    });
}

const params = new URLSearchParams(window.location.search);
const barsParam = params.get('bars');
if (barsParam) {
  const barIds = barsParam.split(',');
  fetch(`/bars/by-ids/finds?ids=${barIds.join(',')}`)
    .then(res => res.json())
    .then(bars => {
      bars.forEach(bar => {
        if (!selectedBars.some(b => b.barId === bar.id)) {
          selectedBars.push({
            name: bar.name,
            address: bar.vicinity || bar.formatted_address || '',
            barId: bar.id
          });
        }
      });
      updateRouteOnMap();
    });
}