// =======================
// Déclaration des variables globales
// =======================

let scene, camera, renderer, clockGroup, displayScene, displayCamera;
let secondHand, minuteHand, hourHand;
let shouldRender = true;
let isRendering = false;
let dummyTexture;



// =======================
// Gestionnaires d'événements
// =======================

document.addEventListener('windowOpened', handleWindowOpenedEvent);

function handleWindowOpenedEvent(e) {
    console.log("Événement 'windowOpened' déclenché pour la fenêtre:", e.windowId);

    if (e.windowId !== "clock-window") {
        console.log("Événement 'windowOpened' n'est pas pour 'clock-window'. Ignoré.");
        return;
    }

    const clonedContainer = document.querySelector(`.window[data-id="${e.windowId}"] .analog-clock-container`);
    if (!clonedContainer) {
        console.error("Conteneur cloné pour l'horloge analogique non trouvé.");
        return;
    }

    console.log("Conteneur cloné trouvé pour l'horloge analogique.");
    if (clonedContainer.clientWidth <= 0 || clonedContainer.clientHeight <= 0) {
        console.error("Dimensions non valides pour le conteneur cloné:", clonedContainer.clientWidth, "x", clonedContainer.clientHeight);
        return;
    }

    console.log("Dimensions valides trouvées. Initialisation de ThreeJS.");
    shouldRender = true;
    initializeThreeJS(clonedContainer);
}

function addEventListeners() {
    window.addEventListener('resize', onWindowResize);; // Utilisez handleResize ici
}

window.addEventListener('resize', onWindowResize);

function onWindowResize() {
    const clonedContainer = document.querySelector('.window[data-id="clock-window"] .analog-clock-container');
    if (!clonedContainer) {
        return;
    }

    const rect = clonedContainer.getBoundingClientRect();
    console.log("Rect du conteneur:", rect);

    if (rect.width <= 0 || rect.height <= 0) {
        console.log("Dimensions du conteneur non valides, ne redimensionne pas.");
        return;
    }

    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
    renderer.setSize(rect.width, rect.height);

    // Récupération de la valeur vps
    const vpsValue = getComputedStyle(document.documentElement).getPropertyValue('--vps').trim();

    // Calcul de vps en pixels
    let vpsInPixels;
    if (vpsValue.endsWith('vh')) {
        vpsInPixels = parseFloat(vpsValue) * window.innerHeight / 100;
    } else if (vpsValue.endsWith('px')) {
        vpsInPixels = parseFloat(vpsValue);
    }

    // Calcul de la résolution
    const resolutionX = Math.max(1, Math.round(rect.width / vpsInPixels));
    const resolutionY = Math.max(1, Math.round(rect.height / vpsInPixels));

    // Mise à jour de la taille de dummyTexture
    if (dummyTexture) {
        dummyTexture.setSize(resolutionX, resolutionY);
    }
}




document.body.addEventListener('click', function (event) {
    if (event.target.matches('.close') && event.target.closest('.window[data-id="clock-window"]')) {
        shouldRender = false;
        console.log("Bouton de fermeture de l'horloge cliqué. Rendu arrêté.");
    }
});


// =======================
// Initialisation et rendu avec ThreeJS
// =======================

function initializeThreeJS(container) {
    if (isRendering) {
        console.log("Le rendu est déjà en cours.");
        return;
    }

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    console.log("Taille du conteneur:", containerWidth, containerHeight);

    console.log("Dimensions de WebGLRenderTarget:", containerWidth / 4, containerHeight / 4);


// Récupération de la valeur vps
const vpsValue = getComputedStyle(document.documentElement).getPropertyValue('--vps').trim();

// Calcul de vps en pixels
let vpsInPixels;
if (vpsValue.endsWith('vh')) {
    vpsInPixels = parseFloat(vpsValue) * window.innerHeight / 100;
} else if (vpsValue.endsWith('px')) {
    vpsInPixels = parseFloat(vpsValue);
}

// Calcul de la résolution
const resolutionX = Math.max(1, Math.round(containerWidth / vpsInPixels));
const resolutionY = Math.max(1, Math.round(containerHeight / vpsInPixels));

console.log(vpsValue, resolutionX, resolutionY);

dummyTexture = new THREE.WebGLRenderTarget(
    resolutionX,
    resolutionY, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBFormat
    }
);

    

    console.log("Résolution :", resolutionX, resolutionY);


    console.log("Taille du conteneur :", containerWidth, containerHeight);

    setupRenderer(container, containerWidth, containerHeight);




    clockGroup = new THREE.Group();
    clockGroup.rotation.z = Math.PI / 2; // Rotation de 90 degrés


    if (scene) {
        scene.add(clockGroup);
    } else {
        console.error("Scene n'est pas définie.");
        return;
    }

    // Créez une nouvelle scène et une nouvelle caméra pour afficher la texture
    displayScene = new THREE.Scene();
    displayCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Créez un maillage pour afficher la texture
    const geometry = new THREE.PlaneBufferGeometry(2, 2);

    if (dummyTexture && dummyTexture.texture) {
        const material = new THREE.MeshBasicMaterial({
            map: dummyTexture.texture
        });
        const mesh = new THREE.Mesh(geometry, material);
        displayScene.add(mesh);
    } else {
        console.error("Dummy texture ou sa texture interne n'est pas définie.");
        return;
    }

    setupCamera(containerWidth, containerHeight);
    createHourMarkers(containerWidth);
    createClockHands(containerWidth);
    addEventListeners();

    isRendering = true;
    animate();
}

