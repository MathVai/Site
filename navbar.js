document.addEventListener('DOMContentLoaded', () => {
    const navbarLinks = document.querySelectorAll('.dropdown-content a[data-action]');

    navbarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();  // Empêche le comportement par défaut du lien

            const action = e.target.getAttribute('data-action');
            if (action === 'openAboutWindow') {
                openWindowAlt('about-window');  // Remplacez 'about-window' par l'ID correct de votre fenêtre "À Propos"
            } else if (action === 'openContactWindow') {
                openWindowAlt('contact-window');  // Remplacez 'contact-window' par l'ID correct de votre fenêtre "Contact"
            }
        });
    });
});


// ============== HORLOGE ====================

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    const clockElement = document.getElementById('clock');
    if (clockElement) {
        clockElement.textContent = formattedTime;
    }
}

// Mise à jour initiale
updateClock();

// Mise à jour toutes les secondes
setInterval(updateClock, 1000);
