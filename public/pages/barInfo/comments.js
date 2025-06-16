const openBtn = document.getElementById('openCommentModal');
const modal = document.getElementById('commentModal');
const closeBtn = document.getElementById('closeModal');
const sendBtn = document.getElementById('sendModalComment');
const modalTextarea = document.getElementById('modalComment');
const commentsUl = document.getElementById('commentsUl');

let username = null;

async function fetchUsername() {
  try {
    const res = await fetch('/username');
    if (res.ok) {
      const user = await res.json();
      username = user.username;
    } else {
      username = null;
    }
  } catch (err) {
    username = null;
  }
}

openBtn.addEventListener('click', async () => {
  await fetchUsername();
  if (!username) {
    toastr.error('Du skal være logget ind for at skrive en kommentar!');
    return;
  }
  modal.classList.remove('hidden');
  modalTextarea.value = '';
});

closeBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});


async function loadComments() {
  const res = await fetch(`/bars/${barId}/comments`);
  const comments = await res.json();
  commentsUl.innerHTML = '';
  if (comments.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'Vær den første til at skrive en kommentar!';
    li.className = 'text-gray-400 italic';
    commentsUl.appendChild(li);
    return;
  }
  comments.forEach(c => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="font-bold">${c.username || 'Ukendt bruger'}:</span> ${c.text}`;
    commentsUl.appendChild(li);
  });
}

loadComments();


sendBtn.addEventListener('click', async () => {
  const text = modalTextarea.value.trim();
  if (!text || !username) return;

  try {
    const res = await fetch('/bars/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ barId, text, username }),
    });

    if (res.status === 401) {
      toastr.error('Du skal være logget ind for at skrive en kommentar!');
      return;
    }

    modal.classList.add('hidden');
    modalTextarea.value = '';
  } catch (err) {
    toastr.error('Fejl: Kunne ikke sende kommentaren.');
  }
});


socket.emit('joinBar', barId);

socket.on('newComment', (data) => {
  const li = document.createElement('li');
  li.innerHTML = `<span class="font-bold">${data.username}:</span> ${data.text}`;
  commentsUl.appendChild(li);
});