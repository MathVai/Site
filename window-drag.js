import { increaseAndGetZIndex } from './window-initialization.js';
import { updateWindowDataAttributes } from './resize-management.js';

const margin = 100;

let originalDataX;
let originalDataY;
let isWindowDragging = false;

function updateDragPosition(event) {
  const windowElement = event.target.closest('.window');
  let x = (parseFloat(windowElement.getAttribute('data-x')) || 0) + event.dx;
  let y = (parseFloat(windowElement.getAttribute('data-y')) || 0) + event.dy;

  const windowWidth = windowElement.offsetWidth;
  const windowHeight = windowElement.offsetHeight;
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = document.documentElement.clientHeight;

  const dataX = x;
  const dataY = y;
  if (x < -margin) x = -margin;
  if (y < 0) y = 0;
  if (x + windowWidth - margin > viewportWidth)
      x = viewportWidth - windowWidth + margin;
  if (y + windowHeight - margin > viewportHeight)
      y = viewportHeight - windowHeight + margin;

  windowElement.style.left = x + 'px';
  windowElement.style.top = y + 'px';
  updateWindowDataAttributes(windowElement, dataX, dataY);
}

export function attachDragEventsToWindow(windowElement) {
  const header = windowElement.querySelector('.window-header');
  if (!header) return;

  interact(header).draggable({
    cursorChecker: function (action, interactable, element, interacting) {
        return 'none'; // Force le curseur à être 'none'
    },
    listeners: {
        start(event) {
            isWindowDragging = true;
            document.body.classList.add('disable-interaction'); // Désactiver les interactions globales
            event.stopPropagation(); // Empêcher la propagation pour éviter la selection box
            const parentWindow = event.target.closest('.window');
            originalDataX = parentWindow.getAttribute('data-x');
            originalDataY = parentWindow.getAttribute('data-y');
            parentWindow.style.zIndex = increaseAndGetZIndex();
        },
        move(event) {
            updateDragPosition(event);
        },
        end(event) {
            document.body.classList.remove('disable-interaction'); // Réactiver les interactions globales
            isWindowDragging = false;
            const parentWindow = event.target.closest('.window');
            if (parentWindow.classList.contains('maximized')) {
                parentWindow.setAttribute('data-x', originalDataX);
                parentWindow.setAttribute('data-y', originalDataY);
            }
        }
    }
  });

  windowElement.addEventListener('mousedown', (event) => {
      if (isWindowDragging) {
          return;
      }
      windowElement.style.zIndex = increaseAndGetZIndex();
      event.stopPropagation(); // Empêcher la propagation pour éviter la selection box
  });
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.window').forEach(attachDragEventsToWindow);
});
