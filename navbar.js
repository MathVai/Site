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









// function adjustSingleMinimizedWindow() {
//     console.log("Adjusting minimized windows...");
    
//     let maxMinimizedWindows = getMaxMinimizedCount();
//     maxMinimizedWindows = Math.max(0, maxMinimizedWindows); // Ensure it's not negative
//     console.log("Max minimized windows allowed: ", maxMinimizedWindows);
    
//     const minimizedWindows = document.querySelectorAll('.minimized-window');
//     console.log("Currently minimized windows: ", minimizedWindows.length);
    
//     const overflowOptions = document.querySelector('#minimized-windows-overflow .dropdown-content');

//     if (minimizedWindows.length > maxMinimizedWindows) {
//         // If we have more windows than we can show, move the extras to overflow
//         for (let i = maxMinimizedWindows; i < minimizedWindows.length; i++) {
//             overflowOptions.appendChild(minimizedWindows[i]);
//         }
//     }
//     else {
//         // Si nous avons de l'espace pour plus de fenêtres dans la barre principale, déplacez-les du menu déroulant
//         const overflowedWindows = overflowOptions.querySelectorAll('.minimized-window');
//         for (let i = 0; i < (maxMinimizedWindows - minimizedWindows.length) && i < overflowedWindows.length; i++) {
//             document.getElementById('minimized-windows').appendChild(overflowedWindows[i]);
//         }
//     }
    
// }

function adjustSingleMinimizedWindow() {
    console.log("Adjusting minimized windows...");
    
    let maxMinimizedWindows = getMaxMinimizedCount();
    maxMinimizedWindows = Math.max(0, maxMinimizedWindows); // Ensure it's not negative
    console.log("Max minimized windows allowed: ", maxMinimizedWindows);
    
    const minimizedWindows = document.querySelectorAll('.minimized-window');
    console.log("Currently minimized windows: ", minimizedWindows.length);
    
    const overflowOptions = document.querySelector('#minimized-windows-overflow .dropdown-content');
    const overflowedWindows = overflowOptions.querySelectorAll('.minimized-window');

    // Determine the number of windows that can be moved back to the main bar
    const numWindowsToMoveBack = maxMinimizedWindows - minimizedWindows.length;

    // Move the exact number of windows back from overflow to main bar
    for (let i = 0; i < numWindowsToMoveBack; i++) {
        if (overflowedWindows[i]) {
            document.getElementById('minimized-windows').appendChild(overflowedWindows[i]);
        }
    }

    // Now, recheck the minimized windows and move excess windows to overflow
    const updatedMinimizedWindows = document.querySelectorAll('.minimized-window');
    for (let i = maxMinimizedWindows; i < updatedMinimizedWindows.length; i++) {
        overflowOptions.appendChild(updatedMinimizedWindows[i]);
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

    adjustSingleMinimizedWindow();

    // Vérifiez si le bouton d'overflow doit être affiché ou non
    const overflowOptions = document.querySelector('#minimized-windows-overflow .dropdown-content');
    const minimizedWindows = document.querySelectorAll('.minimized-window');

    console.log("Windows in overflow: ", overflowOptions.childNodes.length);
    
    if (overflowOptions.hasChildNodes() && minimizedWindows.length > 0) {
        console.log("Displaying overflow button...");
        document.getElementById('minimized-windows-overflow').style.display = 'block';
        document.getElementById('overflow-button').style.display = 'block'; 
    } else {
        console.log("Hiding overflow button...");
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
    const overflowOptions = overflowContainer.querySelector('.minimized-overflow-options');

    // Déplacez les fenêtres excédentaires vers le menu déroulant
    while (minimizedWindows.length > maxVisibleWindows) {
        overflowOptions.appendChild(minimizedWindows[maxVisibleWindows]);
    }

    // Déplacez les fenêtres du menu déroulant vers la barre principale si possible
    while (minimizedWindows.length < maxVisibleWindows && overflowOptions.hasChildNodes()) {
        document.getElementById('minimized-windows').appendChild(overflowOptions.firstChild);
    }

    // Affichez ou masquez le bouton de débordement en fonction de la présence de fenêtres dans le menu déroulant
    if (overflowOptions.hasChildNodes()) {
        overflowContainer.style.display = 'block';
        document.getElementById('overflow-button').style.display = 'block';
    } else {
        overflowContainer.style.display = 'none';
        document.getElementById('overflow-button').style.display = 'none';
    }

    console.log("Nombre de fenêtres minimisées: ", minimizedWindows.length);
}

document.addEventListener("DOMContentLoaded", function() {
    handleWindowResize();
    window.addEventListener('resize', debounce(handleWindowResize, 50));
});


// export function moveOneFromDropdownToMain() {
//     const overflowOptions = document.querySelector('#minimized-windows-overflow .dropdown-content');
//     const minimizedWindowsContainer = document.getElementById('minimized-windows');

//     if (overflowOptions.hasChildNodes()) {
//         const firstOverflowedWindow = overflowOptions.firstChild;
//         minimizedWindowsContainer.appendChild(firstOverflowedWindow);
//     }
// }