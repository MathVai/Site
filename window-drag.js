import { increaseAndGetZIndex } from './window-initialization.js';

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
}


document.querySelectorAll('.window .window-header').forEach(header => {
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
});

document.querySelectorAll('.window').forEach(windowElement => {
    windowElement.addEventListener('mousedown', (event) => {
        if (isWindowDragging) {
            return;
        }
        windowElement.style.zIndex = increaseAndGetZIndex();
        event.stopPropagation();
    });
});
