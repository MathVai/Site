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


document.querySelector('.navbar .dropdown-content a[href="#"]').addEventListener('click', function(event) {
  event.preventDefault();
  const action = event.target.getAttribute('data-action');
  if (action && typeof window[action] === 'function') {
      window[action]();
  }
});
