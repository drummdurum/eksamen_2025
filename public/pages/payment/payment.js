async function autofillUserInfo() {
  try {
    const res = await fetch('/meInfo', { credentials: 'include' });
    if (res.ok) {
      const me = await res.json();
      if (me.user) {
          document.getElementById('name').value = me.user.name || '';
          document.getElementById('email').value = me.user.email || '';
          const userId = me.user.id; 

          const cartKey = `Cart_${userId}`;
          const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
          const orderList = document.getElementById('orderList');
          const totalPriceEl = document.getElementById('totalPrice');
          let total = 0;

          orderList.innerHTML = cart.map((item, idx) => {
            let price = 199;
            if (item.hat) price += 49;
            if (item.glove) price += 49;
            if (item.pants) price += 49;
            if (item.skirt) price += 49;
            total += price;
            return `<li class="mb-1">Person ${idx + 1}: ${item.size}, ${item.color} - <span class="font-bold">${price} kr.</span></li>`;
          }).join('');
          totalPriceEl.textContent = total + " kr.";

          
          window._currentUserId = userId;
          window._currentCart = cart;
          window._currentTotal = total;
        }
    }
  } catch (err) { }
}

autofillUserInfo();

document.getElementById('paymentForm').onsubmit = async (e) => {
  e.preventDefault();

  const form = e.target;
  const name = form.name.value;
  const address = form.address.value;
  const zip = form.zip.value;
  const city = form.city.value;
  const email = form.email.value;


    if (!name || !address || !zip || !city || !email) {
    toastr.error("Alle felter skal udfyldes.");
    return;
  }
    if (name.split(' ').length < 2) {
    toastr.error("Indtast både fornavn og efternavn.");
    return;
  }
    if (!/^\d{4}$/.test(zip)) {
      toastr.error("Postnummer skal være 4 cifre.");
      return;
    }
    if (!/[a-zA-ZæøåÆØÅ]/.test(address) || !/\d/.test(address)) {
    toastr.error("Indtast en gyldig adresse (fx med vejnavn og husnummer).");
    return;
  }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toastr.error("Indtast en gyldig email.");
      return;
    }
    if (!/^[a-zA-ZæøåÆØÅ\s-]+$/.test(city)) {
    toastr.error("Indtast en gyldig by.");
    return;
  }

  const userId = window._currentUserId;
  const cart = window._currentCart || [];
  const total = window._currentTotal || 0;

  const res = await fetch('/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, address, zip, city, email, cart, total })
  });
  const data = await res.json();
  if (data.url) {
    window.location.href = data.url; 
  }
};