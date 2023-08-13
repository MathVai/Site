let activeWindow = null;
const margin = 100;
import { increaseAndGetZIndex } from './window-initialization.js';


function handleDragEnd(handleDrag, parentWindow) {
  window.isWindowDragging = false;
  const windowElement = event.target.closest('.window');
    if (windowElement) {
        windowElement.dataset.dragging = 'false';
    }
  return function (event) {
    event.stopPropagation();
    isDragging = false;
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', this);

    // Si la fenêtre est toujours maximisée après le déplacement, restaurez les valeurs originales de data-x et data-y
    if (parentWindow.classList.contains('maximized')) {
        parentWindow.setAttribute('data-x', originalDataX);
        parentWindow.setAttribute('data-y', originalDataY);
    }
  };
}

export function handleDragStart(event) {
  const parentWindow = event.currentTarget.parentNode;

  // Stocker les valeurs originales de data-x et data-y
  originalDataX = parentWindow.getAttribute('data-x');
  originalDataY = parentWindow.getAttribute('data-y');

  console.log("Drag started for", event.target.id);
  console.log("Setting zIndex in drag", event.target.id, increaseAndGetZIndex());
  event.target.style.zIndex = increaseAndGetZIndex();
  event.stopPropagation();
  isDragging = true;

  parentWindow.setAttribute('data-x', parentWindow.style.left);
  parentWindow.setAttribute('data-y', parentWindow.style.top);

  const handleDragClosure = handleDrag(parentWindow);

  document.addEventListener('mousemove', handleDragClosure);
  document.addEventListener('mouseup', handleDragEnd(handleDragClosure, parentWindow));
}

function handleDrag(target) {
  return function (event) {
    let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.movementX;
    let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.movementY;

    const windowWidth = target.offsetWidth;
    const windowHeight = target.offsetHeight;
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;

    if (x < -margin) x = -margin;
    if (y < 0) y = 0;
    if (x + windowWidth - margin > viewportWidth)
      x = viewportWidth - windowWidth + margin;
    if (y + windowHeight - margin > viewportHeight)
      y = viewportHeight - windowHeight + margin;

    target.style.left = x + 'px';
    target.style.top = y + 'px';
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  };
}



document.querySelectorAll('.window .window-header').forEach(header => {
  header.addEventListener('mousedown', (event) => {
    handleDragStart(event); // Commencez le glisser-déplacer en premier
    console.log("Setting zIndex on header click", event.currentTarget.parentNode.id);
    event.currentTarget.parentNode.style.zIndex = increaseAndGetZIndex(); // Mettez à jour le zIndex après
    event.stopPropagation();
  });
});

document.querySelectorAll('.window').forEach(windowElement => {
  windowElement.addEventListener('mousedown', (event) => {
    console.log("Setting zIndex on window click", windowElement.id);
    windowElement.style.zIndex = increaseAndGetZIndex();
    event.stopPropagation();
  });
});

