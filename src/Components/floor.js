import { generate_ground_material } from './materials.js';

export const generate_floor = () => {
	const ground = new Physijs.BoxMesh(
		new THREE.BoxGeometry(100, 1, 100),
		generate_ground_material(),
		0 // mass
	);

	let top = new Physijs.BoxMesh(
		new THREE.BoxGeometry(100, 1, 100),
		generate_ground_material(),
		0 // mass
	);

	let borderLeft = new Physijs.BoxMesh(
		new THREE.BoxGeometry(2, 26, 100),
		generate_ground_material(),
		0
	);
	let borderRight = new Physijs.BoxMesh(
		new THREE.BoxGeometry(2, 26, 100),
		generate_ground_material(),
		0
	);
	let borderTop = new Physijs.BoxMesh(
		new THREE.BoxGeometry(100, 26, 2),
		generate_ground_material(),
		0
	);
	let borderBottom = new Physijs.BoxMesh(
		new THREE.BoxGeometry(100, 26, 2),
		generate_ground_material(),
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
	top.position.y = 15;

	//TODO: make a toogle in case I dont want to see the sides
	// borderLeft.visible = false;
	// borderRight.visible = false;
	// borderTop.visible = false;
	// borderBottom.visible = false;
	top.visible = false;

	ground.attach(borderLeft);
	ground.attach(borderRight);
	ground.attach(borderTop);
	ground.attach(borderBottom);
	ground.attach(top);

	ground.receiveShadow = true;
	scene.add(ground);
	return ground;
};
