Physijs.scripts.worker = "../assets/physijs/physijs_worker.js";
Physijs.scripts.ammo = '../ammo.js';

const renderer = new THREE.WebGLRenderer({
    antialias: true
});
const scene = new Physijs.Scene;
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const texture = new THREE.TextureLoader().load("../assets/wood.jpg");
let balls = [];
let tombol;

function get_random(min, max) {
    // min and max included
    let num = Math.random() * (max - min + 1) + min;
    return Math.round(num * 1000) / 1000;
}

function generate_floor() {
    const geometry = new THREE.BoxGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        side: THREE.DoubleSide
    });
    const plane = new Physijs.BoxMesh(geometry, material);
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.rotation = 180;
    scene.add(plane);
}

function generate_tombola() {
    tombol = new Physijs.SphereMesh(
        new THREE.SphereGeometry(2.5, 32, 32),
        new THREE.MeshBasicMaterial({
            wireframe: true,
            opacity: 0.5,
            color: "#EEE"
        })
    );
    tombol.position.x = 0;
    tombol.position.y = 0;
    tombol.position.z = 0;
    scene.add(tombol);
}

function generate_random_balls() {
    for (let index = 0; index < 50; index++) {
        let mesh = new Physijs.SphereMesh(
            new THREE.SphereGeometry(0.2, 32, 32),
            new THREE.MeshBasicMaterial({
                map: texture
            })
        );
        let x = get_random(0, 1.2);
        let y = get_random(0, 1.2);
        let z = get_random(0, 1.2);
        mesh.position.setFromSphericalCoords(x, y, z);
        scene.add(mesh);
        balls.push(mesh);
    }
}

function animate() {
    tombol.rotation.y += 0.005;
    scene.simulate();
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}

function initScene() {
    // Initiate function or other initializations here
    camera.position.z = 5;

    scene.setGravity(new THREE.Vector3(0, -0.001, 0));
    generate_floor();
    generate_tombola();
    generate_random_balls();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    animate();
}

window.onload = initScene();