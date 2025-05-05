async function searchPhoneNumber() {
    const phoneNumber = document.getElementById('phoneNumber').value;
    if (!phoneNumber) {
        alert('Indtast venligst et telefonnummer');
        return;
    }

    try {
        const response = await fetch(`/custormers${phoneNumber}`);
        if (!response.ok) {
            throw new Error('Netværksrespons var ikke ok');
        }
        const data = await response.json();
        console.log(data);
        // Håndter data her (f.eks. vis resultaterne på siden)
    } catch (error) {
        console.error('Der var et problem med fetch-anmodningen:', error);
    }
}