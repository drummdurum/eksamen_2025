document.getElementById('mustTryBtn').addEventListener('click', async () => {
    // Check if user is logged in
    const authRes = await fetch('/me', { credentials: 'include' });
    if (!authRes.ok) {
        toastr.error('Du skal være logget ind for at bruge denne funktion!');
        return;
    }

    const barId = localStorage.getItem('selectedBarId');
    console.log('MustTry debug:', {
        barId: barId,
        localStorage: localStorage.getItem('selectedBarId'),
        allLocalStorage: { ...localStorage }
    });
    
    if (!barId) {
        toastr.error('BarId mangler! Debug: ' + barId);
        return;
    }

    const requestData = { barId };
    console.log('Sending mustTry request:', requestData);

    const res = await fetch('/mustTrys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(requestData)
    });

    if (res.ok) {
        toastr.success('Bar tilføjet til Must Try!');
    } else {
        const data = await res.json();
        console.error('MustTry error response:', data);
        toastr.error(data.error || 'Kunne ikke tilføje baren.');
    }
});