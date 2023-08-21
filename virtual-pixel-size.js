const vpsValue = getComputedStyle(document.documentElement).getPropertyValue('--vps').trim();

let vpsInPixels;
if (vpsValue.endsWith('vh')) {
    vpsInPixels = parseFloat(vpsValue) * window.innerHeight / 100;
} else if (vpsValue.endsWith('px')) {
    vpsInPixels = parseFloat(vpsValue);
}

// Arrondissez la valeur
vpsInPixels = Math.round(vpsInPixels);
