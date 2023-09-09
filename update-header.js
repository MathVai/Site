// Fonction pour mettre à jour le gradient des headers
function updateWindowHeaderGradients() {
    setTimeout(() => {
        let maxZIndex = -1;
        let activeWindow;

        const windows = document.querySelectorAll('.window');
        windows.forEach(windowElement => {
            const zIndex = parseInt(getComputedStyle(windowElement).zIndex);
            if (zIndex > maxZIndex) {
                maxZIndex = zIndex;
                activeWindow = windowElement;
            }
        });

        // Réinitialiser tous les headers au gradient inactif
        windows.forEach(windowElement => {
            const header = windowElement.querySelector('.window-header');
            header.style.background = "var(--gradient-inactive)";
        });

        // Définir le gradient actif pour la fenêtre active
        if (activeWindow) {
            const activeHeader = activeWindow.querySelector('.window-header');
            activeHeader.style.background = "var(--gradient)";
        }
    }, 0);
}

// Attacher l'événement mousedown à chaque fenêtre pour déclencher la mise à jour du gradient lorsqu'une fenêtre est cliquée
document.querySelectorAll('.window').forEach(windowElement => {
    windowElement.addEventListener('mousedown', updateWindowHeaderGradients);
});

// Gestionnaire d'événements pour les fenêtres qui s'ouvrent
document.addEventListener('windowOpened', function (event) {
    updateWindowHeaderGradients();
});

// Appeler la fonction initialement pour définir les gradients corrects au chargement
updateWindowHeaderGradients();

export { updateWindowHeaderGradients };
