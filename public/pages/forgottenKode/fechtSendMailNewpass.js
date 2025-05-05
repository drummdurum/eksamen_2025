$(document).ready(function () {
    const messageElement = document.getElementById('message');
    if (messageElement && messageElement.textContent.trim()) {
        toastr.success(messageElement.textContent.trim());
    }
});

document.querySelector('.login-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Forhindrer standardformularindsendelse

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/sendMailForgottenKode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            
            const errorData = await response.json();
            console.error('Fejl:', errorData.message);
            toastr.error(`Fejl: ${errorData.message}`);
            return;
        }

        const responseData = await response.json();
        console.log(responseData.message); 
        toastr.success('E-mail til nulstilling af adgangskode er sendt!');
    } catch (error) {
        console.error('Netværksfejl:', error);
        toastr.error('Der opstod en netværksfejl. Prøv igen senere.');
    }
});


