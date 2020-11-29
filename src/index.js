Physijs.scripts.worker = "../assets/physijs/physijs_worker.js";
Physijs.scripts.ammo = '../ammo.js';

const renderer = new THREE.WebGLRenderer({
    antialias: true
});
const scene = new Physijs.Scene;
const camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    1,
    1000
);
const texture = new THREE.TextureLoader().load("../assets/wood.jpg");
let balls = [];
let tombol;

const initScene = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    document.getElementById('viewport').appendChild(renderer.domElement);

    render_stats = new Stats();
    render_stats.domElement.style.position = 'absolute';
    render_stats.domElement.style.top = '1px';
    render_stats.domElement.style.zIndex = 100;
    document.getElementById('viewport').appendChild(render_stats.domElement);

    physics_stats = new Stats();
    physics_stats.domElement.style.position = 'absolute';
    physics_stats.domElement.style.top = '50px';
    physics_stats.domElement.style.zIndex = 100;
    document.getElementById('viewport').appendChild(physics_stats.domElement);

    camera.position.set(60, 50, 60);
    camera.lookAt(scene.position);
    scene.add(camera);

    scene.setGravity(new THREE.Vector3(0, -30, 0));
    scene.addEventListener(
        'update',
        function () {
            applyForce();
            scene.simulate(undefined, 1);
            physics_stats.update();
        }
    );
    generate_floor();
    generate_tombola();
    generate_random_balls();
    animate();
}

function get_random(min, max) {
    // min and max included
    let num = Math.random() * (max - min + 1) + min;
    return Math.round(num * 1000) / 1000;
}

function generate_floor() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        side: THREE.DoubleSide,
        opacity: 0.5,
        metalness: 0.5
    });
    const plane = new Physijs.BoxMesh(geometry, material);
    plane.scale.x = 30;
    plane.scale.y = 1;
    plane.scale.z = 30;
    scene.add(plane);
}

function generate_tombola() {
    tombol = new Physijs.SphereMesh(
        new THREE.SphereGeometry(3, 32, 32),
        new THREE.MeshBasicMaterial({
            wireframe: false,
            opacity: 0.5,
            color: "#EEE",
            roughness: 0.2,
            metalness: 0.6,
            transparent: true,
        })
    );
    tombol.position.set(0, 4.5, 0);
    scene.add(tombol);
}


function randomSpherePoint(x0, y0, z0, radius) {
    var u = Math.random();
    var v = Math.random();
    var theta = 2 * Math.PI * u;
    var phi = Math.acos(2 * v - 1);
    var x = x0 + (radius * Math.sin(phi) * Math.cos(theta));
    var y = y0 + (radius * Math.sin(phi) * Math.sin(theta));
    var z = z0 + (radius * Math.cos(phi));
    return [x, y, z];
}

function generate_random_balls() {
    for (let index = 0; index < 50; index++) {
        let mesh = new Physijs.SphereMesh(
            new THREE.SphereGeometry(0.2, 32, 32),
            new THREE.MeshBasicMaterial({
                map: texture
            })
        );
        let pos = randomSpherePoint(0, 4.5, 0, 2);
        mesh.position.set(pos[0], pos[1], pos[2]);
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

window.onload = initScene();