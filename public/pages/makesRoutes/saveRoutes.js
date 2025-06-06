
import { selectedBars } from './../../pages/makesRoutes/searchBarRouter.js';
import { updateRouteOnMap } from './../../pages/makesRoutes/searchBarRouter.js';

document.getElementById('saveRouteBtn').addEventListener('click', async () => {
    const meRes = await fetch('/me', { credentials: 'include' });
    
    if (!meRes.ok) {
        toastr.error('Du skal være logget ind for at gemme en rute!');
        return;
    }
 
    const barIds = selectedBars.map(bar => bar.barId);

    const response = await fetch('/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: routeName, bars: barIds }),
    });

    if (response.ok) {
        toastr.success('Rute gemt!');
    } else {
        toastr.error('Kunne ikke gemme ruten.');
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const routeId = params.get('routeId');
    if (routeId) {
        
        const res = await fetch(`/routes/${routeId}`, { credentials: 'include' });
        if (res.ok) {
            const route = await res.json();
          selectedBars.length = 0; 
            route.bars.forEach(bar => {
                selectedBars.push({
                    name: bar.name,
                    address: bar.vicinity,
                    barId: bar.id
                });
            });
            console.log(selectedBars);
        updateRouteOnMap();
        }
    }
});

function showRouteNameModal() {
    return new Promise((resolve) => {
        const modal = document.getElementById('routeNameModal');
        const input = document.getElementById('routeNameInput');
        const saveBtn = document.getElementById('saveRouteName');
        const cancelBtn = document.getElementById('cancelRouteName');
        input.value = '';
        modal.classList.remove('hidden');
        input.focus();

        function cleanup() {
            modal.classList.add('hidden');
            saveBtn.removeEventListener('click', onSave);
            cancelBtn.removeEventListener('click', onCancel);
        }
        function onSave() {
            cleanup();
            resolve(input.value.trim());
        }
        function onCancel() {
            cleanup();
            resolve(null);
        }
        saveBtn.addEventListener('click', onSave);
        cancelBtn.addEventListener('click', onCancel);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') onSave();
            if (e.key === 'Escape') onCancel();
        });
    });
}

document.getElementById('saveRouteBtn').addEventListener('click', async () => {
    const meRes = await fetch('/me', { credentials: 'include' });
    if (!meRes.ok) {
        toastr.error('Du skal være logget ind for at gemme en rute!');
        return;
    }

    const routeName = await showRouteNameModal();
    if (!routeName) return;

    const barIds = selectedBars.map(bar => bar.barId);

    const response = await fetch('/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: routeName, bars: barIds }),
    });

    if (response.ok) {
        toastr.success('Rute gemt!');
    } else {
        toastr.error('Kunne ikke gemme ruten.');
    }
});