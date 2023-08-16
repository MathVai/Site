// --- Imports ---
import {
  attachResizeEventsToWindow
} from './window-resize.js';

import {
  minimizedCount,
  incrementMinimizedCount,
  decrementMinimizedCount
} from './script.js';

import {
  handleMinimizedWindows,
  getMaxMinimizedCount
} from './navbar.js';

// --- Constantes et variables globales ---
const MAX_MINIMIZED = getMaxMinimizedCount();
let highestZIndex = 0;



// --- Fonctions principales ---

// Fonction pour augmenter et obtenir le z-index
export function increaseAndGetZIndex() {
  document.querySelectorAll('.window').forEach((windowElement) => {
    const zIndex = parseInt(window.getComputedStyle(windowElement).zIndex, 10);
    if (zIndex > highestZIndex) {
      highestZIndex = zIndex;
    }
  });
  highestZIndex++;
  console.log('increaseAndGetZIndex:', highestZIndex); // <-- Ajoutez cette ligne
  return highestZIndex;
}


function deminimizeWindow(windowElement) {
  console.log("Tentative de déminimisation de la fenêtre");
  
  // Restaurez la fenêtre
  windowElement.style.display = 'block';
  windowElement.classList.remove('minimized');

  if (windowElement.dataset.wasMaximized === 'false') {
      windowElement.classList.remove('maximized');
      windowElement.style.height = windowElement.dataset.height;
      windowElement.style.width = windowElement.dataset.width;
      windowElement.style.left = windowElement.dataset.x;
      windowElement.style.top = windowElement.dataset.y;
  }

  // Check if the window is fully inside the viewport
  const rect = windowElement.getBoundingClientRect();
  if (rect.top < 0 || rect.left < 0 || rect.bottom > window.innerHeight || rect.right > window.innerWidth) {
      // Center the window if it's out of viewport
      windowElement.style.left = (window.innerWidth - rect.width) / 2 + 'px';
      windowElement.style.top = (window.innerHeight - rect.height) / 2 + 'px';
  }

  // Supprimez la miniature
  const miniature = document.querySelector(`#minimized-${windowElement.id}`);
  if (miniature) {
      miniature.parentNode.removeChild(miniature);
  }

  decrementMinimizedCount();
  handleMinimizedWindows();

  console.log('Nombre de fenêtres minimisées après déminimisation:', minimizedCount);

  const overflowDropdown = document.querySelector('#minimized-windows-overflow .dropdown-content');
  if (!overflowDropdown.hasChildNodes()) {
      console.log("Le dropdown est vide");
      const overflowButton = document.getElementById('overflow-button');
      overflowButton.style.display = 'none';
  }
}




// Lorsque la page est chargée, initialisez toutes les fenêtres
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


// Initialisation de chaque fenêtre
function initializeWindow(windowElement) {

  console.log('Initialisation de la fenêtre:', windowElement.id);
  const header = windowElement.querySelector('.window-header');
  const closeButton = windowElement.querySelector('.close');
  const minimizeButton = windowElement.querySelector('.minimize');
  const maximizeButton = windowElement.querySelector('.maximize');

  // Vérifier si la fenêtre n'a PAS la classe 'fixed-size'
  if (!windowElement.classList.contains('fixed-size')) {
    // Attacher les événements de redimensionnement à la fenêtre
    attachResizeEventsToWindow(windowElement);
  }

  // Initialiser dataset.x et dataset.y à 0px si non défini
  windowElement.dataset.x = windowElement.style.left || '0px';
  windowElement.dataset.y = windowElement.style.top || '0px';

  closeButton.addEventListener('click', () => {
    windowElement.remove();
  });

  // Gestion de l'action de minimisation
  minimizeButton.addEventListener('click', () => {
    console.log("Bouton de minimisation cliqué");
    const minimizedWindowsContainer = document.getElementById('minimized-windows');
    const overflowDropdown = document.querySelector('#minimized-windows-overflow .dropdown-content');

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
        restoreFromOverflow();
      }

      // Vérifiez si la fenêtre est en dehors du viewport et recentrez-la si nécessaire
  const rect = windowElement.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  if (rect.left < 0 || rect.right > viewportWidth || rect.top < 0 || rect.bottom > viewportHeight) {
      windowElement.style.left = (viewportWidth - rect.width) / 2 + 'px';
      windowElement.style.top = (viewportHeight - rect.height) / 2 + 'px';
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
        deminimizeWindow(windowElement);
        // Réglez le zIndex pour que la fenêtre restaurée apparaisse au premier plan
        windowElement.style.zIndex = increaseAndGetZIndex();
      });

      incrementMinimizedCount();
      if (minimizedCount > MAX_MINIMIZED) {
        // Ajouter la fenêtre au menu déroulant du bouton ...
        overflowDropdown.appendChild(miniature);
      } else {
        minimizedWindowsContainer.appendChild(miniature);
      }
      handleMinimizedWindows();
    }
  });
}


// --- Exports ---

export {
  initializeWindow
};

export const zIndexControl = {
  value: 0,
  increase: function () {
    this.value++;
  }
};