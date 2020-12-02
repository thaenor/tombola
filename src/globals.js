const fov = 45;
const aspect = window.innerWidth / window.innerHeight;
const near = 1;
const far = 1000;
const total_balls = 25;

let loader = new THREE.TextureLoader();
let font_loader = new THREE.FontLoader();

let renderer = new THREE.WebGLRenderer({
	antialias: true,
	alpha: true
});
let scene = new Physijs.Scene();
let camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
let controls;
let render_stats;
let physics_stats;

const game_el = document.getElementById('game');
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = true;
game_el.appendChild(renderer.domElement);

render_stats = new Stats();
render_stats.domElement.style.position = 'absolute';
render_stats.domElement.style.top = '1px';
render_stats.domElement.style.zIndex = 100;
game_el.appendChild(render_stats.domElement);

physics_stats = new Stats();
physics_stats.domElement.style.position = 'absolute';
physics_stats.domElement.style.top = '50px';
physics_stats.domElement.style.zIndex = 100;
game_el.appendChild(physics_stats.domElement);

scene.setGravity(new THREE.Vector3(0, -30, 0));
scene.addEventListener('update', function () {
	scene.simulate(undefined, 1);
	physics_stats.update();
});

camera.position.set(0, 100, 100);
camera.lookAt(scene.position);
scene.add(camera);
