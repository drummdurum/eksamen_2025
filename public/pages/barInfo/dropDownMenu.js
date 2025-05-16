function setupDropdown(btnId, menuId, moodId) {
  const btn = document.getElementById(btnId);
  const menu = document.getElementById(menuId);
  const mood = document.getElementById(moodId);

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('hidden');
  });

  menu.querySelectorAll('button').forEach(btn => {
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
      menu.classList.add('hidden');
    });
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && e.target !== btn) {
      menu.classList.add('hidden');
    }
  });
}

// Kald funktionen for hver dropdown
setupDropdown('addToListBtnDrinks', 'dropdownMenuDrinks');
setupDropdown('addToListBtnGames', 'dropdownMenuGames');
setupDropdown('addToListBtnMood', 'dropdownMenuMood');