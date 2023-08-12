

window.addEventListener('load', (event) => {
    document.querySelectorAll('.window').forEach((windowElement) => {
        const windowWidth = windowElement.offsetWidth;
        const windowHeight = windowElement.offsetHeight;
        const viewportWidth = document.documentElement.clientWidth;
        const viewportHeight = document.documentElement.clientHeight;

        const initialX = (viewportWidth - windowWidth) / 2;
        const initialY = (viewportHeight - windowHeight) / 2;

        const rect = windowElement.getBoundingClientRect();
        windowElement.style.left = `${rect.left}px`;
        windowElement.style.top = `${rect.top}px`;
        initializeWindow(windowElement);
    });
});
        


let highestZIndex = 0;
const margin = 100;

function initializeWindow(windowElement) {
    const header = windowElement.querySelector('.window-header');
    const closeButton = windowElement.querySelector('.close');
    const minimizeButton = windowElement.querySelector('.minimize');
    const maximizeButton = windowElement.querySelector('.maximize');
    windowElement.dataset.x = windowElement.style.left;
    windowElement.dataset.y = windowElement.style.top;

    interact(header)
    .draggable({
        listeners: {
            start (event) {
                event.target.parentNode.setAttribute('data-x', event.target.parentNode.style.left);
                event.target.parentNode.setAttribute('data-y', event.target.parentNode.style.top);
            },
            move (event) {
                const target = event.target.parentNode; // parent node is the window element
                let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
    
                // Check the boundaries
                const windowWidth = target.offsetWidth;
                const windowHeight = target.offsetHeight;
                const viewportWidth = document.documentElement.clientWidth;
                const viewportHeight = document.documentElement.clientHeight;
    
                if (x < -margin) x = -margin;
                if (y < 0) y = 0;
                if (x + windowWidth - margin > viewportWidth) x = viewportWidth - windowWidth + margin;
                if (y + windowHeight - margin > viewportHeight) y = viewportHeight - windowHeight + margin;
    
                target.style.left = x + 'px';
                target.style.top = y + 'px';
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }
        }
    });
    

    closeButton.addEventListener('click', () => {
        windowElement.remove();
    });

    minimizeButton.addEventListener('click', () => {
        console.log('Minimize button clicked');
        if (windowElement.classList.contains('minimized')) {
            windowElement.style.display = 'block';
            windowElement.classList.remove('minimized');
    
            const miniature = document.querySelector(`#minimized-${windowElement.id}`);
            miniature.parentNode.removeChild(miniature);
        } else {
            windowElement.dataset.height = windowElement.style.height;
            windowElement.style.display = 'none';
            windowElement.classList.add('minimized');
    
            const minimizedWindows = document.getElementById('minimized-windows');
            const miniature = document.createElement('button');
            miniature.id = `minimized-${windowElement.id}`;
            
            // Use the data-icon attribute to set the icon
            const iconPath = windowElement.dataset.icon;
            if (iconPath) {
                const iconImg = document.createElement('img');
                iconImg.src = iconPath;
                miniature.appendChild(iconImg);
            }
            
            // Add window's ID as text beside the icon
            const textNode = document.createTextNode(windowElement.id);
            miniature.appendChild(textNode);
            
            miniature.className = 'minimized-window';
            miniature.addEventListener('click', () => {
                windowElement.style.display = 'block';
                windowElement.classList.remove('minimized');
                miniature.parentNode.removeChild(miniature);
    
                highestZIndex += 1;
                windowElement.style.zIndex = highestZIndex;
            });
            minimizedWindows.appendChild(miniature);
        }
    });
    







    // Définition de la fonction adjustWindowPosition en premier
function adjustWindowPosition(target) {
    
    let x = (parseFloat(target.style.left) || 0);
    let y = (parseFloat(target.style.top) || 0);
    
    if (y < 0) {
        console.log("Adjusting top position");
        target.style.top = '0px';
    }
    if (x < 0) {
        console.log("Adjusting left position");
        target.style.left = '0px';
    }
    if (y + target.offsetHeight > window.innerHeight) {
        console.log("Adjusting bottom position");
        target.style.top = (window.innerHeight - target.offsetHeight) + 'px';
    }
    if (x + target.offsetWidth > window.innerWidth) {
        console.log("Adjusting right position");
        target.style.left = (window.innerWidth - target.offsetWidth) + 'px';
    }
}

// Ensuite le reste du code

let resizing = false;

document.addEventListener('mousedown', function() {
    const resizingElement = document.querySelector('.window'); 
    if (resizingElement) {
        resizing = true;
    }
});

document.addEventListener('mouseup', function() {
    if (resizing) { 
        adjustWindowPosition(windowElement);
        resizing = false; 
    }
});

if (!windowElement.classList.contains('fixed-size')) {
    interact(windowElement)
    .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
            move (event) {
                const target = event.target;
                let x = (parseFloat(target.style.left) || 0);
                let y = (parseFloat(target.style.top) || 0);
        
                target.style.width = event.rect.width + 'px';
                target.style.height = event.rect.height + 'px';
                
                x += event.deltaRect.left;
                y += event.deltaRect.top;
        
                target.style.left = x + 'px';
                target.style.top = y + 'px';
            },
            resizeend (event) {
                console.log("Resize ended, adjusting window position..."); 
                adjustWindowPosition(event.target);
            }
        }
    });







        


        if(maximizeButton) {
            maximizeButton.addEventListener('click', maximizeWindow);
            header.addEventListener('dblclick', maximizeWindow);
        }

        function maximizeWindow() {
            if (windowElement.classList.contains('maximized')) {
                // Restaurer les dimensions et la position
                windowElement.style.width = windowElement.dataset.width;
                windowElement.style.height = windowElement.dataset.height;
                
                // Restaurer les valeurs de left et top en ajoutant 'px' 
                windowElement.style.left = `${windowElement.dataset.x}px`;
                windowElement.style.top = `${windowElement.dataset.y}px`;
        
                windowElement.classList.remove('maximized');
            } else {
                // Stocker les dimensions actuelles
                windowElement.dataset.width = windowElement.style.width;
                windowElement.dataset.height = windowElement.style.height;
        
                // Stocker la position actuelle en retirant les unités 'px'
                windowElement.dataset.x = windowElement.style.left.replace('px', '');
                windowElement.dataset.y = windowElement.style.top.replace('px', '');
        
                // Maximiser la fenêtre
                windowElement.style.width = '100vw';
                windowElement.style.height = `calc(100vh - 50px)`; // soustraire la hauteur de la navbar
                windowElement.style.left = '0';   // Positionner à gauche
                windowElement.style.top = '0';    // Positionner en haut
                windowElement.classList.add('maximized');
            }
        }            
    }

    windowElement.addEventListener('mousedown', () => {
        if (!windowElement.style.left) {
            const rect = windowElement.getBoundingClientRect();
            windowElement.style.left = `${rect.left}px`;
            windowElement.style.top = `${rect.top}px`;
        }

        highestZIndex += 1;
        windowElement.style.zIndex = highestZIndex;
    });

    // Center the window in the viewport
    const windowWidth = windowElement.offsetWidth;
    const windowHeight = windowElement.offsetHeight;
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const initialX = (viewportWidth - windowWidth) / 2;
    const initialY = (viewportHeight - windowHeight) / 2;
    windowElement.style.left = `${initialX}px`;
    windowElement.style.top = `${initialY}px`;
}

function openWindow(windowId) {
    // Get the template window by appending '-template' to the windowId
    const templateWindow = document.getElementById(windowId + '-template');
    if (templateWindow) {
        // Clone the template window and give the clone the original windowId
        const windowClone = templateWindow.cloneNode(true);
        windowClone.id = windowId;
        windowClone.classList.remove('hidden');

        highestZIndex++;
        windowClone.style.zIndex = highestZIndex;

        // Add the clone to the body
        document.querySelector('.windows').appendChild(windowClone);

        // Add the necessary event listeners to the clone
        initializeWindow(windowClone);

        // Center the clone in the viewport
        const windowWidth = windowClone.offsetWidth;
        const windowHeight = windowClone.offsetHeight;
        const viewportWidth = document.documentElement.clientWidth;
        const viewportHeight = document.documentElement.clientHeight;
        const initialX = (viewportWidth - windowWidth) / 2;
        const initialY = (viewportHeight - windowHeight) / 2;
        windowClone.style.left = `${initialX}px`;
        windowClone.style.top = `${initialY}px`;

        console.log('Open window: ' + windowId);
    }
}









