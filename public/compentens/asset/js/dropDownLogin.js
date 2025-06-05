document.addEventListener('DOMContentLoaded', function() {
  const profileMenuBtn = document.getElementById('profileMenuBtn');
  const profileDropdown = document.getElementById('profileDropdown');
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  if (profileMenuBtn && profileDropdown) {
    profileMenuBtn.addEventListener('click', function() {
      profileDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', function(e) {
      if (!profileMenuBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
        profileDropdown.classList.add('hidden');
      }
    });
  }

function updateProfileMenuWithSession() {
  fetch('/me', { credentials: 'include' }) // credentials: 'include' sender cookies med
    .then(res => res.ok ? res.json() : null)
    .then(user => {
      const isLoggedIn = !!user;
      if (loginBtn) loginBtn.style.display = isLoggedIn ? 'none' : 'block';
      if (logoutBtn) logoutBtn.style.display = isLoggedIn ? 'block' : 'none';
    })
    .catch(() => {
      if (loginBtn) loginBtn.style.display = 'block';
      if (logoutBtn) logoutBtn.style.display = 'none';
    });
}

updateProfileMenuWithSession();
});