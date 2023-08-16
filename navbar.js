export {
    checkMinimizedWindowsOverflow
};




document.addEventListener('DOMContentLoaded', () => {
    const navbarLinks = document.querySelectorAll('.dropdown-content a[data-action]');

    navbarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Empêche le comportement par défaut du lien

            const action = e.target.getAttribute('data-action');
            if (action === 'openAboutWindow') {
                openWindowAlt('about-window'); // Remplacez 'about-window' par l'ID correct de votre fenêtre "À Propos"
            } else if (action === 'openContactWindow') {
                openWindowAlt('contact-window'); // Remplacez 'contact-window' par l'ID correct de votre fenêtre "Contact"
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




function adjustSingleMinimizedWindow() {
    const maxMinimizedWindows = getMaxMinimizedCount();
    const minimizedWindows = document.querySelectorAll('.minimized-window');
    const overflowOptions = document.querySelector('#minimized-windows-overflow .dropdown-content');

    // Déplacer toutes les fenêtres minimisées vers le menu déroulant d'overflow
    minimizedWindows.forEach(window => {
        overflowOptions.appendChild(window);
    });

    // Déplacer les fenêtres du menu déroulant vers la barre principale jusqu'à atteindre le maxMinimizedWindows
    for (let i = 0; i < maxMinimizedWindows && overflowOptions.hasChildNodes(); i++) {
        const firstOverflowedWindow = overflowOptions.firstChild;
        document.getElementById('minimized-windows').appendChild(firstOverflowedWindow);
    }
}





function debounce(func, wait) {
    let timeout;
    return function () {
        const context = this,
            args = arguments;
        const later = function () {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function handleWindowResize() {
    console.log("Handling window resize...");

    let previousMinimizedCount;
    let currentMinimizedCount = document.querySelectorAll('.minimized-window').length;

    // Répétez l'ajustement jusqu'à ce que toutes les fenêtres soient correctement placées
    do {
        previousMinimizedCount = currentMinimizedCount;
        adjustSingleMinimizedWindow();
        currentMinimizedCount = document.querySelectorAll('.minimized-window').length;
    } while (previousMinimizedCount !== currentMinimizedCount);

    // Vérifiez si le bouton d'overflow doit être affiché ou non
    const overflowOptions = document.querySelector('#minimized-windows-overflow .dropdown-content');
    if (overflowOptions.hasChildNodes()) {
        document.getElementById('minimized-windows-overflow').style.display = 'block';
        document.getElementById('overflow-button').style.display = 'block'; 
    } else {
        document.getElementById('minimized-windows-overflow').style.display = 'none';
        document.getElementById('overflow-button').style.display = 'none'; 
    }
}





function getMaxMinimizedCount() {
    const navbar = document.querySelector('.navbar');
    const overflowButton = document.querySelector('#overflow-button');

    const navbarWidth = navbar.offsetWidth;
    
    const isOverflowButtonVisible = getComputedStyle(overflowButton).display !== "none";
    const overflowButtonWidth = isOverflowButtonVisible ? overflowButton.offsetWidth + 8 : 0; // +8 for the margin
    const rightWidth = 212 + overflowButtonWidth;

    const leftPermanentWidth = 176;
    const marginBetweenButtons = 8;  // margin between minimized windows
    let minimizedWindowWidth = 150 + marginBetweenButtons;  // default value

    const availableWidthForMinimised = navbarWidth - rightWidth - leftPermanentWidth - marginBetweenButtons;
    const maxMinimizedWindows = Math.floor(availableWidthForMinimised / minimizedWindowWidth);

    return maxMinimizedWindows;
}



export {
    getMaxMinimizedCount
};


function checkMinimizedWindowsOverflow() {
    const maxVisibleWindows = getMaxMinimizedCount();
    const minimizedWindows = document.querySelectorAll('.minimized-window');
    const overflowContainer = document.getElementById('minimized-windows-overflow');

    if (minimizedWindows.length > maxVisibleWindows) {
        overflowContainer.style.display = 'block';
        document.getElementById('overflow-button').style.display = 'block';
        for (let i = maxVisibleWindows; i < minimizedWindows.length; i++) {
            overflowContainer.querySelector('.minimized-overflow-options').appendChild(minimizedWindows[i]);
        }
    } else {
        overflowContainer.style.display = 'none';
    }
    console.log("Nombre de fenêtres minimisées: ", minimizedWindows.length);
}

window.addEventListener('resize', debounce(handleWindowResize, 50));