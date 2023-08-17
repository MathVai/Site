import { increaseAndGetZIndex, initializeWindow } from './window-initialization.js';
import { attachDragEventsToWindow } from './window-drag.js';
import { attachResizeEventsToWindow } from './window-resize.js';

window.openWindowAlt = openWindowAlt;

function generateUniqueWindowId() {
    return 'window-' + Date.now();
}

function openWindowAlt(windowId, iconElement = null) {
    console.log('Tentative d\'ouverture de la fenêtre:', windowId);

    let iconId;
    if (iconElement) {
        iconId = iconElement.getAttribute('data-icon-id');
        
        // Si iconId est null, vérifiez l'élément parent
        if (!iconId) {
            const parentElement = iconElement.parentElement;
            if (parentElement) {
                iconId = parentElement.getAttribute('data-icon-id');
                console.log('Icon ID from parentElement:', iconId);
            }
        } else {
            console.log('Icon ID from iconElement:', iconId);
        }

        const existingWindow = document.querySelector(`.window[data-opened-by-icon-id="${iconId}"]`);
        if (existingWindow) {
            console.log('Fenêtre existante trouvée pour:', iconId);
            existingWindow.focus();
            return;
        } else {
            console.log('Aucune fenêtre existante trouvée pour:', iconId);
        }
    } else {
        console.log('Aucun élément icône fourni.');
    }

    try {
        const templateWindow = document.getElementById(windowId + '-template');
        if (templateWindow) {
            const windowClone = templateWindow.cloneNode(true);

            const uniqueWindowId = generateUniqueWindowId();
            windowClone.id = uniqueWindowId;

            // Associez cet ID à l'icône du bureau (si elle existe) :
            if (iconElement) {
                iconElement.setAttribute('data-window-id', uniqueWindowId);
                console.log("data-window-id set to", uniqueWindowId, "for icon", iconElement);
            }

            attachDragEventsToWindow(windowClone);
            attachResizeEventsToWindow(windowClone);
            windowClone.classList.remove('hidden');
            const newZIndex = increaseAndGetZIndex();
            windowClone.style.zIndex = newZIndex;
            
            if (iconId) {
                windowClone.setAttribute('data-opened-by-icon-id', iconId);
            }

            document.querySelector('.windows').appendChild(windowClone);

            initializeWindow(windowClone);

            const windowWidth = windowClone.offsetWidth;
            const windowHeight = windowClone.offsetHeight;
            const viewportWidth = document.documentElement.clientWidth;
            const viewportHeight = document.documentElement.clientHeight;
            const initialX = (viewportWidth - windowWidth) / 2;
            const initialY = (viewportHeight - windowHeight) / 2;
            windowClone.style.left = `${initialX}px`;
            windowClone.style.top = `${initialY}px`;
            windowClone.setAttribute('data-x', initialX);
            windowClone.setAttribute('data-y', initialY);
        } else {
            console.error('Modèle de fenêtre non trouvé.');
        }
    } catch (error) {
        console.error("Erreur lors de l'ouverture de la fenêtre :", error);
    }
}

export { openWindowAlt };
