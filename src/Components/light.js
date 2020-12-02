export const generate_light = (x, y, z) => {
	const light = new THREE.DirectionalLight(0xffffff, 0.5);
	light.position.set(x, y, z);
	light.target.position.copy(scene.position);
	light.castShadow = true;
	light.shadow.camera.left = -60;
	light.shadow.camera.top = -60;
	light.shadow.camera.right = 60;
	light.shadow.camera.bottom = 60;
	light.shadow.camera.near = 20;
	light.shadow.camera.far = 200;
	light.shadow.bias = -0.0001;
	light.shadow.mapSize.width = light.shadow.mapSize.height = 2048;

	return light;
};
