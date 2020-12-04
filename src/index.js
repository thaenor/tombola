import { OrbitControls } from '../assets/threejs/jsm/controls/OrbitControls.js';
import { generate_light } from './Components/light.js';
import { generate_floor } from './Components/floor.js';
import {
	generate_ground_material,
	generate_wood_material,
	non_physics_wooden_sphere_material
} from './Components/materials.js';
import {
	generate_random_balls,
	add_spheres_to_scene
} from './Components/sphere.js';

const state = {
	credits: 1,
	paused: true,
	bet: {
		placed_bet: null,
		expected: []
	},
	direction: 1,
	balls: [],
	ground_material: {},
	box_material: {}
};
let floor;
const clock = new THREE.Clock();

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

	requestAnimationFrame(render);
};

const render = function (time) {
	if (!state.paused) {
		// floor.rotation.x += 0.003 * state.direction;
		// floor.rotation.y += 0.003 * state.direction;
		// if (floor.rotation.x < -0.4) state.direction = 1;
		// if (floor.rotation.x > 0.4) state.direction = -1;
		// floor.__dirtyRotation = true;
	}

	TWEEN.update(time);
	renderer.render(scene, camera);
	render_stats.update();
	controls.update();
	requestAnimationFrame(render);
	scene.simulate(clock.getDelta(), 1);
};

export const toogle_pause_state = () => {
	state.paused = !state.paused;
	if (!state.paused) {
		render();
		scene.onSimulationResume();
	}
	return state.paused;
};

const place_bet = (bet_value, expected_numbers) => {
	if (state.credits - bet_value < 0) {
		throw new Error("You don't have enough credits to place this bet");
	}

	if (expected_numbers.length < 1) {
		throw new Error('You need to bet on at least one number');
	}

	state.credits = state.credits - bet_value;
	state.bet.placed_bet = bet_value;
	state.bet.expected = expected_numbers;
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

export function bet_phase(bet_value, expected_numbers) {
	try {
		if (state.bet.placed_bet) {
			// this means the game is in-progress we'll just toggle pause
			toogle_pause_state();
		} else {
			// player is making a bet
			if (state.credits <= 0) {
				throw new Error("I'm sorry, you don't have enough credits.");
			}
			if (bet_value <= 0) {
				throw new Error('You need to place a bet first');
			}
			place_bet(bet_value, expected_numbers);
			toogle_pause_state();
		}

		return {
			credits: state.credits,
			paused: state.paused,
			bet: state.bet
		};
	} catch (error) {
		toastr.error(error);
		console.error(error);
	}
}

export const draw_balls = () => {
	let total_draws = state.bet.expected.length;

	const mesh = state.balls[0];
	const new_material = non_physics_wooden_sphere_material();
	const new_mesh = new THREE.Mesh(mesh.geometry, new_material);
	new_mesh.position.set(mesh.position);
	scene.remove(mesh);
	scene.add(new_mesh);

	const tween1 = new TWEEN.Tween(mesh.position).to(
		new THREE.Vector3(0, 50, 50),
		5000
	);
	//mesh.position.set(new THREE.Vector3(0, 90, 90));
	tween1.start();

	// for (let i = 0; i < total_draws; i++) {
	// 	let draw = Math.floor(Math.random() * Math.floor(total_balls));
	// 	const mesh = state.balls[draw];
	// 	const pos = mesh.position;
	// 	const tween1 = new TWEEN.Tween(mesh.position).to(
	// 		new THREE.Vector3(pos, 90, pos),
	// 		5000
	// 	);
	// 	//mesh.position.set(new THREE.Vector3(0, 90, 90));
	// 	tween1.start();
	// }
};
