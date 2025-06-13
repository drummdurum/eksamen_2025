(async () => {
  let userId = null;
  try {
    const res = await fetch('/me', { credentials: 'include' });
    if (res.ok) {
      const me = await res.json();
      userId = me.user.userId;
    }
  } catch {}
  if (userId) {
    localStorage.removeItem(`Cart_${userId}`);
  }
})();