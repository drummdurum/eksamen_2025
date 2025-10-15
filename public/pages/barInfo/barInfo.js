const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get('message');

if (message) {
    toastr.success(decodeURIComponent(message)); 
}

// Check if user is logged in
let isUserLoggedIn = false;
let currentUser = null;

async function checkAuthStatus() {
    try {
        const res = await fetch('/me', { credentials: 'include' });
        if (res.ok) {
            currentUser = await res.json();
            isUserLoggedIn = !!currentUser.user;
        } else {
            isUserLoggedIn = false;
            currentUser = null;
        }
    } catch (error) {
        console.error('Fejl ved tjek af login status:', error);
        isUserLoggedIn = false;
        currentUser = null;
    }
}

// Initialize auth check
checkAuthStatus();

$(document).ready(function () {
    const messageElement = document.getElementById('message');
    if (messageElement && messageElement.textContent.trim()) {
        toastr.error(messageElement.textContent.trim());
    }
});

const barId = localStorage.getItem('selectedBarId');
fetch(`/bars/${barId}`)
  .then(res => res.json())
  .then(bar => {
    if (!bar) return;

    document.getElementById('barName').textContent = bar.name || 'Ukendt navn';

    document.getElementById('barTypes').textContent = 'Hvad kan de tilbyde: ' +
    `${Array.isArray(bar.types) ? bar.types.join(', ') : (bar.types || '')}`;

   
    const address = bar.vicinity || 'Ukendt adresse';
    const mapsUrl = address !== 'Ukendt adresse'
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : '#';

    document.getElementById('barAdress').innerHTML =
    address !== 'Ukendt adresse'
      ? `Adresse: <a href="${mapsUrl}" target="_blank" class="underline text-blue-400 hover:text-blue-600">${address}</a>`
      : 'Adresse: Ukendt adresse';
    })
  .catch(err => {
    console.error('Fejl ved hentning af bar:', err);
  });

fetch(`/bars/${barId}/photos`)
  .then(res => {
    if (res.ok) {
      document.getElementById('barImage').innerHTML = `<img src="${res.url}" alt="Bar billede" class="w-full h-full object-cover rounded-lg" />`;
    } else {
      throw new Error('Fejl ved hentning af billede');
    }
  });

fetch(`/bars/${barId}/owerviews`)
  .then(res => res.json())
  .then(data => {
    document.getElementById('barInfo').textContent +=
      (data.overview ? `\n${data.overview}` : '\nDer er ingen beskrivelse tilgængelig') ;
  })
  .catch(() => {
    document.getElementById('barInfo').textContent += '\nDer er ingen beskrivelse tilgængelig';
}); 