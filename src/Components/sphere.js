import { wooden_sphere_material } from './materials.js';
import { render_font } from './font.js';

function get_random_pos(min, max) {
	// min and max included
	let x = Math.random() * (max - min + 1) + min;
	x = Math.round(x * 1000) / 1000;
	// let y = Math.random() * (max - min + 1) + min;
	// y = Math.round(y * 1000) / 1000;
	let z = Math.random() * (max - min + 1) + min;
	z = Math.round(z * 1000) / 1000;

	return [x, 10, z];
}

const render_ball = (font, number) => {
	const font_mesh = render_font(font, number);
	const ball_mesh = new Physijs.SphereMesh(
		new THREE.SphereGeometry(2, 32, 32),
		wooden_sphere_material(),
		1
	);
	const pos = get_random_pos(-10, 30);

	ball_mesh.position.set(pos[0], pos[1], pos[2]);
	font_mesh.position.set(-0.5, -0.5, -0.5);
	ball_mesh.add(font_mesh);

	return ball_mesh;
};

export const generate_random_balls = (font) => {
	let ball_arr = [];
	for (let i = 0; i < total_balls; i++) {
		let ball_mesh = render_ball(font, i);
		ball_arr.push(ball_mesh);
	}
	return ball_arr;
};

export const add_spheres_to_scene = (balls) => {
	let count = 0;
	let timer = setInterval(() => {
		count++;
		if (count < balls.length) {
			scene.add(balls[count]);
		} else {
			clearInterval(timer);
		}
	}, 100);
};
