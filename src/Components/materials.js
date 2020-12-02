export const generate_ground_material = () => {
	let ground_material = Physijs.createMaterial(
		new THREE.MeshLambertMaterial({
			map: loader.load('/assets/images/wood_2.jpg')
		}),
		0.8, // friction
		0.4 // restitution (bouncyness)
	);
	ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
	ground_material.map.repeat.set(3, 3);
	return ground_material;
};

export const generate_wood_material = () => {
	box_material = Physijs.createMaterial(
		new THREE.MeshLambertMaterial({
			map: loader.load('../assets/images/plywood.jpg')
		}),
		0.4,
		0.6
	);
	box_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
	box_material.map.repeat.set(0.25, 0.25);
	return box_material;
};

export const font_material = () => {
	return Physijs.createMaterial(
		new THREE.MeshLambertMaterial({
			map: loader.load('../assets/images/wood.jpg')
		}),
		0.8,
		0.4
	);
};

export const sphere_material = () => {
	return Physijs.createMaterial(
		new THREE.MeshPhongMaterial({
			transparent: true,
			opacity: 0.8
		}),
		0.2,
		1
	);
};

export const wooden_sphere_material = () => {
	return Physijs.createMaterial(
		new THREE.MeshPhongMaterial({
			map: loader.load('../assets/images/plywood.jpg'),
			transparent: true,
			opacity: 0.7
		}),
		0.2,
		1
	);
};
