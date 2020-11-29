Physijs.scripts.worker = '../assets/physijs/physijs_worker.js';
Physijs.scripts.ammo = '../ammo.js';

const renderer = new THREE.WebGLRenderer({
	antialias: true
});
const scene = new Physijs.Scene();
const camera = new THREE.PerspectiveCamera(
	35,
	window.innerWidth / window.innerHeight,
	1,
	1000
);
const loader = new THREE.TextureLoader();
let balls = [];
let tombol, light, ground_material, box_material, ground;

const initScene = () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.shadowMapSoft = true;
	document.body.appendChild(renderer.domElement);

	render_stats = new Stats();
	render_stats.domElement.style.position = 'absolute';
	render_stats.domElement.style.top = '1px';
	render_stats.domElement.style.zIndex = 100;
	document.body.appendChild(render_stats.domElement);

	physics_stats = new Stats();
	physics_stats.domElement.style.position = 'absolute';
	physics_stats.domElement.style.top = '50px';
	physics_stats.domElement.style.zIndex = 100;
	document.body.appendChild(physics_stats.domElement);

	scene.setGravity(new THREE.Vector3(0, -30, 0));
	scene.addEventListener('update', function () {
		scene.simulate(undefined, 1);
		physics_stats.update();
	});

	camera.position.set(60, 50, 60);
	camera.lookAt(scene.position);
	scene.add(camera);

	generate_light();
	generate_materials();
	generate_floor();
	generate_tombola();
	generate_random_balls();

	requestAnimationFrame(render);
	scene.simulate();
};

render = function () {
	requestAnimationFrame(render);
	renderer.render(scene, camera);
	render_stats.update();
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
	ground.receiveShadow = true;
	scene.add(ground);
}

function get_random(min, max) {
	// min and max included
	let num = Math.random() * (max - min + 1) + min;
	return Math.round(num * 1000) / 1000;
}

function generate_tombola() {
	const mat = Physijs.createMaterial(
		new THREE.MeshPhongMaterial(
			{ opacity: 0.8, transparent: true, reflectivity: 10 },
			0.4, // friction
			0.9 // restitution
		)
	);
	tombol = new Physijs.SphereMesh(
		new THREE.SphereGeometry(10, 32, 32),
		mat,
		0 // mass
	);
	tombol.position.set(0, 20, 0);
	tombol.castShadow = true;
	scene.add(tombol);
}

function randomSpherePoint(x0, y0, z0, radius) {
	var u = Math.random();
	var v = Math.random();
	var theta = 2 * Math.PI * u;
	var phi = Math.acos(2 * v - 1);
	var x = x0 + radius * Math.sin(phi) * Math.cos(theta);
	var y = y0 + radius * Math.sin(phi) * Math.sin(theta);
	var z = z0 + radius * Math.cos(phi);
	return [x, y, z];
}

function generate_random_balls() {
	const mat = Physijs.createMaterial(
		new THREE.MeshPhongMaterial({
			opacity: 0.8,
			transparent: true,
			map: loader.load('../assets/images/plywood.jpg')
		})
	);
	for (let index = 0; index < 5; index++) {
		let mesh = new Physijs.SphereMesh(new THREE.SphereGeometry(1, 32, 32), mat);
		let pos = randomSpherePoint(0, 20, 0, 7);
		mesh.position.set(pos[0], pos[1], pos[2]);
		scene.add(mesh);
		balls.push(mesh);
	}
}

window.onload = initScene();
window.addEventListener('resize', (evt) => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;

	camera.updateProjectionMatrix();
});
