var activeWindow = null;
import {
  handleDragStart } from './window-drag.js';
let highestZIndex = 0;

export function increaseAndGetZIndex() {
  document.querySelectorAll('.window').forEach((windowElement) => {
    const zIndex = parseInt(window.getComputedStyle(windowElement).zIndex, 10);
    if (zIndex > highestZIndex) {
      highestZIndex = zIndex;
    }
  });
  highestZIndex++;
  console.log("Increasing zIndex value", highestZIndex);
  return highestZIndex;
}



window.addEventListener('load', (event) => {
  document.querySelectorAll('.window').forEach((windowElement) => {

    const zIndex = parseInt(window.getComputedStyle(windowElement).zIndex, 10);
    if (zIndex > highestZIndex) {
      highestZIndex = zIndex;
    }

    // Centrez la fenêtre dans le viewport
    const windowWidth = windowElement.offsetWidth;
    const windowHeight = windowElement.offsetHeight;
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const initialX = (viewportWidth - windowWidth) / 2;
    const initialY = (viewportHeight - windowHeight) / 2;
    windowElement.style.left = `${initialX}px`;
    windowElement.style.top = `${initialY}px`;

    // Appel de la fonction d'initialisation pour chaque fenêtre
    initializeWindow(windowElement);
  });
});


function initializeWindow(windowElement) {
  const header = windowElement.querySelector('.window-header');
  const closeButton = windowElement.querySelector('.close');
  const minimizeButton = windowElement.querySelector('.minimize');
  const maximizeButton = windowElement.querySelector('.maximize');

  // Initialiser dataset.x et dataset.y à 0px si non défini
  windowElement.dataset.x = windowElement.style.left || '0px';
  windowElement.dataset.y = windowElement.style.top || '0px';


  closeButton.addEventListener('click', () => {
    windowElement.remove();
  });



  // Gestion de l'action de minimisation
  minimizeButton.addEventListener('click', () => {
    console.log('Minimize button clicked');

    if (windowElement.classList.contains('minimized')) {
        // Si la fenêtre est déjà minimisée, la restaurer
        windowElement.style.display = 'block';
        windowElement.classList.remove('minimized');

        // Restaurer la hauteur et la position de la fenêtre si elle n'était pas maximisée
        if (windowElement.dataset.wasMaximized === 'false') {
            windowElement.classList.remove('maximized');
            windowElement.style.height = windowElement.dataset.height;
            windowElement.style.width = windowElement.dataset.width;
            windowElement.style.left = windowElement.dataset.x;
            windowElement.style.top = windowElement.dataset.y;
        }

        // Supprimez la miniature
        const miniature = document.querySelector(`#minimized-${windowElement.id}`);
        if (miniature) {
            miniature.parentNode.removeChild(miniature);
        }

    } else {
        // Si la fenêtre n'est pas minimisée, la minimiser
        windowElement.dataset.wasMaximized = windowElement.classList.contains('maximized') ? 'true' : 'false';

        windowElement.dataset.height = windowElement.style.height;
        windowElement.dataset.width = windowElement.style.width;
        windowElement.dataset.x = windowElement.style.left;
        windowElement.dataset.y = windowElement.style.top;
        windowElement.style.display = 'none';
        windowElement.classList.add('minimized');

        // Créer une miniature pour la fenêtre minimisée
        const minimizedWindows = document.getElementById('minimized-windows');
        const miniature = document.createElement('button');
        miniature.id = `minimized-${windowElement.id}`;

        // Utilisez l'attribut data-icon pour définir l'icône
        const iconPath = windowElement.dataset.icon;
        if (iconPath) {
            const iconImg = document.createElement('img');
            iconImg.src = iconPath;
            miniature.appendChild(iconImg);
        }

        // Ajouter l'ID de la fenêtre comme texte à côté de l'icône
        const textNode = document.createTextNode(windowElement.id);
        miniature.appendChild(textNode);

        miniature.className = 'minimized-window';

        miniature.addEventListener('click', () => {
            // Lorsque vous cliquez sur la miniature, restaurez la fenêtre
            windowElement.style.display = 'block';
            windowElement.classList.remove('minimized');

            if (windowElement.dataset.wasMaximized === 'false') {
                windowElement.classList.remove('maximized');
                windowElement.style.height = windowElement.dataset.height;
                windowElement.style.width = windowElement.dataset.width;
                windowElement.style.left = windowElement.dataset.x;
                windowElement.style.top = windowElement.dataset.y;
            } else {
                // Si la fenêtre était maximisée avant d'être minimisée, 
                // assurez-vous qu'elle est toujours maximisée à la restauration
                windowElement.classList.add('maximized');
            }

            // Supprimez la miniature après la restauration
            miniature.parentNode.removeChild(miniature);

            // Réglez le zIndex pour que la fenêtre restaurée apparaisse au premier plan
            console.log("Setting zIndex on un-minimize", windowElement.id, increaseAndGetZIndex());
            windowElement.style.zIndex = increaseAndGetZIndex();
        });

        minimizedWindows.appendChild(miniature);
    }
});
}