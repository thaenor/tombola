import { add_credits, remove_credits, toogle_pause } from './index.js';

let play = document.getElementById('play_btn');
let credits_in = document.getElementById('credits_in');
let credits_out = document.getElementById('credits_out');
let credits = document.getElementById('credits');

window.addEventListener('resize', (evt) => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;

	camera.updateProjectionMatrix();
});

credits_in.addEventListener('click', (e) => {
	credits.innerHTML = add_credits(1);
});

credits_out.addEventListener('click', (evt) => {
	credits.innerHTML = remove_credits(1);
});

play.addEventListener('click', (e) => {
	const state = toogle_pause();

	if (state.paused) {
		play.innerHTML = 'Pause';
	} else {
		play.innerHTML = 'Play';
	}

	if (state.game_in_progress) {
		credits_in.style.display = 'none';
		credits_out.style.display = 'none';
	} else {
		credits_in.style.display = 'block';
		credits_out.style.display = 'block';
	}
});
