import { OrbitControls } from '../assets/threejs/jsm/controls/OrbitControls.js';
import { generate_light } from './Components/light.js';
import { generate_floor } from './Components/floor.js';
import {
	generate_ground_material,
	generate_wood_material
} from './Components/materials.js';
import {
	generate_random_balls,
	add_spheres_to_scene
} from './Components/sphere.js';

const state = {
	credits: 1,
	paused: true,
	bet: 0,
	direction: 1,
	balls: [],
	ground_material: {},
	box_material: {}
};
let floor;

const init_scene = () => {
	controls = new OrbitControls(camera, document.body);
	controls.enableDamping = true;
	controls.dampingFactor = 0.05;
	controls.screenSpacePanning = false;
	controls.target.set(0, 5, 0);
	controls.update();

	let light_1 = generate_light(20, 40, -15);
	let light_2 = generate_light(-20, 40, 15);
	floor = generate_floor();

	font_loader.load('/assets/fonts/helvetiker_regular.typeface.json', (font) => {
		state.balls = generate_random_balls(font);
		add_spheres_to_scene(state.balls);
	});

	// const geometry = new THREE.BoxGeometry();
	// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	// const cube = new THREE.Mesh(geometry, material);
	// cube.position.set(-20, 40, 15);
	// scene.add(cube);

	scene.add(floor);
	scene.add(light_1);
	scene.add(light_2);

	//scene.simulate();
	requestAnimationFrame(render);
};

const render = function () {
	if (!state.paused) {
		floor.rotation.x += 0.003 * state.direction;
		floor.rotation.y += 0.003 * state.direction;

		if (floor.rotation.x < -0.4) state.direction = 1;
		if (floor.rotation.x > 0.4) state.direction = -1;
		floor.__dirtyRotation = true;
		scene.simulate();
	}

	renderer.render(scene, camera);
	render_stats.update();
	controls.update();
	requestAnimationFrame(render);
};

window.onload = init_scene();

export const add_credits = (ammount) => {
	return (state.credits += ammount);
};

export const remove_credits = (ammount) => {
	if (state.credits === 0) {
		return (state.credits = 0);
	}
	return (state.credits -= ammount);
};

export const toogle_pause = () => {
	state.paused = !state.paused;
	if (!state.game_in_progress) {
		if (state.credits === 0) {
			toastr.error("I'm sorry, you don't have enough credits.");
			return 0;
		}
		state.game_in_progress = true;
		return state.credits--;
	}

	if (!state.paused) {
		render();
		scene.onSimulationResume();
	}

	return {
		paused: state.paused,
		game_in_progress: state.game_in_progress
	};
};
