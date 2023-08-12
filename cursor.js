let cursorX = 0;
let cursorY = 0;

window.addEventListener('mousemove', e => {
    cursorX = e.clientX;
    cursorY = e.clientY;
});

function animateCursor() {
    const cursor = document.getElementById('cursor');
    const cursorRect = cursor.getBoundingClientRect();
    cursor.style.left = (cursorX + cursorRect.width / 2) + 'px';
    cursor.style.top = (cursorY + cursorRect.height / 2) + 'px';
    requestAnimationFrame(animateCursor);
}

let cursorType = 'default';

// Sélectionnez tous les éléments cliquables
const clickableElements = document.querySelectorAll('a, button, [tabindex]');

clickableElements.forEach(element => {
    element.addEventListener('mouseover', () => {
        const cursor = document.getElementById('cursor');
        cursor.style.backgroundImage = "url('./Icons/Souris2.svg')";
    });
    element.addEventListener('mouseout', () => {
        const cursor = document.getElementById('cursor');
        cursor.style.backgroundImage = "url('./Icons/Souris.svg')";
    });
});

animateCursor();
