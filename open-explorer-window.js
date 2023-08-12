function openExplorerWindow(folderIcon) {
    let folderName = folderIcon.querySelector('.desktop-icon-label').textContent;
    let folderContents = window.folderContents[folderName];


    const explorerContent = document.getElementById('explorer-content');
    explorerContent.innerHTML = ""; // nettoie la fenêtre de l'explorateur pour de nouveaux fichiers

    contents.forEach(item => {
        // Ajouter chaque élément à explorerContent
        let newItem = document.createElement('p');
        newItem.textContent = item;
        explorerContent.appendChild(newItem);
    });

    openWindow('explorer-window'); // ouvre la fenêtre de l'explorateur
}



window.openExplorerWindow = openExplorerWindow;