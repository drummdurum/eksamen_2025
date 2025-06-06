
document.getElementById('addToCrawlBtn').addEventListener('click', async (e) => {
    e.stopPropagation();
    const dropdown = document.getElementById('crawlDropdown');
    dropdown.innerHTML = '';
    dropdown.classList.toggle('hidden');

    const res = await fetch('/routes', { credentials: 'include' });
    if (!res.ok) {
        dropdown.innerHTML = '<div class="p-2">Du skal være logget ind</div>';
        return;
    }
    const routes = await res.json();

    routes.forEach(route => {
        const btn = document.createElement('button');
        btn.textContent = route.name;
        btn.className = 'block w-full text-left px-4 py-2 hover:bg-gray-200';
        btn.onclick = async () => {
            await addBarToRoute(route.id);
            dropdown.classList.add('hidden');
        };
        dropdown.appendChild(btn);
    });

    const newBtn = document.createElement('button');
    newBtn.textContent = '+ Opret ny liste';
    newBtn.className = 'block w-full text-left px-4 py-2 hover:bg-green-200 font-bold';
    newBtn.onclick = async () => {
        const name = await showRouteNameModal();
        if (name) {
            await createRouteWithBar(name);
            dropdown.classList.add('hidden');
        }
    };
    dropdown.appendChild(newBtn);
});

document.addEventListener('click', () => {
    document.getElementById('crawlDropdown').classList.add('hidden');
});

async function addBarToRoute(routeId) {
    const barId = localStorage.getItem('selectedBarId');
    const res = await fetch(`/routes/${routeId}/add-bar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ barId })
    });
    if (res.ok) {
        toastr.success('Bar tilføjet til listen!');
    } else {
        toastr.error('Kunne ikke tilføje baren.');
    }
}


async function createRouteWithBar(name) {
    const barId = localStorage.getItem('selectedBarId'); 
    const res = await fetch('/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, bars: [barId] })
    });
    if (res.ok) {
        toastr.success('Ny liste oprettet med baren!');
    } else {
        toastr.error('Kunne ikke oprette listen.');
    }
}

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
            input.removeEventListener('keydown', onKey);
        }
        function onSave() {
            cleanup();
            resolve(input.value.trim());
        }
        function onCancel() {
            cleanup();
            resolve(null);
        }
        function onKey(e) {
            if (e.key === 'Enter') onSave();
            if (e.key === 'Escape') onCancel();
        }
        saveBtn.addEventListener('click', onSave);
        cancelBtn.addEventListener('click', onCancel);
        input.addEventListener('keydown', onKey);
    });
}