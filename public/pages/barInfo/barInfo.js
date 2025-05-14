const barId = localStorage.getItem('selectedBarId');
fetch(`/bars/${barId}`)
  .then(res => res.json())
  .then(bar => {
    if (!bar) return;

    document.getElementById('barName').textContent = bar.name || 'Ukendt navn';

    document.getElementById('barInfo').textContent = 
      `Rating: ${bar.rating || 'Ingen'} \n`;

    document.getElementById('barTypes').textContent = 'Hvad kan de tilbyde: ' +
    `${Array.isArray(bar.types) ? bar.types.join(', ') : (bar.types || '')}`;

   
    document.getElementById('barAdress').textContent ='Adress' + bar.vicinity || 'Ukendt adresse';
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