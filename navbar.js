document.addEventListener('DOMContentLoaded', () => {
    const navbarLinks = document.querySelectorAll('.dropdown-content a[data-action], #clock-button');

    

    navbarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Empêche le comportement par défaut du lien
        
            const action = e.currentTarget.getAttribute('data-action');
            console.log("Action détectée:", action); 
    
            if (action === 'data-window') {
                openWindowAlt('about-window'); 
            } else if (action === 'openContactWindow') {
                openWindowAlt('contact-window'); 
            } else if (action === 'openClockWindow') {
                console.log("Tentative d'ouverture de la fenêtre d'horloge");
                openWindowAlt('clock-window'); 
            }
        });
    });
    
    
});

document.getElementById('clock-button').addEventListener('click', function() {
    console.log("Bouton de l'horloge cliqué");
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


function handleMinimizedWindows() {
    console.log("Adjusting minimized windows...");

    const maxMinimizedWindows = Math.max(0, getMaxMinimizedCount());
    console.log("Max minimized windows allowed: ", maxMinimizedWindows);

    const minimizedWindows = document.querySelectorAll('.minimized-window');
    console.log("Currently minimized windows: ", minimizedWindows.length);

    const overflowOptions = document.querySelector('#minimized-windows-overflow .dropdown-content');
    const overflowedWindows = overflowOptions.querySelectorAll('.minimized-window');

    // Move all windows from overflow to the main bar first
    overflowedWindows.forEach(window => {
        document.getElementById('minimized-windows').appendChild(window);
    });

    // Now, if there are too many windows on the main bar, move the excess back to overflow
    const updatedMinimizedWindows = document.querySelectorAll('.minimized-window');
    for (let i = maxMinimizedWindows; i < updatedMinimizedWindows.length; i++) {
        overflowOptions.appendChild(updatedMinimizedWindows[i]);
    }

    // Display or hide the overflow button based on the presence of windows in the dropdown
    const overflowContainer = document.getElementById('minimized-windows-overflow');
    if (overflowOptions.hasChildNodes() && minimizedWindows.length > maxMinimizedWindows) {
        console.log("Displaying overflow button...");
        overflowContainer.style.display = 'block';
        document.getElementById('overflow-button').style.display = 'block';
    } else {
        console.log("Hiding overflow button...");
        overflowContainer.style.display = 'none';
        document.getElementById('overflow-button').style.display = 'none';
    }


    console.log("Number of minimized windows: ", document.querySelectorAll('.minimized-window').length);
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

    handleMinimizedWindows(); // Utilisez la nouvelle fonction ici
}

function getMaxMinimizedCount() {
    const navbar = document.querySelector('.navbar');
    const overflowButton = document.querySelector('#overflow-button');

    const navbarWidth = navbar.offsetWidth;

    const isOverflowButtonVisible = getComputedStyle(overflowButton).display !== "none";
    const overflowButtonWidth = isOverflowButtonVisible ? overflowButton.offsetWidth + 8 : 0; // +8 for the margin
    const rightWidth = 227 + overflowButtonWidth;

    const leftPermanentWidth = 241;
    const marginBetweenButtons = 8; // margin between minimized windows
    let minimizedWindowWidth = 150 + marginBetweenButtons; // default value

    const availableWidthForMinimised = navbarWidth - rightWidth - leftPermanentWidth - marginBetweenButtons;
    const buffer = 0.5; // This is the buffer, adjust as needed
    const maxMinimizedWindows = Math.floor(availableWidthForMinimised / minimizedWindowWidth);

    return maxMinimizedWindows;
}


export {
    getMaxMinimizedCount,
    handleMinimizedWindows
};


document.addEventListener("DOMContentLoaded", function () {
    handleWindowResize();
    window.addEventListener('resize', debounce(handleWindowResize, 50));
});