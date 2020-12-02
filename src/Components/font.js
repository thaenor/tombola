import { font_material } from './materials.js';

export const render_font = (font, number) => {
	const textGeometry = new THREE.TextGeometry(`${number}`, {
		font: font,
		size: 1,
		height: 1,
		curveSegments: 10
	});

	const mesh = new THREE.Mesh(textGeometry, font_material());
	return mesh;
};
