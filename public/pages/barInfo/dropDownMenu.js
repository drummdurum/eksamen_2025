const addToListBtn = document.getElementById('addToListBtn');
const dropdownMenu = document.getElementById('dropdownMenu');

addToListBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('hidden');
});

dropdownMenu.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    const listType = btn.dataset.list;
    const barId = localStorage.getItem('selectedBarId');
    if (!barId) {
      toastr.error('Bar-id ikke fundet!');
      return;
    }
    try {
      const res = await fetch('/newType', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: listType, barId })
      });
      const data = await res.json();
      if (res.ok) {
        toastr.success(data.message || `Tilføjet til: ${listType}`);
      } else {
        toastr.error(data.error || 'Noget gik galt');
      }
    } catch (err) {
      toastr.error('Du skal være logget ind for at tilføje til listen');
    }
    dropdownMenu.classList.add('hidden');
  });
});

document.addEventListener('click', (e) => {
   if (!dropdownMenu.contains(e.target) && e.target !== addToListBtn) {
     dropdownMenu.classList.add('hidden');
   }
});