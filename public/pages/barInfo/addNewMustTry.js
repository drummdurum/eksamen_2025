document.getElementById('mustTryBtn').addEventListener('click', async () => {
    // Check if user is logged in
    const authRes = await fetch('/me', { credentials: 'include' });
    if (!authRes.ok) {
        toastr.error('Du skal være logget ind for at bruge denne funktion!');
        return;
    }

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