import { increaseAndGetZIndex } from './window-initialization.js';
import { updateWindowDataAttributes } from './resize-management.js';

const margin = 100;
let originalDataX;
let originalDataY;
let isWindowDragging = false;

function updateDragPosition(event) {
  const windowElement = event.target.closest('.window');  // Trouver l'élément .window parent
  let x = (parseFloat(windowElement.getAttribute('data-x')) || 0) + event.dx;
  let y = (parseFloat(windowElement.getAttribute('data-y')) || 0) + event.dy;

  const windowWidth = windowElement.offsetWidth;
  const windowHeight = windowElement.offsetHeight;
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = document.documentElement.clientHeight;

  if (x < -margin) x = -margin;
  if (y < 0) y = 0;
  if (x + windowWidth - margin > viewportWidth)
      x = viewportWidth - windowWidth + margin;
  if (y + windowHeight - margin > viewportHeight)
      y = viewportHeight - windowHeight + margin;

  windowElement.style.left = x + 'px';
  windowElement.style.top = y + 'px';
  windowElement.setAttribute('data-x', x);
  windowElement.setAttribute('data-y', y);

  
  updateWindowDataAttributes(windowElement, x, y);
}


export function attachDragEventsToWindow(windowElement) {
  const header = windowElement.querySelector('.window-header');
  if (!header) return;

  interact(header).draggable({
      listeners: {
          start(event) {
              isWindowDragging = true;
              const parentWindow = event.target.closest('.window');
              originalDataX = parentWindow.getAttribute('data-x');
              originalDataY = parentWindow.getAttribute('data-y');
              parentWindow.style.zIndex = increaseAndGetZIndex();
          },
          move(event) {
              updateDragPosition(event);
          },
          end(event) {
              const parentWindow = event.target.closest('.window');
              if (parentWindow.classList.contains('maximized')) {
                  parentWindow.setAttribute('data-x', originalDataX);
                  parentWindow.setAttribute('data-y', originalDataY);
              }
              isWindowDragging = false;
          }
      }
  });

  windowElement.addEventListener('mousedown', (event) => {
      if (isWindowDragging) {
          return;
      }
      windowElement.style.zIndex = increaseAndGetZIndex();
      event.stopPropagation();
  });
}

document.addEventListener('DOMContentLoaded', function () {
  // Attacher les événements de glisser-déposer à toutes les fenêtres existantes
  document.querySelectorAll('.window').forEach(attachDragEventsToWindow);
});

