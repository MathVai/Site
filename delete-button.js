function deleteDesktopIcon(desktopIconContainer) {
    // Supprimez tout le contenu de l'icône
    while (desktopIconContainer.firstChild) {
        desktopIconContainer.removeChild(desktopIconContainer.firstChild);
    }
    
    // Marquez le conteneur comme un "placeholder"
    desktopIconContainer.classList.add('placeholder');
}




window.deleteDesktopIcon = deleteDesktopIcon;