function setupRenderer(container, width, height) {
    console.log("Début de setupRenderer");
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
    console.log("Fin de setupRenderer");
}

function setupCamera(containerWidth, containerHeight) {
    const left = -containerWidth / 2;
    const right = containerWidth / 2;
    const top = containerHeight / 2;
    const bottom = -containerHeight / 2;
    const near = 0.1;
    const far = 1000;

    camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
    camera.position.z = 5; // Positionnez la caméra de manière à ce qu'elle pointe vers la scène.
    return camera;
}


function animate() {
    if (!shouldRender) {
        isRendering = false; // Réinitialiser la variable de rendu
        return; // Arrêtez la boucle de rendu si shouldRender est false
    }
    requestAnimationFrame(animate);

    updateClockTime();

    renderer.setRenderTarget(dummyTexture);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null); // Réinitialiser le rendu cible pour rendre à l'écran ensuite
    renderer.render(displayScene, displayCamera);
}


// =======================
// Création des éléments de l'horloge
// =======================

function createClockHands(containerWidth) {
    const radius = containerWidth / 2;

    // Aiguille des secondes
    const secondHandLength = 0.8 * radius;
    const secondHandWidth = 4.5;
    const secondHandGeometry = new THREE.PlaneGeometry(secondHandWidth, secondHandLength);
    const secondHandMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF0000,
        depthTest: false,
        depthWrite: false
    });
    secondHand = new THREE.Mesh(secondHandGeometry, secondHandMaterial);
    secondHand.geometry.translate(0, secondHandLength / 2, 0);
    clockGroup.add(secondHand);

    // Aiguille des minutes
    const minuteHandLength = 0.65 * radius;
    const minuteHandWidth = 4.5;
    const minuteHandGeometry = new THREE.PlaneGeometry(minuteHandWidth, minuteHandLength);
    const minuteHandMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF
    });
    minuteHand = new THREE.Mesh(minuteHandGeometry, minuteHandMaterial);
    minuteHand.geometry.translate(0, minuteHandLength / 2, 0);
    clockGroup.add(minuteHand);

    // Aiguille des heures
    const hourHandLength = 0.55 * radius;
    const hourHandWidth = 4.5;
    const hourHandGeometry = new THREE.PlaneGeometry(hourHandWidth, hourHandLength);
    const hourHandMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF
    });
    hourHand = new THREE.Mesh(hourHandGeometry, hourHandMaterial);
    hourHand.geometry.translate(0, hourHandLength / 2, 0);
    clockGroup.add(hourHand);

    secondHand.position.z = 0.5; // Placez ceci au-dessus des autres éléments
    minuteHand.position.z = 0.4;
    hourHand.position.z = 0.3;


}

function createHourMarkers(containerWidth) {
    const radius = containerWidth / 2;
    const markerSize = 4;
    const markerOffset = markerSize / 2;
    const markerPositionRadius = 0.8 * radius - markerOffset;

    for (let hour = 0; hour < 12; hour++) {
        const angle = (hour * Math.PI / 6) - Math.PI / 2;
        const x = markerPositionRadius * Math.cos(angle);
        const y = markerPositionRadius * Math.sin(angle);
        const markerGeometry = new THREE.SphereGeometry(markerSize);
        const markerMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF
        });
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.position.set(x, y, 0.1);
        clockGroup.add(marker);
    }

}

function updateClockTime() {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = (now.getHours() % 12) + (minutes / 60);

    const secondsDegree = ((seconds / 60) * 360) + 90;
    const minutesDegree = ((minutes / 60) * 360) + 90;
    const hoursDegree = ((hours / 12) * 360) + 90;

    const secRadians = (secondsDegree * Math.PI) / 180;
    const minRadians = (minutesDegree * Math.PI) / 180;
    const hourRadians = (hoursDegree * Math.PI) / 180;

    secondHand.rotation.z = -secRadians;
    minuteHand.rotation.z = -minRadians;
    hourHand.rotation.z = -hourRadians;
}

function setAnalogClock() {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = (now.getHours() % 12) + (minutes / 60); // Ajout de la fraction d'heure en fonction des minutes

    const secondsDegree = ((seconds / 60) * 360) + 90;
    const minutesDegree = ((minutes / 60) * 360) + 90;
    const hoursDegree = ((hours / 12) * 360) + 90;

    const secRadians = (secondsDegree * Math.PI) / 180;
    const minRadians = (minutesDegree * Math.PI) / 180;
    const hourRadians = (hoursDegree * Math.PI) / 180;

    secondHand.rotation.z = -secRadians;
    minuteHand.rotation.z = -minRadians;
    hourHand.rotation.z = -hourRadians;

    // console.log("Secondes (degrés et radians):", secondsDegree, secRadians);
    // console.log("Minutes (degrés et radians):", minutesDegree, minRadians);
    // console.log("Heures (degrés et radians):", hoursDegree, hourRadians);
}