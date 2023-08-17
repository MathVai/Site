function deleteDesktopIcon(desktopIconContainer) {
    console.log("Début de la suppression de l'icône du bureau...");

    // Récupérez les attributs nécessaires AVANT de supprimer le contenu
    const associatedIconElement = desktopIconContainer.querySelector('.desktop-icon');
    let associatedWindowId = associatedIconElement ? associatedIconElement.getAttribute('data-window-id') : null;
    if (!associatedWindowId) {  // Si l'ID de la fenêtre n'est pas trouvé sur l'élément .desktop-icon
        associatedWindowId = desktopIconContainer.getAttribute('data-window-id');  // Essayez de le récupérer à partir du .desktop-icon-container
    }

    // Supprimez le contenu de l'icône
    while (desktopIconContainer.firstChild) {
        desktopIconContainer.removeChild(desktopIconContainer.firstChild);
    }
    console.log("Contenu de l'icône supprimé.");

    // Marquez le conteneur comme recyclable
    desktopIconContainer.setAttribute('data-recyclable', 'true');
    console.log("Conteneur marqué comme recyclable.");

    const currentX = parseFloat(desktopIconContainer.style.left || 0);
    const currentY = parseFloat(desktopIconContainer.style.top || 0);
    const initialX = parseFloat(desktopIconContainer.getAttribute('data-init-x') || 0);
    const initialY = parseFloat(desktopIconContainer.getAttribute('data-init-y') || 0);

    // Si l'icône a été déplacée, ajoutez sa position initiale aux positions disponibles
    if (currentX !== initialX || currentY !== initialY) {
        window.availablePositions = window.availablePositions || [];
        window.availablePositions.push({ x: initialX, y: initialY });
    }
    console.log("Gestion des positions terminée.");

    if (associatedWindowId) {
        const associatedWindow = document.getElementById(associatedWindowId);
        if (associatedWindow) {
            associatedWindow.remove();  // Supprime la fenêtre
            console.log("Fenêtre associée supprimée.");
        } else {
            console.log("Aucune fenêtre associée à cette icône.");
        }
    } else {
        console.log("Aucun ID d'icône associé trouvé.");
    }

    console.log("Suppression de l'icône du bureau terminée.");
}

window.deleteDesktopIcon = deleteDesktopIcon;
