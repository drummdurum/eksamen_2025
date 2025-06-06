document.addEventListener('DOMContentLoaded', async () => {
    const list = document.getElementById('cralwList');
    list.innerHTML = "";

    try {
        const res = await fetch('/routes', { credentials: 'include' });
        if (!res.ok) {
            list.innerHTML = "<li>Du skal være logget ind for at se dine ruter.</li>";
            return;
        }
        const routes = await res.json();
        if (routes.length === 0) {
            list.innerHTML = "<li>Du har ingen gemte ruter endnu.</li>";
            return;
        }
        routes.forEach(route => {
            const li = document.createElement('li');
            li.classList.add('flex', 'items-center', 'gap-2', 'mb-1');

            const nameSpan = document.createElement('span');
            nameSpan.textContent = route.name;
            nameSpan.classList.add('cursor-pointer', 'hover:text-green-400', 'transition');
            nameSpan.addEventListener('click', () => {
                window.location.href = `/makesRoutes?routeId=${route.id}`;
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '🗑️';
            deleteBtn.title = 'Slet rute';
            deleteBtn.classList.add('text-red-400', 'hover:text-red-600', 'transition', 'ml-2');
            deleteBtn.addEventListener('click', async (e) => {
                    const delRes = await fetch(`/routes/${route.id}`, {
                        method: 'DELETE',
                        credentials: 'include'
                    });
                    if (delRes.ok) {
                        li.remove();
                    } else {
                        toastr.error('Kunne ikke slette ruten.');
                    }
            });

            li.appendChild(nameSpan);
            li.appendChild(deleteBtn);
            list.appendChild(li);
        });
    } catch (err) {
        list.innerHTML = "<li>Kunne ikke hente ruter.</li>";
    }
});