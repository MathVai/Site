export function updateWindowDataAttributes(windowElement, x, y) {
    windowElement.setAttribute('data-x', x);
    windowElement.setAttribute('data-y', y);
}

function adjustWindowPosition(windowElement) {
  // Récupérer les dimensions actuelles et la position de la fenêtre
  const rect = windowElement.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let newLeft = parseFloat(windowElement.style.left);
  let newTop = parseFloat(windowElement.style.top);

  // Vérifier si la fenêtre est partiellement en dehors du viewport horizontalement
  if (rect.right > viewportWidth && (rect.width / 2) > (viewportWidth - rect.left)) {
    newLeft = viewportWidth - (rect.width / 2);
  }

  if (rect.left < 0 && (rect.width / 2) > -rect.left) {
    newLeft = -(rect.width / 2);
  }

  // Vérifier si la fenêtre est partiellement en dehors du viewport verticalement
  if (rect.bottom > viewportHeight && (rect.height / 2) > (viewportHeight - rect.top)) {
    newTop = viewportHeight - (rect.height / 2);
  }

  if (rect.top < 0 && (rect.height / 2) > -rect.top) {
    newTop = -(rect.height / 2);
  }

  // Appliquer les nouvelles positions
  windowElement.style.left = `${newLeft}px`;
  windowElement.style.top = `${newTop}px`;

  return { newLeft, newTop };  // Renvoyez les nouvelles positions pour pouvoir les utiliser à l'extérieur de cette fonction
}

// Attacher l'événement de redimensionnement à la fenêtre
window.addEventListener('resize', () => {
  // Boucle sur toutes les fenêtres
  const allWindows = document.querySelectorAll('.window');
  allWindows.forEach(windowElement => {
    const { newLeft, newTop } = adjustWindowPosition(windowElement);  // Récupérez les nouvelles positions

    // Mettre à jour les attributs data-x et data-y
    updateWindowDataAttributes(windowElement, newLeft, newTop);
  });
});
