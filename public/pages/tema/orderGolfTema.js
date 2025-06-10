const personsContainer = document.getElementById('personsContainer');
const addPersonBtn = document.getElementById('addPersonBtn');
let personCount = 0;
let userId = null;

function createPersonFields(idx) {
  const div = document.createElement('div');
  div.className = "border border-gray-700 rounded p-3 flex flex-col gap-2 bg-gray-700";
  div.innerHTML = `
    <div class="flex justify-between items-center">
      <span class="font-semibold text-white">Person ${idx + 1}</span>
      <button type="button" class="removePersonBtn text-red-400 hover:text-red-600 text-lg" title="Fjern person">&times;</button>
    </div>
    <label class="text-gray-200">Størrelse:
      <select name="size" class="w-full p-2 rounded bg-gray-800 text-white border border-gray-600">
        <option value="S">Small</option>
        <option value="M">Medium</option>
        <option value="L">Large</option>
        <option value="XL">X-Large</option>
      </select>
    </label>
    <label class="text-gray-200">Farve:
      <select name="color" class="w-full p-2 rounded bg-gray-800 text-white border border-gray-600">
        <option value="green">Grøn</option>
        <option value="white">Hvid</option>
        <option value="black">Sort</option>
      </select>
    </label>
    <div class="flex gap-4 flex-wrap text-gray-200">
      <label><input type="checkbox" name="hat" class="mr-1"> Hat</label>
      <label><input type="checkbox" name="glove" class="mr-1"> Golfhandske</label>
      <label><input type="checkbox" name="pants" class="mr-1"> Bukser</label>
      <label><input type="checkbox" name="skirt" class="mr-1"> Nederdel</label>
    </div>
  `;
  // Fjern person
  div.querySelector('.removePersonBtn').onclick = () => {
    div.remove();
    updatePersonLabels();
  };
  return div;
}

function updatePersonLabels() {
  personsContainer.querySelectorAll('span.font-semibold').forEach((el, idx) => {
    el.textContent = `Person ${idx + 1}`;
  });
}

addPersonBtn.onclick = () => {
  personsContainer.appendChild(createPersonFields(personsContainer.children.length));
  updatePersonLabels();
};

addPersonBtn.onclick();

document.getElementById('cancelOutfit').onclick = () => {
  document.getElementById('outfitModal').classList.add('hidden');
  personsContainer.innerHTML = '';
  addPersonBtn.onclick();
};

document.getElementById('outfitForm').onsubmit = (e) => {
  e.preventDefault();
  const persons = [];
  personsContainer.querySelectorAll('div.border').forEach(div => {
    const size = div.querySelector('select[name="size"]').value;
    const color = div.querySelector('select[name="color"]').value;
    const hat = div.querySelector('input[name="hat"]').checked;
    const glove = div.querySelector('input[name="glove"]').checked;
    const pants = div.querySelector('input[name="pants"]').checked;
    const skirt = div.querySelector('input[name="skirt"]').checked;
    persons.push({ size, color, hat, glove, pants, skirt });
  });
  // Her kan du sende persons til backend eller vise en besked
  alert(JSON.stringify(persons, null, 2));
  document.getElementById('outfitModal').classList.add('hidden');
  personsContainer.innerHTML = '';
  addPersonBtn.onclick();
};

document.getElementById('outfits').addEventListener('click', () => {
  document.getElementById('outfitModal').classList.remove('hidden');
});

document.getElementById('outfitForm').onsubmit = async (e) => {
  e.preventDefault();
  const persons = [];
  personsContainer.querySelectorAll('div.border').forEach(div => {
    const size = div.querySelector('select[name="size"]').value;
    const color = div.querySelector('select[name="color"]').value;
    const hat = div.querySelector('input[name="hat"]').checked;
    const glove = div.querySelector('input[name="glove"]').checked;
    const pants = div.querySelector('input[name="pants"]').checked;
    const skirt = div.querySelector('input[name="skirt"]').checked;
    persons.push({ size, color, hat, glove, pants, skirt });
  });

  if (!userId) {
    try {
     const res = await fetch('/me', { credentials: 'include' });
        if (res.ok) {
        const me = await res.json();
        console.log('me:', me); // Se hvad du faktisk får!
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
    const newCart = oldCart.concat(persons);
    localStorage.setItem(cartKey, JSON.stringify(newCart));
    toastr.success("Din kurv er gemt!");
    document.getElementById('outfitModal').classList.add('hidden');
    personsContainer.innerHTML = '';
    addPersonBtn.onclick();
};