
function flipCard() {
const container = document.querySelector('.form-container');
container.classList.toggle('flipped');
}
$(document).ready(function() {
    toastr.success('Hej! Dette er en succesbesked.');
  });
  
  function validateInputs(formType){
    let username, password;
    
    if(formType === 'login'){
        username = document.getElementById('username').value.trim();
        password = document.getElementById('password').value.trim();
    } else if(formType === 'signup'){
        username = document.getElementById('username').value.trim();
        password = document.getElementById('password').value.trim();
    }

     if (!username || username.length < 3) {
        toastr.error(
            formType === 'login'
                ? 'login: brugernavn er ikke rigtigt!'
                : 'Signup: Brugernavn skal være mindst 3 tegn!'
        );
        console.log('Brugernavn er for kort!');
        return false; // Stop formularen fra at blive indsendt
    }

    // Validering for password
    if (!password) {
        toastr.error(
            formType === 'login'
                ? 'Login: Password er påkrævet!'
                : 'Signup: Password er påkrævet!'
        );
        return false; // Stop formularen fra at blive indsendt
    }

    // Ekstra validering for signup (f.eks. stærkt password)
    if (formType === 'signup') {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/;
        if (!passwordRegex.test(password)) {
            toastr.error(
                'Signup: Password skal være mindst 4 tegn langt og indeholde store bogstaver, små bogstaver, tal og specialtegn!'
            );
            console.log('Password opfylder ikke kravene!');
            return false; // Stop formularen fra at blive indsendt
        }
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
                } else {
                    toastr.error(data.message); // Fejl fra backend
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                toastr.error('Noget gik galt. Prøv igen senere.');
            });

        return false; // Stop formularen fra at blive indsendt
    }

    toastr.success('Inputs are valid!');
    return true; // Tillad formularen at blive indsendt

}