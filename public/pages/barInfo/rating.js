const starRating = document.getElementById('starRating');
const ratingMessage = document.getElementById('ratingMessage');

let selectedRating = 0;
let hasVoted = localStorage.getItem('hasVoted_' + barId) === 'true';

async function loadRatings() {
  try {
    const res = await fetch(`/bars/${barId}`);
    if (res.ok) {
      const bar = await res.json();
      document.getElementById('googleRatingText').textContent = bar.rating ? `${bar.rating.toFixed(1)} / 5` : 'Ingen';
      document.getElementById('googleVotesText').textContent = bar.user_ratings_total ? `(${bar.user_ratings_total} stemmer)` : '';
      document.getElementById('avgRatingText').textContent =
        bar.bartobar_rating && bar.bartobar_votes > 0 ? bar.bartobar_rating.toFixed(1) : '0.0';
      document.getElementById('totalVotesText').textContent =
        bar.bartobar_votes > 0 ? `(${bar.bartobar_votes} stemmer)` : '(0 stemmer)';
    }
  } catch (err) {
    
  }
}
loadRatings();

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
        toastr.warning('Du har allerede stemt på denne bar!');
        return;
      }
      selectedRating = parseInt(star.dataset.star);
      highlightStars(selectedRating);
      ratingMessage.textContent = `Du har givet ${selectedRating} stjerne${selectedRating > 1 ? 'r' : ''}!`;

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
          updateAverageUI(data.newAvg, data.newCount);
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

const socket = io();
socket.emit('joinBar', barId);

socket.on('newRating', ({ newAvg, newCount }) => {
  updateAverageUI(newAvg, newCount);
});

function updateAverageUI(avg, count) {
  const avgSpan = document.getElementById('avgRatingText');
  const countSpan = document.getElementById('totalVotesText');
  if (avgSpan) avgSpan.textContent = avg.toFixed(1);
  if (countSpan) countSpan.textContent = `(${count} stemmer)`;
}