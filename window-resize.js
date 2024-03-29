let resizing = false;

function attachResizeEventsToWindow(windowElement) {
    if (windowElement.classList.contains('fixed-size')) {
        return; // Si l'élément a la classe 'fixed-size', ne faites rien
    }

    interact(windowElement).resizable({
        edges: {
            left: true,
            right: true,
            bottom: true,
            top: true  
        },
        margin: 10,
        listeners: {
            move(event) {            
                const target = event.target;
                if (target.classList.contains('maximized')) {
                    return; 
                }

                let x = parseFloat(target.style.left) || 0;
                let y = parseFloat(target.style.top) || 0;

                target.style.width = event.rect.width + 'px';
                target.style.height = event.rect.height + 'px';

                x += event.deltaRect.left;
                y += event.deltaRect.top;

                target.style.left = x + 'px';
                target.style.top = y + 'px';

                target.dataset.x = x;
                target.dataset.y = y;
            },
            resizeend(event) {
                adjustWindowPosition(event.target);
                resizing = false; // Remettez le redimensionnement à false après avoir terminé
            },
            resizestart(event) {
                if (event.target.dataset.dragging === 'true') return;
                resizing = true; // Définissez le redimensionnement sur true lors du démarrage du redimensionnement
            }
        },
//        cursorChecker: () => 'none'
        
    });

    const maximizeButton = windowElement.querySelector('.maximize');
    const header = windowElement.querySelector('.window-header');

    if (maximizeButton) {
        maximizeButton.addEventListener('click', maximizeWindow);
        header.addEventListener('dblclick', maximizeWindow);
    }
    
    // Éviter le drag pendant le redimensionnement
    header.addEventListener('mousedown', function(e) {
        if (resizing) {
            e.preventDefault();
            return false;
        }
    });
}

document.addEventListener('mousedown', function () {
    const resizingElement = document.querySelector('.window');
    if (resizingElement) {
        resizing = true;
    }
});

function maximizeWindow(event) {
    const target = event.target.closest('.window');
    if (!target || target.classList.contains('fixed-size')) return; // Ajout de la vérification pour 'fixed-size'
    if (!target) return;

    if (target.classList.contains('maximized')) {
        // Restaurer les dimensions et la position
        target.style.width = target.dataset.originalWidth;
        target.style.height = target.dataset.originalHeight;
        target.style.left = target.dataset.originalX;
        target.style.top = target.dataset.originalY;

        target.classList.remove('maximized');
    } else {
        // Stocker les dimensions et la position actuelles seulement si elles n'ont pas déjà été stockées
        target.dataset.originalWidth = target.dataset.originalWidth || target.style.width;
        target.dataset.originalHeight = target.dataset.originalHeight || target.style.height;
        target.dataset.originalX = target.dataset.originalX || target.style.left || '0px';
        target.dataset.originalY = target.dataset.originalY || target.style.top || '0px';

        // Maximiser la fenêtre
        target.style.width = '100vw';
        target.style.height = `calc(100vh - 50px)`; 
        target.style.left = '0'; 
        target.style.top = '0'; 

        target.classList.add('maximized');
    }
}

export { attachResizeEventsToWindow };
