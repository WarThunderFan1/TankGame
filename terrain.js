// Basic setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add a ground plane with height data
const size = 1000;
const divisions = 100;
const planeGeometry = new THREE.PlaneGeometry(size, size, divisions, divisions);
const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2; // Rotate the plane to be horizontal
scene.add(plane);

// Generate hills by modifying plane vertices
function generateHills() {
    const heightData = [];
    for (let i = 0; i <= divisions; i++) {
        heightData[i] = [];
        for (let j = 0; j <= divisions; j++) {
            const height = Math.random() * 10;
            heightData[i][j] = height;
            plane.geometry.attributes.position.setZ(i * (divisions + 1) + j, height);
        }
    }
    plane.geometry.computeVertexNormals();
    return heightData;
}
const heightData = generateHills();

// Add trees
function addTrees() {
    const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.5, 5, 32);
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
    const leavesGeometry = new THREE.ConeGeometry(2, 5, 32);
    const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x228b22 });

    for (let i = 0; i < 50; i++) {
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        
        const x = Math.random() * size - size / 2;
        const z = Math.random() * size - size / 2;
        const y = getHeightAt(x, z, heightData);

        trunk.position.set(x, y + 2.5, z);
        leaves.position.set(x, y + 5, z);

        scene.add(trunk);
        scene.add(leaves);
    }
}
addTrees();

// Add rocks
function addRocks() {
    const rockGeometry = new THREE.DodecahedronGeometry(2);
    const rockMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });

    for (let i = 0; i < 20; i++) {
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        const x = Math.random() * size - size / 2;
        const z = Math.random() * size - size / 2;
        const y = getHeightAt(x, z, heightData);

        rock.position.set(x, y + 1, z);
        scene.add(rock);
    }
}
addRocks();

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Add a tank (a simple cube for this example)
const tankGeometry = new THREE.BoxGeometry(1, 1, 2);
const tankMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff });
const tank = new THREE.Mesh(tankGeometry, tankMaterial);
tank.position.y = getHeightAt(tank.position.x, tank.position.z, heightData) + 0.5;
scene.add(tank);

// Camera settings
camera.position.z = 10;
camera.position.y = 10;
camera.lookAt(tank.position);

// Tank movement
let moveForward = false;
let moveBackward = false;
let rotateLeft = false;
let rotateRight = false;

function handleKeyDown(event) {
    switch (event.key) {
        case 'w':
            moveForward = true;
            break;
        case 's':
            moveBackward = true;
            break;
        case 'a':
            rotateLeft = true;
            break;
        case 'd':
            rotateRight = true;
            break;
    }
}

function handleKeyUp(event) {
    switch (event.key) {
        case 'w':
            moveForward = false;
            break;
        case 's':
            moveBackward = false;
            break;
        case 'a':
            rotateLeft = false;
            break;
        case 'd':
            rotateRight = false;
            break;
    }
}

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// Get height at a specific position
function getHeightAt(x, z, heightData) {
    const halfSize = size / 2;
    const i = Math.floor((x + halfSize) / size * divisions);
    const j = Math.floor((z + halfSize) / size * divisions);
    return heightData[i][j];
}

// Game loop
function animate() {
    requestAnimationFrame(animate);

    if (moveForward) {
        tank.translateZ(-0.1);
    }
    if (moveBackward) {
        tank.translateZ(0.1);
    }
    if (rotateLeft) {
        tank.rotation.y += 0.05;
    }
    if (rotateRight) {
        tank.rotation.y -= 0.05;
    }

    // Adjust tank height based on terrain
    tank.position.y = getHeightAt(tank.position.x, tank.position.z, heightData) + 0.5;

    renderer.render(scene, camera);
}

animate();
