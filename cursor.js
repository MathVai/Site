let cursorX = 0;
let cursorY = 0;

window.addEventListener('mousemove', e => {
    cursorX = e.clientX;
    cursorY = e.clientY;
});

function animateCursor() {
    const cursor = document.getElementById('cursor');
    const targetElement = document.elementFromPoint(cursorX, cursorY);

    // Vérifiez si targetElement est non nul
    if (targetElement) {
        const customCursor = getComputedStyle(targetElement).getPropertyValue('--custom-cursor').trim();

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        if (customCursor && customCursor !== 'none') {
            cursor.style.backgroundImage = customCursor.replace(/["\s]/g, '');
        } else {
            cursor.style.backgroundImage = "url('./Icons/Souris.svg')";
        }
    }

    requestAnimationFrame(animateCursor);
}



animateCursor();
