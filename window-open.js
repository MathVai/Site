function openWindow(windowId) {
  // Get the template window by appending '-template' to the windowId
  const templateWindow = document.getElementById(windowId + '-template');
  if (templateWindow) {
    // Clone the template window and give the clone the original windowId
    const windowClone = templateWindow.cloneNode(true);
    windowClone.id = windowId;
    windowClone.classList.remove('hidden');

    windowClone.style.zIndex = increaseAndGetZIndex();

    // Add the clone to the body
    document.querySelector('.windows').appendChild(windowClone);

    // Add the necessary event listeners to the clone
    initializeWindow(windowClone);

    // Center the clone in the viewport
    const windowWidth = windowClone.offsetWidth;
    const windowHeight = windowClone.offsetHeight;
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const initialX = (viewportWidth - windowWidth) / 2;
    const initialY = (viewportHeight - windowHeight) / 2;
    windowClone.style.left = `${initialX}px`;
    windowClone.style.top = `${initialY}px`;

    console.log('Open window: ' + windowId);
  }
}