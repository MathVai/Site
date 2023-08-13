function deleteDesktopIcon(desktopIconContainer) {
    // Clear all the content of the icon
    while (desktopIconContainer.firstChild) {
        desktopIconContainer.removeChild(desktopIconContainer.firstChild);
    }

    // Mark the container as recyclable
    desktopIconContainer.setAttribute('data-recyclable', 'true');

    const currentX = parseFloat(desktopIconContainer.style.left || 0);
    const currentY = parseFloat(desktopIconContainer.style.top || 0);
    const initialX = parseFloat(desktopIconContainer.getAttribute('data-init-x') || 0);
    const initialY = parseFloat(desktopIconContainer.getAttribute('data-init-y') || 0);

    // If the icon had been moved, add its initial position to the available positions
    if (currentX !== initialX || currentY !== initialY) {
        window.availablePositions = window.availablePositions || [];
        window.availablePositions.push({ x: initialX, y: initialY });
    }
}

window.deleteDesktopIcon = deleteDesktopIcon;
