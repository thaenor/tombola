import { OrbitControls } from '../assets/threejs/jsm/controls/OrbitControls.js';
import { generate_light } from './Components/light.js';
import { generate_floor } from './Components/floor.js';
import { reset_game } from './events.js';
import {
	render_ball,
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
let global_font;

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
		global_font = font;
		state.balls = generate_random_balls(font);
		add_spheres_to_scene(state.balls);
	});

	// const geometry = new THREE.BoxGeometry();
	// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	// const cube = new THREE.Mesh(geometry, material);
	// const pos = camera.clone().position;
	// cube.position.set(pos.x - 20, pos.y - 20, pos.z - 20);
	// scene.add(cube);

	scene.add(floor);
	scene.add(light_1);
	scene.add(light_2);

	requestAnimationFrame(render);
};

const render = function (time) {
	if (!state.paused) {
		floor.rotation.z += 0.002 * state.direction;
		if (floor.rotation.z < -0.4) state.direction = 1;
		if (floor.rotation.z > 0.4) state.direction = -1;

		floor.__dirtyRotation = true;
		requestAnimationFrame(render);
		scene.simulate(clock.getDelta(), 1);
	}

	TWEEN.update(time);
	renderer.render(scene, camera);
	render_stats.update();
	controls.update();
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
	let meshes = [];

	for (let i = 0; i < total_draws; i++) {
		let draw = Math.floor(Math.random() * Math.floor(total_balls));

		if (state.bet.expected.includes(draw)) {
			console.log('win');
			alert(`Congratulations!! you win on ${draw}`);
			state.credits++;
		} else {
			console.log('lose');
		}

		const mesh = state.balls[i].mesh;
		const camera_pos = camera.clone().position;
		const target = {
			x: camera_pos.x - 20 + 10 * i,
			y: camera_pos.y - 20,
			z: camera_pos.z - 20
		};
		const new_mesh = render_ball(
			global_font,
			`${state.balls[draw].number}`,
			false
		);
		meshes.push(new_mesh);
		new_mesh.position.set(mesh.position.x, mesh.position.y, mesh.position.z);
		scene.add(new_mesh);

		const tween = new TWEEN.Tween(new_mesh.position)
			.to(target, 2000)
			.onUpdate((pos) => {
				new_mesh.position.set(pos.x, pos.y, pos.z);
			})
			.onComplete((pos) => {
				new_mesh.updateMatrix();
				new_mesh.position.set(pos.x, pos.y, pos.z);
			});

		tween.start();

		setTimeout(() => {
			reset_game(state.credits);
			state.bet.expected = [];
			state.bet.placed_bet = null;
			meshes.map((e) => {
				scene.remove(e);
			});
			toogle_pause_state();
		}, 5000);
	}
};
