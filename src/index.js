import { OrbitControls } from '../assets/threejs/jsm/controls/OrbitControls.js';

Physijs.scripts.worker = '../assets/physijs/physijs_worker.js';
Physijs.scripts.ammo = '../ammo.js';

const fov = 45;
const aspect = window.innerWidth / window.innerHeight;
const near = 1;
const far = 1000;

const renderer = new THREE.WebGLRenderer({
	antialias: true
});
const scene = new Physijs.Scene();
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
const loader = new THREE.TextureLoader();

let paused = false;
let balls = [];
let direction = 1;
let controls,
	render_stats,
	physics_stats,
	tombol,
	light,
	ground_material,
	box_material,
	ground;

const initScene = () => {
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

	controls = new OrbitControls(camera, document.body);
	controls.enableDamping = true;
	controls.target.set(0, 5, 0);
	controls.update();
	camera.position.set(0, 100, 100);
	camera.lookAt(scene.position);
	scene.add(camera);

	generate_light();
	generate_materials();
	generate_floor();
	//generate_tombola();
	generate_random_balls();

	requestAnimationFrame(render);
	scene.simulate();
};

const render = function () {
	//ground.rotation.x += 0.002 * direction;
	//ground.rotation.y += 0.002 * direction;

	if (ground.rotation.x < -0.4) direction = 1;
	if (ground.rotation.x > 0.4) direction = -1;
	ground.__dirtyRotation = true;
	renderer.render(scene, camera);
	render_stats.update();
	if (!paused) {
		requestAnimationFrame(render);
	}
};

function generate_light() {
	light = new THREE.DirectionalLight(0xffffff);
	light.position.set(20, 40, -15);
	light.target.position.copy(scene.position);
	light.castShadow = true;
	light.shadowCameraLeft = -60;
	light.shadowCameraTop = -60;
	light.shadowCameraRight = 60;
	light.shadowCameraBottom = 60;
	light.shadowCameraNear = 20;
	light.shadowCameraFar = 200;
	light.shadowBias = -0.0001;
	light.shadowMapWidth = light.shadowMapHeight = 2048;
	light.shadowDarkness = 0.7;

	scene.add(light);
}

function generate_materials() {
	// Materials
	ground_material = Physijs.createMaterial(
		new THREE.MeshLambertMaterial({
			map: loader.load('../assets/images/rocks.jpg')
		}),
		0.8, // high friction
		0.4 // low restitution
	);
	ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
	ground_material.map.repeat.set(3, 3);

	// box_material = Physijs.createMaterial(
	// 	new THREE.MeshLambertMaterial({
	// 		map: loader.load('../assets/images/plywood.jpg')
	// 	}),
	// 	0.4, // low friction
	// 	0.6 // high restitution
	// );
	// box_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
	// box_material.map.repeat.set(0.25, 0.25);
}

function generate_floor() {
	ground = new Physijs.BoxMesh(
		new THREE.BoxGeometry(100, 1, 100),
		ground_material,
		0 // mass
	);

	let borderLeft = new Physijs.BoxMesh(
		new THREE.BoxGeometry(2, 26, 100),
		ground_material,
		0
	);
	let borderRight = new Physijs.BoxMesh(
		new THREE.BoxGeometry(2, 26, 100),
		ground_material,
		0
	);
	let borderTop = new Physijs.BoxMesh(
		new THREE.BoxGeometry(100, 26, 2),
		ground_material,
		0
	);
	let borderBottom = new Physijs.BoxMesh(
		new THREE.BoxGeometry(100, 26, 2),
		ground_material,
		0
	);

	borderLeft.position.x = -50;
	borderLeft.position.y = 2;
	borderRight.position.x = 50;
	borderRight.position.y = 2;
	borderBottom.position.z = 50;
	borderBottom.position.y = 2;
	borderTop.position.z = -50;
	borderTop.position.y = 2;

	ground.add(borderLeft);
	ground.add(borderRight);
	ground.add(borderTop);
	ground.add(borderBottom);

	ground.receiveShadow = true;
	scene.add(ground);
}

function generate_tombola() {
	const mat = Physijs.createMaterial(
		new THREE.MeshPhongMaterial({
			opacity: 0.8,
			transparent: true,
			reflectivity: 10
		}),
		0.4, // friction
		0.9 // restitution
	);
	tombol = new Physijs.SphereMesh(
		new THREE.SphereGeometry(10, 32, 32, 6.2),
		mat,
		0.1 // mass
	);
	tombol.position.set(0, 20, 0);
	tombol.castShadow = true;
	scene.add(tombol);
}

// function randomSpherePoint(x0, y0, z0, radius) {
// 	var u = Math.random();
// 	var v = Math.random();
// 	var theta = 2 * Math.PI * u;
// 	var phi = Math.acos(2 * v - 1);
// 	var x = x0 + radius * Math.sin(phi) * Math.cos(theta);
// 	var y = y0 + radius * Math.sin(phi) * Math.sin(theta);
// 	var z = z0 + radius * Math.cos(phi);
// 	return [x, y, z];
// }

function get_random_pos(min, max) {
	// min and max included
	let x = Math.random() * (max - min + 1) + min;
	x = Math.round(x * 1000) / 1000;
	let y = Math.random() * (max - min + 1) + min;
	y = Math.round(y * 1000) / 1000;
	let z = Math.random() * (max - min + 1) + min;
	z = Math.round(z * 1000) / 1000;

	return [x, y, z];
}

function generate_random_balls() {
	const mat = Physijs.createMaterial(
		new THREE.MeshPhongMaterial({
			map: loader.load('../assets/images/plywood.jpg')
		}),
		0.2,
		1
	);

	// for (let index = 0; index < 150; index++) {
	// 	let mesh = new Physijs.SphereMesh(
	// 		new THREE.SphereGeometry(2, 32, 32),
	// 		mat,
	// 		0.1
	// 	);
	// 	let pos = get_random_pos(1, 10);
	// 	mesh.position.set(pos[0], pos[1], pos[2]);
	// 	mesh.position.set(0, 7, 0);
	// 	scene.add(mesh);
	// 	balls.push(mesh);
	// }

	let ballCount = 0;
	let timer = setInterval(() => {
		ballCount++;
		if (ballCount <= 50) {
			let mesh = new Physijs.SphereMesh(
				new THREE.SphereGeometry(2, 32, 32),
				mat,
				1
			);
			let pos = get_random_pos(1, 30);
			mesh.position.set(pos[0], pos[1], pos[2]);
			scene.add(mesh);
		} else {
			clearInterval(timer);
		}
	}, 100);
}

window.onload = initScene();
window.addEventListener('resize', (evt) => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;

	camera.updateProjectionMatrix();
});
