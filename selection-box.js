var selectionRect = null;
var isSelecting = false;
var startX = 0,
  startY = 0;
var didSelectionOccur = false;

document.addEventListener('mousedown', function (event) {
  if (event.button !== 0) return;
  if (!didSelectionOccur && !event.target.closest('.desktop-icon-container')) {
    const desktopIconContainers = document.querySelectorAll(
      '.desktop-icon-container'
    );
    desktopIconContainers.forEach((iconContainer) => {
      iconContainer.classList.remove('selected');
    });
  }
  didSelectionOccur = false;

  // Si l'utilisateur clique sur le bureau (et non sur une icône), initialisez le cadre de sélection
  if (
    !event.target.closest('.desktop-icon-container') &&
    !event.target.closest('button')
  ) {
    if (!selectionRect) {
      selectionRect = document.createElement('div');
      selectionRect.className = 'selection-rectangle';
      document.body.appendChild(selectionRect);
    }

    isSelecting = true;
    startX = event.clientX;
    startY = event.clientY;

    selectionRect.style.left = `${startX}px`;
    selectionRect.style.top = `${startY}px`;
    selectionRect.style.width = `0px`;
    selectionRect.style.height = `0px`;
    selectionRect.style.display = 'block';
  }
});

document.addEventListener('mousemove', function (event) {
  if (isSelecting && selectionRect) {
    const currentX = event.clientX;
    const currentY = event.clientY;

    const width = currentX - startX;
    const height = currentY - startY;

    selectionRect.style.width = `${Math.abs(width)}px`;
    selectionRect.style.height = `${Math.abs(height)}px`;
    selectionRect.style.left = `${width < 0 ? currentX : startX}px`;
    selectionRect.style.top = `${height < 0 ? currentY : startY}px`;

    const desktopIconContainers = document.querySelectorAll(
      '.desktop-icon-container'
    );
    desktopIconContainers.forEach((iconContainer) => {
      if (isElementInsideSelection(iconContainer, selectionRect)) {
        iconContainer.classList.add('selected');
      } else {
        iconContainer.classList.remove('selected');
      }
    });
  }
});

document.addEventListener('mouseup', function (event) {
  setTimeout(() => {
    if (isSelecting) {
      isSelecting = false;
      selectionRect.style.display = 'none';
    }
  }, 100); // Retarder la réinitialisation de isSelecting
});

function isElementInsideSelection(element, selection) {
  const rect1 = element.getBoundingClientRect();
  const rect2 = selection ? selection.getBoundingClientRect() : null;
  if (!rect2) return false;

  return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  );
}
