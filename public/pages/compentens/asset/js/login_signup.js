
function flipCard() {
const container = document.querySelector('.form-container');
container.classList.toggle('flipped');
}
$(document).ready(function () {
    const messageElement = document.getElementById('message');
    if (messageElement && messageElement.textContent.trim()) {
        toastr.error(messageElement.textContent.trim());
    }
});
  function validateInputs(formType){
    let username, password;
    
    if(formType === 'login'){
        username = document.getElementById('username').value.trim();
        password = document.getElementById('password').value.trim();
    } 

     if (formType === 'login' && (!username || username.length < 3)) {
        toastr.error('login: brugernavn er ikke rigtigt!');
        return false; 
    }

    if (!password && formType === 'login') {
        toastr.error('Login: Password er påkrævet!');
        return false; 
    }

        
    if (formType === 'login') {
        fetch('/loginSent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message === 'Login successful! Welcome, Admin!' || data.message === 'Login successful! Welcome, User!') {
                    toastr.success(data.message);
                    window.location.href = '/'; 
                } else {
                    toastr.error(data.message); 
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                toastr.error('Noget gik galt. Prøv igen senere.');
            });

        return false; 
    }
    return true; 

    
}

document.querySelector('.signup-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Forhindrer standardformularindsendelse

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

  
    if (!data.username || data.username.length < 3) {
        toastr.error('Signup: Brugernavn skal være mindst 3 tegn!');
        return;
    }

    if (!data.password || data.password.length < 4) {
        toastr.error('Signup: Password skal være mindst 4 tegn langt!');
        return;
    }

    if (!/[A-Z]/.test(data.password)) {
        toastr.error('Signup: Password skal indeholde mindst ét stort bogstav!');
        return;
    }

    if (!/[0-9]/.test(data.password)) {
        toastr.error('Signup: Password skal indeholde mindst ét tal!');
        return;
    }

    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        toastr.error('Signup: Indtast en gyldig e-mailadresse!');
        return;
    }

    try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            toastr.success(result.message);


            setTimeout(() => {
                window.location.href = '/';
            }, 2000); 
        } else {
            
            toastr.error(result.message);
        }
    } catch (error) {
        console.error('Fejl under oprettelse af bruger:', error);
        toastr.error('Noget gik galt. Prøv igen senere.');
    }
});