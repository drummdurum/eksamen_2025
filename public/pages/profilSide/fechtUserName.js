fetch('/username')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('username-display').textContent = `Hej ${data.username}!`;
        document.getElementById('username').value = data.username;
        document.getElementById('email').value = data.email;
    })
    .catch(error => console.error('Error fetching username:', error));