import { openWindowAlt } from './window-open.js';
let folderIdCounter = 0;  // Compteur pour générer des ID uniques pour chaque dossier

function createNewFolder() {
  const recyclableIcon = document.querySelector('.desktop-icon-container[data-recyclable="true"]');
  let newFolder;

  if (recyclableIcon) {
      // If there's a recyclable icon, use it for the new folder
      newFolder = recyclableIcon;
      newFolder.removeAttribute('data-recyclable');
  } else {
      // If there's no recyclable icon, create a new one
      newFolder = document.createElement('div');
      newFolder.classList.add('desktop-icon-container');
  }

  const newFolderIcon = document.createElement('div');
  newFolderIcon.classList.add('desktop-icon');
  newFolderIcon.dataset.window = 'explorer-window';
  newFolderIcon.innerHTML = `
      <img class="desktop-icon-image" src="./Icons/Folder-1.png" alt="Folder Icon">
      <p class="desktop-icon-label">New Folder</p>
  `;

  folderIdCounter++;  // Augmentez le compteur chaque fois qu'un nouveau dossier est créé
  newFolder.setAttribute('data-icon-id', 'folder-' + folderIdCounter);  // Attribuez un ID unique à chaque dossier

  newFolder.appendChild(newFolderIcon);

  if (window.availablePositions && window.availablePositions.length > 0) {
      const position = window.availablePositions.shift();
      newFolder.style.left = position.x + 'px';
      newFolder.style.top = position.y + 'px';
  }

  if (!recyclableIcon) {
      const desktop = document.querySelector('.desktop');
      desktop.appendChild(newFolder);
  }

  setTimeout(() => {
      newFolder.setAttribute('data-init-x', newFolderIcon.offsetLeft + 'px');
      newFolder.setAttribute('data-init-y', newFolderIcon.offsetTop + 'px');

      updateDesktopIcons();
      initializeDesktopIcon(newFolder);
  }, 0);
}

function initializeDesktopIcon(iconContainer) {
  handleIconSelection(iconContainer);

  iconContainer.addEventListener('dblclick', function() {
    const windowId = iconContainer.querySelector('.desktop-icon').dataset.window;
    console.log(`Double-click detected on icon. Trying to open window with ID: ${windowId}`);
    openWindowAlt(windowId, iconContainer);  // Passez iconContainer en tant qu'élément d'icône
  });
}

window.createNewFolder = createNewFolder;

document.getElementById('explorer-window-template').addEventListener('DOMNodeRemoved', function() {
  console.error('Le modèle de fenêtre a été supprimé du DOM !');
});
