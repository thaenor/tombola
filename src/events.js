import { add_credits, remove_credits, toogle_pause } from './index.js';

let play = document.getElementById('play_btn');
let credits_in = document.getElementById('credits_in');
let credits_out = document.getElementById('credits_out');
let credits = document.getElementById('credits');

credits_in.addEventListener('click', (e) => {
	credits.innerHTML = add_credits(1);
});

credits_out.addEventListener('click', (evt) => {
	credits.innerHTML = remove_credits(1);
});

play.addEventListener('click', (e) => {
	const state = toogle_pause();

	if (state) {
		play.innerHTML = 'Pause';
	} else {
		play.innerHTML = 'Play';
	}
});
