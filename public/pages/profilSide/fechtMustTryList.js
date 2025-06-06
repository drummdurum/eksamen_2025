document.addEventListener('DOMContentLoaded', async () => {
    const list = document.getElementById('mustTryList');
    list.innerHTML = "";

    try {
        const res = await fetch('/mustTrys', { credentials: 'include' });
        if (!res.ok) {
            list.innerHTML = "<li>Du skal være logget ind for at se din must try-liste.</li>";
            return;
        }
        const bars = await res.json();
        if (bars.length === 0) {
            list.innerHTML = "<li>Du har ingen barer på din must try-liste endnu.</li>";
            return;
        }
        bars.forEach(bar => {
            const li = document.createElement('li');
            li.classList.add('flex', 'items-center', 'gap-2', 'mb-1');
            li.textContent = `${bar.name} (${bar.vicinity})`;

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '🗑️';
            deleteBtn.title = 'Fjern fra must try';
            deleteBtn.classList.add('text-red-400', 'hover:text-red-600', 'transition', 'ml-2');
            deleteBtn.addEventListener('click', async (e) => {
                    const delRes = await fetch(`/mustTrys/${bar.id}`, {
                        method: 'DELETE',
                        credentials: 'include'
                    });
                    if (delRes.ok) {
                        li.remove();
                    } else {
                        toastr.error('Kunne ikke fjerne baren.');
                    }
            });

            li.appendChild(deleteBtn);
            list.appendChild(li);
        });
    } catch (err) {
        list.innerHTML = "<li>Kunne ikke hente must try-listen.</li>";
    }
});