function createNewFolder() {
    const newFolder = document.createElement('div');
    newFolder.classList.add('desktop-icon-container');
  
    const newFolderIcon = document.createElement('div');
    newFolderIcon.classList.add('desktop-icon');
    newFolderIcon.dataset.window = "explorer-window-template"; 
    newFolderIcon.innerHTML = `
        <img class="desktop-icon-image" src="./Icons/Folder-1.png" alt="Folder Icon">
        <p class="desktop-icon-label">New Folder</p>
    `;
  
    newFolder.appendChild(newFolderIcon);
  
    const desktop = document.querySelector('.desktop');
    desktop.appendChild(newFolder);

    // Attendez que le navigateur ait effectivement rendu le nouvel élément
    setTimeout(() => {
        // Pour déterminer la position initiale de l'icône, nous pouvons utiliser les propriétés offsetTop et offsetLeft
        newFolderIcon.setAttribute('data-init-x', newFolderIcon.offsetLeft + 'px');
        newFolderIcon.setAttribute('data-init-y', newFolderIcon.offsetTop + 'px');    
  
        updateDesktopIcons();
        initializeDesktopIcon(newFolder);
    }, 0);
}


function initializeDesktopIcon(iconContainer) {
    handleIconSelection(iconContainer);
    // Tout autre événement ou initialisation nécessaire pour l'icône...
}

// Expose the function to the window object so it can be accessed globally
window.createNewFolder = createNewFolder;


// You can comment out this part if you don't want to create a new folder when the page loads
/*
const createFolderButton = document.getElementById('create-folder-button');
createFolderButton.addEventListener('click', createNewFolder);
*/
