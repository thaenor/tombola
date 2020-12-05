import {
	add_credits,
	remove_credits,
	bet_phase,
	toogle_pause_state,
	draw_balls
} from './index.js';

let play = $('#play_btn');
let bet_btn = $('#place_bet_btn');
let draw_btn = $('#draw_btn');
let bet_menu = $('#bet-menu');
let credits_in = document.getElementById('credits_in');
let credits_out = document.getElementById('credits_out');
let credits = document.getElementById('credits');
let bet_credits = document.getElementById('bet_credits');
let bet_on = document.getElementById('expected_numbers');

const validate_bet = (str) => {
	return str.split(' ').filter((n) => {
		n = Number(n);
		if (Number.isNaN(n) || n > total_balls) {
			return false;
		}
		return n;
	});
};

export const reset_game = (cred) => {
	play.html('play');
	play.hide();
	credits.innerHTML = cred;
	bet_on.innerHTML = '';
	bet_btn.show(300);
	draw_btn.hide(300);
	bet_menu.hide(300);
};

$('#toggle_menu').click(() => {
	$('#menu').toggle(500);
});

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

play.click((e) => {
	const state = toogle_pause_state();
	play.html(state ? 'Play' : 'Pause');
});

bet_btn.click((e) => {
	//const bet = Number(window.prompt('Place a bet', '1'));
	let bet = 1;
	if (!Number.isNaN(bet)) {
		let str_bet = window.prompt(
			'What numbers would you like to bet on? [1 - 50]',
			'1 2 4'
		);
		const expected_numbers = validate_bet(str_bet);
		const res = bet_phase(bet, expected_numbers);
		credits.innerHTML = res.credits;
		bet_credits.innerHTML = res.bet.placed_bet;
		bet_on.innerHTML = res.bet.expected;
		play.show(500);
		play.html(res.paused ? 'Play' : 'Pause');
		bet_btn.hide(500);
		draw_btn.show(600);
		bet_menu.show(700);
		setTimeout(() => {
			$('#toggle_menu').trigger('click');
			// setTimeout(() => {
			// 	draw_btn.trigger('click');
			// }, 5000);
		}, 2000);
	} else {
		toastr.error('You must input a number as a bet');
	}
});

draw_btn.click((e) => {
	let result = draw_balls();
});
