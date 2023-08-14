import { increaseAndGetZIndex, initializeWindow } from './window-initialization.js';
import { attachDragEventsToWindow } from './window-drag.js';
import { attachResizeEventsToWindow } from './window-resize.js';

function openWindowAlt(windowId, iconElement) {
    if (!iconElement) {
        console.error("L'élément icône n'est pas fourni à openWindowAlt");
        return;
    }
    

    console.log('Tentative d\'ouverture de la fenêtre:', windowId);

    // Check if a window opened by this icon already exists
    const iconId = iconElement.getAttribute('data-icon-id');

    const existingWindow = document.querySelector(`.window[data-opened-by-icon-id="${iconId}"]`);
    
    if (existingWindow) {
        // If the window opened by this icon already exists, bring it to focus.
        existingWindow.focus();
        return;
    }

    try {
        console.log('Ouverture de la fenêtre:', windowId);
        const templateWindow = document.getElementById(windowId + '-template');
        if (templateWindow) {
            console.log('Modèle de fenêtre trouvé.');
            const windowClone = templateWindow.cloneNode(true);
            console.log("Fenêtre clonée :", windowClone);
            
            attachDragEventsToWindow(windowClone);
            console.log('Événements de drag attachés.');
            attachResizeEventsToWindow(windowClone);
            console.log('Événements de resize attachés.');

            windowClone.id = windowId;
            windowClone.classList.remove('hidden');
            console.log('ID assigné et classe hidden retirée.');

            const newZIndex = increaseAndGetZIndex();
            windowClone.style.zIndex = newZIndex;
            console.log('z-index de la fenêtre après réglage:', windowClone.style.zIndex);

            document.querySelector('.windows').appendChild(windowClone);
            console.log('Fenêtre ajoutée au DOM.');

            initializeWindow(windowClone);
            console.log('Fenêtre initialisée.');

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
            console.log('Fenêtre centrée.');

                    // After cloning the window, set an attribute to identify which icon opened it
        windowClone.setAttribute('data-opened-by-icon-id', iconId);
        document.querySelector('.windows').appendChild(windowClone);

            console.log('Open window: ' + windowId);
        } else {
            console.error('Modèle de fenêtre non trouvé.');
        }
    } catch (error) {
        console.error("Erreur lors de l'ouverture de la fenêtre :", error);
    }
}

export { openWindowAlt };
