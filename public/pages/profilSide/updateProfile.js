function validateInputs(formType){
    let username, password;
    
    if(formType === 'update-profil'){
        username = document.getElementById('username').value.trim();
        password = document.getElementById('password').value.trim();
    } 
}


document.querySelector('.update-profil').addEventListener('submit', async function (event) {
    event.preventDefault(); 

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    console.log(data);

    if (!data.username || data.username.length < 3) {
        toastr.error('Update: Brugernavn skal være mindst 3 tegn!');
        return;
    }
    const forbiddenChars = /[-'']/;
    if(forbiddenChars.test(data.username)){
        toastr.error('update: User name, må ikke indholde - eller enkelt anførselstegn!' )
        return;
    }

    if (data.password) {
        if (data.password.length < 4) {
            toastr.error('Update: Password skal være mindst 4 tegn langt!');
            return;
        }
        if (!/[A-Z]/.test(data.password)) {
            toastr.error('Update: Password skal indeholde mindst ét stort bogstav!');
            return;
        }
        if (!/[0-9]/.test(data.password)) {
            toastr.error('Update: Password skal indeholde mindst ét tal!');
            return;
        }
        if(data.password !== data['confirm-password']){
            toastr.error('Update: Password og bekræftelse skal være ens!');
            return;
        }
    } else {
       
        delete data.password;
        delete data['confirm-password'];
    }

    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        toastr.error('Signup: Indtast en gyldig e-mailadresse!');
        return;
    }

    try {
        const response = await fetch('/user', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            toastr.success(result.message);

            setTimeout(() => {
                window.location.href = '/profile';
            }, 2000); 
        } else {
            toastr.error(result.message);
        }
    } catch (error) {
        console.error('Fejl under oprettelse af bruger:', error);
        toastr.error('Noget gik galt. Prøv igen senere.');
    }
});