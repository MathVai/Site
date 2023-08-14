import { increaseAndGetZIndex, initializeWindow } from './window-initialization.js';
import { attachDragEventsToWindow } from './window-drag.js';
import { attachResizeEventsToWindow } from './window-resize.js';
window.openWindowAlt = openWindowAlt;


function openWindowAlt(windowId, iconElement = null) {
    console.log('Tentative d\'ouverture de la fenêtre:', windowId);

    let iconId;
    if (iconElement) {
        iconId = iconElement.getAttribute('data-icon-id');
        const existingWindow = document.querySelector(`.window[data-opened-by-icon-id="${iconId}"]`);
        if (existingWindow) {
            existingWindow.focus();
            return;
        }
    }

    const existingWindowByIcon = document.querySelector(`.window[data-opened-by-icon-id="${iconId}"]`);
const existingWindowById = document.querySelector(`.window#${windowId}`);
    
    if (existingWindowByIcon || existingWindowById) {
        (existingWindowByIcon || existingWindowById).focus();
        return;
    }
    try {
        const templateWindow = document.getElementById(windowId + '-template');
        if (templateWindow) {
            const windowClone = templateWindow.cloneNode(true);

            attachDragEventsToWindow(windowClone);
            attachResizeEventsToWindow(windowClone);
            windowClone.id = windowId;
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
