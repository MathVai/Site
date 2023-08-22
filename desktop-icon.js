let desktopIconContainers;
let iconInitialPosition = {
  x: null,
  y: null,
};
let isDragging = false;
let deselectTimeout = null;
let dragAboutToStart = false;
let iconsWereDragged = false; 
let isContextMenuOpen = false;
window.updateDesktopIcons = updateDesktopIcons;
window.handleIconSelection = handleIconSelection;
import { zIndexControl } from './window-initialization.js';
import { openWindowAlt } from './window-open.js';






function initializeDesktopIcon(iconContainer) {
  handleIconSelection(iconContainer);
  // Tout autre événement ou initialisation nécessaire pour l'icône...
}

function updateDesktopIcons() {
  desktopIconContainers = document.querySelectorAll('.desktop-icon-container');
}

function initializeDesktopIcons() {
  const iconContainers = document.querySelectorAll('.desktop-icon-container');
  iconContainers.forEach((iconContainer) => {
    initializeDesktopIcon(iconContainer);
  });
  dragAboutToStart = false;
  interact('.desktop-icon-container').draggable({
    cursorChecker: function (action, interactable, element, interacting) {
      return 'none'; // Force le curseur à être 'none'
  },
    listeners: {
      start(event) {
        dragAboutToStart = true;

        if (deselectTimeout) {
          clearTimeout(deselectTimeout);
        }
        isDragging = true;
        const target = event.target;

        // Si l'icône sur laquelle nous avons commencé le glissement n'était pas déjà sélectionnée
        if (!target.classList.contains('selected')) {
          // Désélectionnez tous les autres icônes
          const allIcons = document.querySelectorAll('.desktop-icon-container');
          allIcons.forEach((iconContainer) => {
            iconContainer.classList.remove('selected');
          });
        }

        // Récupérer les valeurs actuelles de style.left et style.top, si elles existent
        let initialLeft = parseFloat(target.style.left || 0);
        let initialTop = parseFloat(target.style.top || 0);

        target.setAttribute('data-x', initialLeft);
        target.setAttribute('data-y', initialTop);

        // Ajoutez la classe 'selected'
        target.classList.add('selected');
        iconsWereDragged = true;

        // Si l'icône est sélectionnée, initialisez également data-x et data-y pour toutes les autres icônes sélectionnées
        if (target.classList.contains('selected')) {
          const selectedIcons = document.querySelectorAll(
            '.desktop-icon-container.selected'
          );
          selectedIcons.forEach((icon) => {
            if (!icon.hasAttribute('data-x')) {
              icon.setAttribute('data-x', parseFloat(icon.style.left || 0));
            }
            if (!icon.hasAttribute('data-y')) {
              icon.setAttribute('data-y', parseFloat(icon.style.top || 0));
            }
          });
        }
      },

      move(event) {
        const target = event.target;

        let x = parseFloat(target.getAttribute('data-x')) + event.dx;
        let y = parseFloat(target.getAttribute('data-y')) + event.dy;

        target.style.left = x + 'px';
        target.style.top = y + 'px';

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);

        // Si l'icône est sélectionnée, bougez également toutes les autres icônes sélectionnées
        if (target.classList.contains('selected')) {
          const selectedIcons = document.querySelectorAll(
            '.desktop-icon-container.selected'
          );
          selectedIcons.forEach((icon) => {
            if (icon !== target) {
              // Ne déplacez pas l'icône que vous déplacez actuellement à nouveau
              let iconX = parseFloat(icon.getAttribute('data-x')) + event.dx;
              let iconY = parseFloat(icon.getAttribute('data-y')) + event.dy;

              icon.style.left = iconX + 'px';
              icon.style.top = iconY + 'px';

              icon.setAttribute('data-x', iconX);
              icon.setAttribute('data-y', iconY);
            }
          });
        }
      },

      end(event) {
        dragAboutToStart = false;
        isDragging = false;
        const target = event.target;

        // Vérifiez si l'icône a été déplacée
        const currentX = parseFloat(event.target.style.left || 0);
        const currentY = parseFloat(event.target.style.top || 0);

        if (
          currentX === iconInitialPosition.x &&
          currentY === iconInitialPosition.y
        ) {
          target.classList.remove('selected'); // Retirez 'selected' seulement si l'icône n'a pas été déplacée
        }

        if (
          currentX !== iconInitialPosition.x ||
          currentY !== iconInitialPosition.y
        ) {
          // Si l'icône a été déplacée, empêchez l'événement click suivant
          event.target.addEventListener('click', function preventClick(e) {
            e.stopPropagation();
            event.target.removeEventListener('click', preventClick);
          });
        }
        dragAboutToStart = false;
      },
    },
  });
}

function attachDoubleClickEvent() {
  const desktopIcons = document.querySelectorAll('.desktop-icon');
  desktopIcons.forEach((desktopIcon) => {
    desktopIcon.addEventListener('dblclick', () => {
      console.log('Double-click detected on', desktopIcon);
      const windowId = desktopIcon.dataset.window;
      openWindowAlt(windowId, desktopIcon);
      unselectAll();
    });
  });
}



