import { increaseAndGetZIndex, initializeWindow } from './window-initialization.js';
import { attachDragEventsToWindow } from './window-drag.js';
import { attachResizeEventsToWindow } from './window-resize.js';

function openWindowAlt(windowId) {
    console.log('Tentative d\'ouverture de la fenêtre:', windowId);
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

            console.log('Open window: ' + windowId);
        } else {
            console.error('Modèle de fenêtre non trouvé.');
        }
    } catch (error) {
        console.error("Erreur lors de l'ouverture de la fenêtre :", error);
    }
}

export { openWindowAlt };
