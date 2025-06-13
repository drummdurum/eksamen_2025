const outfitTypes = {
  golf: {
    title: "Køb Golf-outfit",
    addLabel: "+ Tilføj person",
    itemLabel: idx => `Person ${idx + 1}`,
    fields: [
      { name: "size", label: "Størrelse", type: "select", options: ["S", "M", "L", "XL"] },
      { name: "color", label: "Farve", type: "select", options: ["green skjorte", "white skjorte", "black skjorte"] },
      { name: "hat", label: "Hat", type: "checkbox" },
      { name: "glove", label: "Golfhandske", type: "checkbox" },
      { name: "pants", label: "Bukser", type: "checkbox" },
      { name: "skirt", label: "Nederdel", type: "checkbox" }
    ]
  },
  bodega: {
    title: "Køb Bodega-vest",
    addLabel: "+ Tilføj vest",
    itemLabel: idx => `Vest ${idx + 1}`,
    fields: [
      { name: "size", label: "Størrelse", type: "select", options: ["S", "M", "L", "XL"] },
      { name: "color", label: "Farve", type: "select", options: ["sort vest", "grøn vest"] }
    ]
  }
};

let currentType = null;
let userId = null;

const outfitModal = document.getElementById('outfitModal');
const outfitForm = document.getElementById('outfitForm');
const outfitModalTitle = document.getElementById('outfitModalTitle');
const outfitPersonsContainer = document.getElementById('outfitPersonsContainer');
const addOutfitPersonBtn = document.getElementById('addOutfitPersonBtn');
const cancelOutfitBtn = document.getElementById('cancelOutfit');

function createOutfitFields(idx, type) {
  const config = outfitTypes[type];
  const div = document.createElement('div');
  div.className = "border border-gray-700 rounded p-3 flex flex-col gap-2 bg-gray-700";
  div.innerHTML = `
    <div class="flex justify-between items-center">
      <span class="font-semibold text-white">${config.itemLabel(idx)}</span>
      <button type="button" class="removeOutfitPersonBtn text-red-400 hover:text-red-600 text-lg" title="Fjern">&times;</button>
    </div>
    ${config.fields.map(field => {
      if (field.type === "select") {
        return `<label class="text-gray-200">${field.label}:
          <select name="${field.name}" class="w-full p-2 rounded bg-gray-800 text-white border border-gray-600">
            ${field.options.map(opt => `<option value="${opt}">${opt.charAt(0).toUpperCase() + opt.slice(1)}</option>`).join('')}
          </select>
        </label>`;
      }
      if (field.type === "checkbox") {
        return `<label class="text-gray-200"><input type="checkbox" name="${field.name}" class="mr-1"> ${field.label}</label>`;
      }
      return '';
    }).join('')}
  `;
  div.querySelector('.removeOutfitPersonBtn').onclick = () => {
    div.remove();
    updateOutfitPersonLabels(type);
  };
  return div;
}

function updateOutfitPersonLabels(type) {
  const config = outfitTypes[type];
  outfitPersonsContainer.querySelectorAll('span.font-semibold').forEach((el, idx) => {
    el.textContent = config.itemLabel(idx);
  });
}


function openOutfitModal(type) {
  currentType = type;
  outfitModalTitle.textContent = outfitTypes[type].title;
  addOutfitPersonBtn.textContent = outfitTypes[type].addLabel;
  outfitPersonsContainer.innerHTML = '';
  outfitPersonsContainer.appendChild(createOutfitFields(0, type));
  outfitModal.classList.remove('hidden');
}

addOutfitPersonBtn.onclick = () => {
  if (!currentType) return;
  outfitPersonsContainer.appendChild(createOutfitFields(outfitPersonsContainer.children.length, currentType));
  updateOutfitPersonLabels(currentType);
};


cancelOutfitBtn.onclick = () => {
  outfitModal.classList.add('hidden');
  outfitPersonsContainer.innerHTML = '';
  currentType = null;
};


document.getElementById('outfits').onclick = () => openOutfitModal('golf');
document.getElementById('BodegaOutfits').onclick = () => openOutfitModal('bodega');


outfitForm.onsubmit = async (e) => {
  e.preventDefault();
  const config = outfitTypes[currentType];
  const items = [];
  outfitPersonsContainer.querySelectorAll('div.border').forEach(div => {
    const item = {};
    config.fields.forEach(field => {
      if (field.type === "select") {
        item[field.name] = div.querySelector(`select[name="${field.name}"]`).value;
      } else if (field.type === "checkbox") {
        item[field.name] = div.querySelector(`input[name="${field.name}"]`).checked;
      }
    });
    item.type = currentType;
    items.push(item);
  });

  if (!userId) {
    try {
      const res = await fetch('/me', { credentials: 'include' });
      if (res.ok) {
        const me = await res.json();
        userId = me.user.userId;
      }
    } catch {}
  }

  if (!userId) {
    toastr.error("Du skal være logget ind for at gemme din kurv.");
    return;
  }

  const cartKey = `Cart_${userId}`;
  const oldCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
  const newCart = oldCart.concat(items);
  localStorage.setItem(cartKey, JSON.stringify(newCart));
  toastr.success("Din kurv er opdateret!");
  outfitModal.classList.add('hidden');
  outfitPersonsContainer.innerHTML = '';
  currentType = null;
};

document.getElementById('BodegaRoute').onclick = function() {
  const barIds = this.dataset.barIds;
  if (barIds) {
    window.location.href = `/makesRoutes?bars=${barIds}`;
  }
};

