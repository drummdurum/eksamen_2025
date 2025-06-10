// Eksempel: Hent kurv fra localStorage og vis ordre
let userId = null;
 if (!userId) {
    try {
     const res = await fetch('/me', { credentials: 'include' });
        if (res.ok) {
        const me = await res.json();
        console.log('me:', me);
        userId = me.user.userId;
        }
    } catch {}
  }

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

  // Her kan du sende ordre og leveringsinfo til backend
document.getElementById('paymentForm').onsubmit = async (e) => {
  e.preventDefault();

  // Hent formdata
  const form = e.target;
  const name = form.name.value;
  const address = form.address.value;
  const zip = form.zip.value;
  const city = form.city.value;
  const email = form.email.value;

  // Hent kurv og total igen (for sikkerhed)
  const cart = JSON.parse(localStorage.getItem(`Cart_${userId}`) || '[]');
  let total = 0;
  cart.forEach(item => {
    let price = 199;
    if (item.hat) price += 49;
    if (item.glove) price += 49;
    if (item.pants) price += 49;
    if (item.skirt) price += 49;
    total += price;
  });

  // Send til backend for Stripe Checkout
  const res = await fetch('/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, address, zip, city, email, cart, total })
  });
  const data = await res.json();
  if (data.url) {
    window.location.href = data.url; // send til Stripe Checkout
  }
};