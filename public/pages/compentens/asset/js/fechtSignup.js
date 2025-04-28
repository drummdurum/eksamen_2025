document.querySelector('.signup-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Forhindrer standardformularindsendelse

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            // Vis succesbesked med toastr
            toastr.success(result.message);

            // Omdiriger til forsiden
            setTimeout(() => {
                window.location.href = '/'; 
            }, 2000); // Vent 2 sekunder, før omdirigering
        } else {
            // Vis fejlbesked med toastr
            toastr.error(result.message);
        }
    } catch (error) {
        console.error('Fejl under oprettelse af bruger:', error);
        toastr.error('Noget gik galt. Prøv igen senere.');
    }
});