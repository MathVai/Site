const radius = 50;  // Le rayon de notre horloge
const segments = 32;  // Nombre de segments pour rendre le cercle lisse

const clockFaceGeometry = new THREE.CircleGeometry(radius, segments);
const clockFaceMaterial = new THREE.MeshBasicMaterial({ color: 0xCCCCCC });  // Gris clair pour le visage
const clockFace = new THREE.Mesh(clockFaceGeometry, clockFaceMaterial);
scene.add(clockFace);

const secondHandLength = 45;  // Un peu moins que le rayon pour s'assurer qu'il ne sort pas du cercle
const secondHandWidth = 0.5;

const secondHandGeometry = new THREE.PlaneGeometry(secondHandWidth, secondHandLength);
const secondHandMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });  // Rouge pour l'aiguille des secondes
const secondHand = new THREE.Mesh(secondHandGeometry, secondHandMaterial);

// Déplacez le pivot au bas de l'aiguille pour qu'il tourne autour du bon point
secondHand.geometry.translate(0, secondHandLength / 2, 0);

scene.add(secondHand);

function setAnalogClock() {
    const now = new Date();
    const seconds = now.getSeconds();

    const secondsDegree = ((seconds / 60) * 360) + 90;

    // Convertissez les degrés en radians pour Three.js
    const radians = (secondsDegree * Math.PI) / 180;
    secondHand.rotation.z = -radians;  // Négatif car l'axe Z tourne dans le sens inverse des aiguilles d'une montre
}

function animate() {
    requestAnimationFrame(animate);

    // Mettre à jour l'horloge chaque seconde
    setAnalogClock();

    renderer.render(scene, camera);
}
animate();
