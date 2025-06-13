async function fetchOrders() {
  const res = await fetch('/orders/all');
  const orders = await res.json();
  const tbody = document.getElementById('ordersTable');
  tbody.innerHTML = '';
  orders.forEach(order => {
    // Vis order_data pænt
 let orderContent = '';
if (Array.isArray(order.order_data)) {
orderContent = `
  <div class="flex flex-row gap-2 overflow-x-auto">
    ${order.order_data.map(item => `
      <div class="bg-gray-50 border rounded p-2 min-w-[180px] text-xs leading-relaxed space-y-1 shadow-sm">
        ${Object.entries(item).map(([k, v]) => `
          <p><strong class="capitalize">${k}:</strong> ${v}</p>
        `).join('')}
      </div>
    `).join('')}
  </div>
`;
} else {
  orderContent = `<pre class="text-xs">${JSON.stringify(order.order_data, null, 2)}</pre>`;
}

   tbody.innerHTML += `
  <tr>
    <td class="p-2">${order.id}</td>
    <td class="p-2">${order.user_id}</td>
    <td class="p-2">${order.name}</td>
    <td class="p-2">${order.address}</td>
    <td class="p-2">${order.zip}</td>
    <td class="p-2">${order.city}</td>
    <td class="p-2">${order.email}</td>
    <td class="p-2 align-top max-w-[400px] overflow-x-auto">
    ${orderContent}
    </td>
    <td class="p-2">${order.total_price} kr.</td>
    <td class="p-2" id="status-${order.id}">${order.status}</td>
    <td class="p-2">${new Date(order.created_at).toLocaleString()}</td>
    <td class="p-2">
      <button data-id="${order.id}" data-status="sent" class="status-btn bg-blue-500 text-white px-2 py-1 rounded mr-2">Sendt</button>
      <button data-id="${order.id}" data-status="delivered" class="status-btn bg-green-500 text-white px-2 py-1 rounded">Leveret</button>
    </td>
  </tr>
`;
  });
}

document.getElementById('ordersTable').addEventListener('click', function(e) {
  if (e.target.matches('.status-btn')) {
    const id = e.target.dataset.id;
    const status = e.target.dataset.status;
    updateStatus(id, status);
  }
});

async function updateStatus(id, status) {
 const res = await fetch(`/orders/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
    });
    if (res.ok) {
        document.getElementById(`status-${id}`).textContent = status;
    } else {
        toastr.error("Kunne ikke opdatere status!");
    }
}

fetchOrders();