function handleIconSelection(iconContainer) {
  iconContainer.addEventListener('mousedown', function (event) {
    if (isContextMenuOpen) return;
    if (isDragging) return;

    const allIcons = document.querySelectorAll('.desktop-icon-container');
    const selectedIcons = document.querySelectorAll(
      '.desktop-icon-container.selected'
    );

    // Si un glisser-déposer commence sur une icône non sélectionnée alors que d'autres icônes sont déjà sélectionnées
    if (
      event.button === 0 &&
      !iconContainer.classList.contains('selected') &&
      selectedIcons.length > 0
    ) {
      allIcons.forEach((icon) => {
        icon.classList.remove('selected');
      });
      iconContainer.classList.add('selected');
      return;
    }

    // Si une icône est cliquée alors qu'une autre est déjà sélectionnée
    if (
      event.button === 0 &&
      selectedIcons.length === 1 &&
      !iconContainer.classList.contains('selected')
    ) {
      allIcons.forEach((otherIcon) => {
        otherIcon.classList.remove('selected');
      });
    }

    // Si un glisser-déposer commence sur une icône déjà sélectionnée avec d'autres
    if (
      event.button === 0 &&
      selectedIcons.length > 1 &&
      iconContainer.classList.contains('selected')
    ) {
      event.stopPropagation();
      return;
    }

    // Si le bouton droit de la souris est cliqué et que l'icône est déjà sélectionnée
    if (event.button === 2 && iconContainer.classList.contains('selected')) {
      return;
    }

    // Vérifiez si une autre icône est déjà sélectionnée
    const otherSelectedIcons = [
      ...document.querySelectorAll('.desktop-icon-container.selected'),
    ].filter((ic) => ic !== iconContainer);

    if (event.button === 2 && otherSelectedIcons.length > 0) {
      // Désélectionner toutes les autres icônes
      otherSelectedIcons.forEach((otherIcon) => {
        otherIcon.classList.remove('selected');
      });
    }

    // Basculer la sélection de l'icône cliquée
    iconContainer.classList.toggle('selected');
  });
}

function unselectAll() {
  desktopIconContainers.forEach((iconContainer) => {
    iconContainer.classList.remove('selected');
  });
}

document.addEventListener('DOMContentLoaded', function () {
  updateDesktopIcons();

  initializeDesktopIcons();

  attachDoubleClickEvent();

  desktopIconContainers.forEach((iconContainer) => {
    handleIconSelection(iconContainer);
  });

  desktopIconContainers.forEach((iconContainer) => {
    iconContainer.addEventListener('mousedown', function (event) {
      if (event.button === 2) return;
      if (!isDragging) {
        deselectTimeout = setTimeout(() => {
          desktopIconContainers.forEach((otherIcon) => {
            otherIcon.classList.remove('selected');
          });
          iconContainer.classList.add('selected');
        }, 100);
      }
    });

    // Dans vos gestionnaires de drag & drop et de clic droit
    if (deselectTimeout) {
      clearTimeout(deselectTimeout);
    }
  });

  document.addEventListener('mousedown', function (event) {
    if (
      !event.target.closest('.desktop-icon-container') &&
      !event.target.closest('#context-menu')
    ) {
      desktopIconContainers.forEach((iconContainer) => {
        iconContainer.classList.remove('selected');
      });
    }
  });

  desktopIconContainers.forEach((iconContainer) => {
    const computedStyle = window.getComputedStyle(iconContainer);
    iconContainer.setAttribute('data-init-x', computedStyle.left);
    iconContainer.setAttribute('data-init-y', computedStyle.top);
  });
});

document.addEventListener('click', function (event) {
  const clickedIcon = event.target.closest('.desktop-icon-container');
  if (clickedIcon) {
    // Si une icône a été cliquée, désélectionnez toutes les autres icônes
    const allIcons = document.querySelectorAll('.desktop-icon-container');
    allIcons.forEach((icon) => {
      icon.classList.remove('selected');
    });

    // Sélectionnez l'icône cliquée
    clickedIcon.classList.add('selected');
  }
});



document.addEventListener('DOMContentLoaded', function () {
  updateDesktopIcons();

  initializeDesktopIcons();

  document.addEventListener('click', function (event) {

    if (event.target.closest('.menu-contextuel')) {
      return; // Si le clic provient du menu contextuel, n'exécutez pas la logique de désélection
    }
    if (!event.target.closest('.desktop-icon-container')) {
      desktopIconContainers.forEach((iconContainer) =>
        iconContainer.classList.remove('selected')
      
      );
    }
  });
});

// function updateAvailablePositions() {
//   window.availablePositions = [];
//   const allIcons = document.querySelectorAll('.desktop-icon-container');
//   allIcons.forEach(icon => {
//       if (icon.getAttribute('data-recyclable') === 'true' || icon.classList.contains('placeholder')) {
//           const x = parseFloat(icon.style.left || 0);
//           const y = parseFloat(icon.style.top || 0);
//           window.availablePositions.push({ x, y });
//       }
//   });
// }

window.resetDesktopIcons = function() {
  const allIconContainers = document.querySelectorAll('.desktop-icon-container');

  // Supprimer tous les placeholders ou éléments recyclables.
  allIconContainers.forEach((iconContainer) => {
    if (iconContainer.getAttribute('data-recyclable') === 'true' || iconContainer.classList.contains('placeholder')) {
      iconContainer.remove();
    }
  });

  // Repositionner chaque icône à sa position initiale.
  allIconContainers.forEach((iconContainer) => {
    const initX = iconContainer.getAttribute('data-init-x');
    const initY = iconContainer.getAttribute('data-init-y');

    iconContainer.style.left = initX;
    iconContainer.style.top = initY;
    iconContainer.setAttribute('data-x', initX);
    iconContainer.setAttribute('data-y', initY);

    initializeDesktopIcon(iconContainer);
  });

  // Assurez-vous que tous les icônes sont initialisés correctement.
  initializeDesktopIcons();
}


document.addEventListener('click', function (event) {
  setTimeout(() => {
    const selectedIcons = document.querySelectorAll(
      '.desktop-icon-container.selected'
    );
  }, 50); // Légèrement retardé pour s'assurer que toutes les manipulations de la classe sont terminées.
});
