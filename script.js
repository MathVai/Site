import './navbar.js';
import './window-drag.js';
import './window-open.js';
import './window-initialization.js';
import './window-resize.js';
import './desktop-icon.js';
import './calculator.js';
import './delete-button.js';
import './open-explorer-window.js';
import './cursor.js';
import './menu-contextuel.js';
import './selection-box.js';
import './resize-management.js'

export let minimizedCount = 0;

export function incrementMinimizedCount() {
    minimizedCount++;
}

export function decrementMinimizedCount() {
  minimizedCount--;
  if (minimizedCount < 0) { // Pour s'assurer qu'il ne va pas en dessous de 0
      minimizedCount = 0;
  }
}




document.querySelector('.navbar .dropdown-content a[href="#"]').addEventListener('click', function(event) {
  event.preventDefault();
  const action = event.target.getAttribute('data-action');
  if (action && typeof window[action] === 'function') {
      window[action]();
  }
});
