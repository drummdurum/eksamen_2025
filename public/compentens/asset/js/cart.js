document.getElementById('cartBtn').addEventListener('click', async (e) => {
  e.stopPropagation();
  const dropdown = document.getElementById('cartDropdown');
  dropdown.classList.toggle('hidden');

  let userId = null;
  try {
    const res = await fetch('/me', { credentials: 'include' });
    if (res.ok) {
      const me = await res.json();
      userId = me.user.userId;
    }
  } catch {}

  if (!userId) {
    dropdown.innerHTML = '<div class="p-4 text-center text-gray-500">Du skal være logget ind for at se din kurv.</div>';
    return;
  }

  const cartKey = `Cart_${userId}`;
  const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
  if (!cart.length) {
    dropdown.innerHTML = '<div class="p-4 text-center text-gray-500">Kurven er tom.</div>';
    return;
  }

  dropdown.innerHTML = cart.map((item, idx) => `
    <div class="flex flex-col px-4 py-2 border-b last:border-b-0 relative">
      <button class="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl" data-remove="${idx}" title="Fjern">&times;</button>
      <span class="font-semibold">Person ${idx + 1}</span>
      <span>Størrelse: ${item.size}, Farve: ${item.color}</span>
      <span>
        ${item.hat ? '🎩 Hat ' : ''}
        ${item.glove ? '🧤 Handske ' : ''}
        ${item.pants ? '👖 Bukser ' : ''}
        ${item.skirt ? '👗 Nederdel ' : ''}
      </span>
    </div>
  `).join('') + `
    <div class="p-4 flex justify-center">
      <button id="payBtn" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Gå til betaling</button>
    </div>
  `;

  dropdown.querySelectorAll('button[data-remove]').forEach(btn => {
    btn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const idx = Number(btn.getAttribute('data-remove'));
      cart.splice(idx, 1);
      localStorage.setItem(cartKey, JSON.stringify(cart));
      // Opdater dropdown
      document.getElementById('cartBtn').click();
      document.getElementById('cartBtn').click();
    });
  });

  
  const payBtn = document.getElementById('payBtn');
  if (payBtn) {
    payBtn.onclick = () => window.location.href = '/payment'; 
  }
});

document.addEventListener('click', () => {
  document.getElementById('cartDropdown').classList.add('hidden');
});