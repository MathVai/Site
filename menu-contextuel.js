let isContextMenuOpen = false;

document.addEventListener("DOMContentLoaded", function() {
    const contextMenu = document.getElementById('context-menu');

    let contextMenuOptions = {
        'desktop-icon': `<div style="display: flex; flex-direction: column;">
                            <button class="context-menu-option" id="delete-icon">Supprimer l'icône</button>
                         </div>`,
        'desktop': `<div style="display: flex; flex-direction: column;">
                        <button class="context-menu-option" id="reset-icons">Réinitialiser les icônes</button>
                        <button class="context-menu-option" id="create-folder">Nouveau dossier</button>
                    </div>`
    };

    document.addEventListener('contextmenu', function(event) {
        event.preventDefault();

        if (event.target.closest('.window-header') || event.target.closest('.navbar') || event.target.closest('.window')) {
            return;
        }
        const isIconSelected = document.querySelector('.desktop-icon-container.selected');
        let target = event.target.closest('.desktop-icon') || isIconSelected ? 'desktop-icon' : 'desktop';

        const clickedIconContainer = event.target.closest('.desktop-icon-container');
        if (clickedIconContainer) {
            clickedIconContainer.classList.add('selected');
        }

        contextMenu.style.display = 'block';
        contextMenu.style.left = `${event.pageX}px`;
        contextMenu.style.top = `${event.pageY}px`;

        contextMenu.innerHTML = contextMenuOptions[target];
        
        const contextMenuButtons = document.querySelectorAll('.context-menu-option');

        contextMenuButtons.forEach((option) => {
            option.addEventListener('click', function(event) {
                event.stopPropagation();

                if (event.target.id === 'delete-icon') {
                    console.log("Delete icon option clicked in context menu...");
                    const selectedDesktopIcons = Array.from(document.querySelectorAll('.desktop-icon-container.selected'));
                    if(selectedDesktopIcons.length) {
                        selectedDesktopIcons.forEach(icon => {
                            window.deleteDesktopIcon(icon);
                        });
                    } else {
                        console.log("Aucune icône de bureau sélectionnée pour la suppression");
                    }        
                } else if (event.target.id === 'reset-icons') {
                    resetDesktopIcons();
                } else if (event.target.id === 'create-folder')
                    window.createNewFolder(document.createFileSystemNode('New Folder').id);

                contextMenu.style.display = 'none'; 
            });
        });
    });

    document.addEventListener('mousedown', function(event) {
        if (!contextMenu.contains(event.target)) {
            contextMenu.style.display = 'none';
            isContextMenuOpen = false;
        }
    });

});
