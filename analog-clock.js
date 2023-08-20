let renderer;
let secondHand;
let minuteHand;
let hourHand;
let clockGroup;
let shouldRender = true;
let isRendering = false;

function initializeThreeJS() {
    if (isRendering) {
        console.log("Le rendu est déjà en cours.");
        return;
    }
    
    const container = document.querySelector('.analog-clock-container');
    
    if (!container) {
        console.error("Erreur : Élément '.analog-clock-container' non trouvé.");
        return;
    }
    
    const canvasWidth = container.clientWidth;
    const canvasHeight = container.clientHeight;
    
    // Si le conteneur a des dimensions nulles, retenter après un délai
    if (canvasWidth === 0 || canvasHeight === 0) {
        console.log("Dimensions du conteneur invalide. Nouvelle tentative dans 100ms.");
        setTimeout(initializeThreeJS, 100);
        return;
    }
    
    console.log("Événement de chargement détecté.");
    console.log("Dimensions du conteneur:", canvasWidth, "x", canvasHeight);

    // Sélection du canvas
    const canvas = document.querySelector('#threeCanvas');
    if (!canvas) {
        console.error("Erreur : Élément '#threeCanvas' non trouvé.");
        return;
    }

    // Création de la scène principale
    const scene = new THREE.Scene();
    clockGroup = new THREE.Group();
    scene.add(clockGroup);
    console.log("Scène principale créée.");

    // Ajout d'une caméra orthographique
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    console.log("Caméra créée.");

    // Création du renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas
    });
    renderer.setSize(canvasWidth, canvasHeight);
    console.log("Renderer initialisé avec les dimensions:", canvasWidth, "x", canvasHeight);

    // Création du RenderTarget pour la texture pixelisée
    const dummyTexture = new THREE.WebGLRenderTarget(
        canvasWidth / 4,
        canvasHeight / 4,
        {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBFormat
        }
    );

    // Création du quadScene pour afficher la texture avec effet pixel art
    const quadScene = new THREE.Scene();
    const quadMaterial = new THREE.MeshBasicMaterial({
        map: dummyTexture.texture
    });
    const quadGeometry = new THREE.PlaneGeometry(2, 2);
    const quadMesh = new THREE.Mesh(quadGeometry, quadMaterial);
    quadScene.add(quadMesh);
    console.log("Scène quad créée.");




    // Intégration de l'horloge
    const radius = canvasWidth / 300;
    console.log("Canvas Width:", canvasWidth);
    console.log("Rayon calculé:", radius);
    const secondHandLength = radius;
    const secondHandWidth = 0.03;
    const secondHandGeometry = new THREE.PlaneGeometry(secondHandWidth, secondHandLength);
    const secondHandMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF0000
    });
    secondHand = new THREE.Mesh(secondHandGeometry, secondHandMaterial);
    secondHand.geometry.translate(0, secondHandLength / 2, 0);

    // Aiguille des minutes
    const minuteHandLength = 0.8 * radius; 
    const minuteHandWidth = 0.03; 

    const minuteHandGeometry = new THREE.PlaneGeometry(minuteHandWidth, minuteHandLength);
    const minuteHandMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF
    }); // Vert pour l'aiguille des minutes
    minuteHand = new THREE.Mesh(minuteHandGeometry, minuteHandMaterial);

    // Déplacez le pivot au bas de l'aiguille pour qu'elle tourne autour du bon point
    minuteHand.geometry.translate(0, minuteHandLength / 2, 0);

    // Aiguille des heures
    const hourHandLength = 0.65* radius;
    const hourHandWidth = 0.03;

    const hourHandGeometry = new THREE.PlaneGeometry(hourHandWidth, hourHandLength);
    const hourHandMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF

    }); // Bleu pour l'aiguille des heures
    hourHand = new THREE.Mesh(hourHandGeometry, hourHandMaterial);

    // Déplacez le pivot au bas de l'aiguille pour qu'elle tourne autour du bon point
    hourHand.geometry.translate(0, hourHandLength / 2, 0);





// Intégration des marqueurs d'heure
const markerSize = 0.02 * radius; 
const markerOffset = markerSize / 2;
const markerPositionRadius = radius - markerOffset;
console.log("Taille du marqueur:", markerSize);
console.log("Position du rayon du marqueur:", markerPositionRadius);

for (let hour = 0; hour < 12; hour++) {
    const angle = (hour * Math.PI / 6) - Math.PI / 2;

    const x = markerPositionRadius * Math.cos(angle);
    const y = markerPositionRadius * Math.sin(angle);

    console.log(`Marqueur pour l'heure ${hour + 1}: x=${x.toFixed(2)}, y=${y.toFixed(2)}`);

    const markerGeometry = new THREE.SphereGeometry(markerSize);
    const markerMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF
    });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);

    marker.position.set(x, y, 0.1);
    clockGroup.add(marker);
}

// Ajoutez ensuite les aiguilles à clockGroup.
clockGroup.add(hourHand);
clockGroup.add(minuteHand);
clockGroup.add(secondHand);

console.log("Longueur de l'aiguille des secondes:", secondHandLength);
console.log("Longueur de l'aiguille des minutes:", minuteHandLength);
console.log("Longueur de l'aiguille des heures:", hourHandLength);


    // Tournez le groupe pour le positionner correctement
    clockGroup.rotation.z = Math.PI / 2;



    function render() {
        if (!shouldRender) {
            console.log("Rendu interrompu.");
            isRendering = false;
            return;
        }
        isRendering = true;
        
        setAnalogClock();


        renderer.setRenderTarget(dummyTexture);
        renderer.render(scene, camera);


        renderer.setRenderTarget(null);
        renderer.render(quadScene, camera);

        requestAnimationFrame(render);
    }

    console.log("Début du rendu.");
    render();
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



window.addEventListener("resize", function () {
    const container = document.querySelector('.analog-clock-container');
    const canvasWidth = container.clientWidth;
    const canvasHeight = container.clientHeight;

    renderer.setSize(canvasWidth, canvasHeight);
    
    if(dummyTexture) { // Vérification ajoutée
        dummyTexture.setSize(canvasWidth / 4, canvasHeight / 4);
    }
});


document.body.addEventListener('click', function(event) {
    if (event.target.matches('.close')) {
        shouldRender = false;
        console.log("Bouton de fermeture cliqué. Rendu arrêté.");
    }
});

document.addEventListener('windowOpened', function(event) {
    if (event.detail && event.detail.windowId === 'clock-window') {
        checkContainerAndInit();
    }
});




