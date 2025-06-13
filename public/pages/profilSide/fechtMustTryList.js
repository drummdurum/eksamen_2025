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

    // Lav et klikbart navn
    const nameBtn = document.createElement('button');
    nameBtn.textContent = `${bar.name} (${bar.vicinity})`;
    nameBtn.classList.add('text-blue-600', 'hover:underline');
    nameBtn.style.background = 'none';
    nameBtn.style.border = 'none';
    nameBtn.style.padding = '0';
    nameBtn.style.cursor = 'pointer';
    nameBtn.addEventListener('click', () => {
        localStorage.setItem('selectedBarId', bar.id);
        window.location.href = '/barInfo';
    });

    li.appendChild(nameBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️';
    deleteBtn.title = 'Fjern fra must try';
    deleteBtn.classList.add('text-red-400', 'hover:text-red-600', 'transition', 'ml-2');
    deleteBtn.addEventListener('click', async (e) => {
        e.stopPropagation(); 
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