import { increaseAndGetZIndex, initializeWindow } from './window-initialization.js';
import { attachDragEventsToWindow } from './window-drag.js';
import { attachResizeEventsToWindow } from './window-resize.js';
import { updateWindowHeaderGradients } from './update-header.js';

window.openWindowAlt = openWindowAlt;

function generateUniqueWindowId() {
    return 'window-' + Date.now();
}

/**
 * Update the file explorer window to show the contents of the folder.
 * @param {number} fsId file system identifier, unique number
 * @param {number} parentDataId parent window data identifier, unique number
 * @param {Element} fileExplorerContainer parent window container, element
 */
const updateFileExplorer = (fsId, parentDataId, fileExplorerContainer) => {
    // Okay, explorer window is already open. However, we need to update
    // the window explorer content. First, we need to fetch the children
    // of the folder that was clicked. Then, we need to update the DOM.
    const children = document.fsIdToNode.get(fsId).children;
    
    // Clear the files and folders icons from the explorer window
    if(fileExplorerContainer === document.querySelector('.desktop')) return;
    fileExplorerContainer.innerHTML = '';

    // Add the new files and folders icons to the explorer window
    children.forEach(child =>
        window.createNewFolder(child.id, fileExplorerContainer, parentDataId));

    // Attach event listeners to the new icons
    window.attachDoubleClickEvent(fileExplorerContainer.querySelectorAll('.desktop-icon'));
}

function openWindowAlt(windowId, iconElement = null) {
    console.log('Tentative d\'ouverture de la fenêtre:', windowId);
    
    let dataId;
    if (iconElement) {
        dataId = iconElement.getAttribute('data-id');
        console.log('Data ID:', dataId);
    } else {
        console.log('Aucun élément icône fourni.');
    }

    // Recherche d'une fenêtre ouverte avec le data-id correspondant
    const existingWindow = document.querySelector(`.window[data-id="${dataId}"]`);
    
    if (existingWindow) {
        console.log('Fenêtre existante trouvée pour:', dataId || windowId);
        existingWindow.focus();

        // Update the file explorer window to show the contents of the folder.
        const fsId = iconElement?.getAttribute('data-fs-id');
        if(fsId)
            updateFileExplorer(fsId, iconElement.getAttribute('data-id'),
                iconElement.parentNode.parentNode)
        return;
    } else {
        console.log('Aucune fenêtre existante trouvée pour:', dataId || windowId);
    }

    try {
        const templateWindow = document.getElementById(windowId + '-template');
        if (templateWindow) {
            const windowClone = templateWindow.cloneNode(true);

            const uniqueWindowId = generateUniqueWindowId();
            windowClone.id = uniqueWindowId;

            if (dataId) {
                windowClone.setAttribute('data-id', dataId);
            }

            attachDragEventsToWindow(windowClone);
            attachResizeEventsToWindow(windowClone);
            windowClone.classList.remove('hidden');
            const newZIndex = increaseAndGetZIndex();
            windowClone.style.zIndex = newZIndex;

            // Gestionnaire d'événements pour mettre à jour le focus et le gradient de la fenêtre
            windowClone.addEventListener('mousedown', function() {
                // Mettez à jour toutes les fenêtres pour qu'elles soient inactives
                const allWindows = document.querySelectorAll('.window');
                allWindows.forEach(win => {
                    win.classList.remove('active'); 
                });
            
                // Donnez le focus à la fenêtre actuelle et ajoutez-lui la classe 'active'
                windowClone.classList.add('active');
            
                // Mettez à jour le gradient de l'en-tête de la fenêtre
                updateWindowHeaderGradients();
            });

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

            // Update the file explorer window to show the contents of the folder.
            const fsId = iconElement?.getAttribute('data-fs-id');
            if(fsId)
                updateFileExplorer(fsId, iconElement.getAttribute('data-id'),
                    windowClone.querySelector('.file-explorer-container'));

                var event = new Event('windowOpened');
            event.windowId = windowId; 
            document.dispatchEvent(event);
        } else {
            console.error('Modèle de fenêtre non trouvé.');
        }
    } catch (error) {
        console.error("Erreur lors de l'ouverture de la fenêtre :", error);
    }
}




export { openWindowAlt };
