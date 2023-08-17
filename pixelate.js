let renderer; // Déclaration de renderer au niveau global pour y accéder dans l'événement resize
let secondHand; // Déclaration de secondHand au niveau global
let minuteHand;  // Déclaration de minuteHand au niveau global
let hourHand;    // Déclaration de hourHand au niveau global
let clockGroup;  // Groupe pour l'horloge

function initializeThreeJS() {
    console.log("Événement de chargement détecté.");

    const container = document.querySelector('.analog-clock-container');
    if (!container) {
        console.error("Erreur : Élément '.analog-clock-container' non trouvé.");
        return;
    }
    const canvasWidth = container.clientWidth;
    const canvasHeight = container.clientHeight;
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
        canvasWidth / 4, // résolution x réduite pour l'effet pixelisé
        canvasHeight / 4, // résolution y réduite
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
    const radius = canvasWidth / 2;
    const secondHandLength = 0.0065 * radius;
    const secondHandWidth = 0.03;
    const secondHandGeometry = new THREE.PlaneGeometry(secondHandWidth, secondHandLength);
    const secondHandMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF0000
    });
    secondHand = new THREE.Mesh(secondHandGeometry, secondHandMaterial);
    secondHand.geometry.translate(0, secondHandLength / 2, 0);
    scene.add(secondHand);

    // Aiguille des minutes
    const minuteHandLength = 0.0055 * radius; // 80% du rayon
    const minuteHandWidth = 0.03; // Un peu plus épaisse que l'aiguille des secondes

    const minuteHandGeometry = new THREE.PlaneGeometry(minuteHandWidth, minuteHandLength);
    const minuteHandMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF
    }); // Vert pour l'aiguille des minutes
    minuteHand = new THREE.Mesh(minuteHandGeometry, minuteHandMaterial);

    // Déplacez le pivot au bas de l'aiguille pour qu'elle tourne autour du bon point
    minuteHand.geometry.translate(0, minuteHandLength / 2, 0);
    scene.add(minuteHand);

    // Aiguille des heures
    const hourHandLength = 0.0045 * radius; // 60% du rayon
    const hourHandWidth = 0.03; // Encore plus épaisse

    const hourHandGeometry = new THREE.PlaneGeometry(hourHandWidth, hourHandLength);
    const hourHandMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF
        
    }); // Bleu pour l'aiguille des heures
    hourHand = new THREE.Mesh(hourHandGeometry, hourHandMaterial);

    // Déplacez le pivot au bas de l'aiguille pour qu'elle tourne autour du bon point
    hourHand.geometry.translate(0, hourHandLength / 2, 0);
    scene.add(hourHand);

// Ajoutez chaque élément à clockGroup au lieu de scene
clockGroup.add(secondHand);
clockGroup.add(minuteHand);
clockGroup.add(hourHand);

// Tournez le groupe pour le positionner correctement
clockGroup.rotation.z = Math.PI / 2;

    function render() {
        // Mettre à jour l'horloge
        setAnalogClock();

        // Dessiner la scène principale (avec l'aiguille des secondes) sur la dummyTexture
        renderer.setRenderTarget(dummyTexture);
        renderer.render(scene, camera);

        // Dessiner la texture capturée (avec effet pixel art) sur le canvas
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
    const hours = (now.getHours() % 12) + (minutes / 60);  // Ajout de la fraction d'heure en fonction des minutes

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



window.addEventListener("resize", function () {
    const container = document.querySelector('.analog-clock-container');
    const canvasWidth = container.clientWidth;
    const canvasHeight = container.clientHeight;

    renderer.setSize(canvasWidth, canvasHeight);
    // Mettez à jour la taille de la dummyTexture si nécessaire
    dummyTexture.setSize(canvasWidth / 4, canvasHeight / 4);
});