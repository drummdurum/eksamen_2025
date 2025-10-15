document.getElementById('mustTryBtn').addEventListener('click', async () => {
    const barId = localStorage.getItem('selectedBarId');
    if (!barId) {
        toastr.error('BarId mangler!');
        return;
    }

    const res = await fetch('/mustTrys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ barId })
    });

    if (res.ok) {
        toastr.success('Bar tilføjet til Must Try!');
    } else {
        const data = await res.json();
        toastr.error(data.error || 'Kunne ikke tilføje baren.');
    }
});