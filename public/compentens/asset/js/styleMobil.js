document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const cartBtnMobile = document.getElementById('cartBtnMobile');
  const cartBtn = document.getElementById('cartBtn');

  if (menuToggle && mobileMenu) {
    menuToggle.onclick = () => {
      mobileMenu.classList.toggle('hidden');
    };

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#menuToggle') && !e.target.closest('#mobileMenu')) {
        mobileMenu.classList.add('hidden');
      }
    });
  }

  if (cartBtnMobile && cartBtn) {
    cartBtnMobile.onclick = () => {
      cartBtn.click();
      mobileMenu.classList.add('hidden');
    };
  }
});