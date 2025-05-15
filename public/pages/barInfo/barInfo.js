const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get('message');

if (message) {
    toastr.success(decodeURIComponent(message)); 
}

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

    document.getElementById('barInfo').textContent = 
      `Rating: ${bar.rating || 'Ingen'} `;

    document.getElementById('barTypes').textContent = 'Hvad kan de tilbyde: ' +
    `${Array.isArray(bar.types) ? bar.types.join(', ') : (bar.types || '')}`;

   
    document.getElementById('barAdress').textContent ='Adresse: ' + bar.vicinity || 'Ukendt adresse';
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
      (data.overview ? `\n${data.overview}` : '\nUkendt beskrivelse');
  })
  .catch(() => {
    document.getElementById('barInfo').textContent += '\nUkendt beskrivelse';
}); 