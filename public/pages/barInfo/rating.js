const starRating = document.getElementById('starRating');
const ratingMessage = document.getElementById('ratingMessage');
const dropdownMenuMood = document.getElementById('dropdownMenuMood');
let selectedRating = 0;

let hasVoted = localStorage.getItem('hasVoted_' + barId) === 'true';

if (starRating) {
  starRating.querySelectorAll('span').forEach(star => {
    star.addEventListener('mouseenter', () => {
      if (!hasVoted) {
        const val = parseInt(star.dataset.star);
        highlightStars(val);
      }
    });
    star.addEventListener('mouseleave', () => {
      if (!hasVoted) highlightStars(selectedRating);
    });
    star.addEventListener('click', async () => {
      if (hasVoted) {
        toastr.warning('Du har allerede stemt på denne bar!')
        return; 
      }
      selectedRating = parseInt(star.dataset.star);
      highlightStars(selectedRating);
      ratingMessage.textContent = `Du har givet ${selectedRating} stjerne${selectedRating > 1 ? 'r' : ''}!`;

      const barId = localStorage.getItem('selectedBarId');
      if (!barId) {
        toastr.error('Bar-id ikke fundet!');
        return;
      }

      try {
        const res = await fetch('/bars/ratings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ barId, rating: selectedRating })
        });
        const data = await res.json();
        if (res.ok) {
            toastr.success(data.message || 'Tak for din stemme!');
            hasVoted = true; 
            localStorage.setItem('hasVoted_' + barId, 'true');
        } else {
          toastr.error(data.error || 'Noget gik galt');
        }
      } catch (err) {
        toastr.error('Netværksfejl');
      }
    });
  });
}

function highlightStars(rating) {
  starRating.querySelectorAll('span').forEach(star => {
    star.innerHTML = parseInt(star.dataset.star) <= rating ? '&#9733;' : '&#9734;';
  });
}


