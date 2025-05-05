

// Hent token fra URL'en
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

if (!token) {
    toastr.error('Token mangler. Prøv igen.');
    
    window.location.href = '/forgottenKode';
}


console.log('Token:', token);


document.querySelector('.reset-form').addEventListener('submit', async function (event) {
    event.preventDefault(); 

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!password || password.length < 4) {
        toastr.error('Signup: Password skal være mindst 4 tegn langt!');
        return;
    }

    if (!/[A-Z]/.test(password)) {
        toastr.error('Signup: Password skal indeholde mindst ét stort bogstav!');
        return;
    }

    if (!/[0-9]/.test(password)) {
        toastr.error('Signup: Password skal indeholde mindst ét tal!');
        return;
    }

    if (password !== confirmPassword) {
        toastr.error('Adgangskoderne stemmer ikke overens!');
        return;
    }

    try {
        const response = await fetch('/updateNewPass', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, newPassWord: password }),
        });

        const responseData = await response.json();
        
        if (!response.ok) {
            toastr.error(`Fejl: ${responseData.message}`);
            return;
        }
            
        window.location.href = '/login?message=Password%20updated%20successfully'; 
    } catch (error) {
        console.error('Netværksfejl:', error);
        toastr.error('Der opstod en netværksfejl. Prøv igen senere.');
    }
});


