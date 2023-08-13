import { openWindowAlt } from './window-open.js';

function createNewFolder() {
  const newFolder = document.createElement('div');
  newFolder.classList.add('desktop-icon-container');

  const newFolderIcon = document.createElement('div');
  newFolderIcon.classList.add('desktop-icon');
  newFolderIcon.dataset.window = 'explorer-window';
  newFolderIcon.innerHTML = `
        <img class="desktop-icon-image" src="./Icons/Folder-1.png" alt="Folder Icon">
        <p class="desktop-icon-label">New Folder</p>
    `;

  newFolder.appendChild(newFolderIcon);

  const desktop = document.querySelector('.desktop');
  desktop.appendChild(newFolder);

  setTimeout(() => {
    newFolder.setAttribute('data-init-x', newFolderIcon.offsetLeft + 'px');
    newFolder.setAttribute('data-init-y', newFolderIcon.offsetTop + 'px');

    updateDesktopIcons();
    initializeDesktopIcon(newFolder);
    console.log("New folder icon initialized."); // Log added
  }, 0);
}

function initializeDesktopIcon(iconContainer) {
  handleIconSelection(iconContainer);

  iconContainer.addEventListener('dblclick', function() {
    const windowId = iconContainer.querySelector('.desktop-icon').dataset.window;
    console.log(`Double-click detected on icon. Trying to open window with ID: ${windowId}`); // Log added
    openWindowAlt(windowId);
  });
}

window.createNewFolder = createNewFolder;

document.getElementById('explorer-window-template').addEventListener('DOMNodeRemoved', function() {
  console.error('Le modèle de fenêtre a été supprimé du DOM !');
});
