let cursorX = 0;
let cursorY = 0;

window.addEventListener('mousemove', e => {
    cursorX = e.clientX;
    cursorY = e.clientY;
});

function animateCursor() {
    const cursor = document.getElementById('cursor');
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
}

animateCursor();
