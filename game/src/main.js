// Bootstrap: wires the DOM, the renderer, the sounds and the game together,
// then runs the animation loop. Nothing here knows the scenes; it only
// connects the pieces.

import { Game } from './game.js';
import { PanelRenderer } from './render.js';
import { SoundBank } from './audio.js';
import { bindKeys, bindPanelClicks } from './input.js';
import { applyShotStaging } from './shots.js';

const $ = (id) => document.getElementById(id);

const elements = {
  roundName: $('round-name'),
  roundCount: $('round-count'),
  score: $('score-value'),
  time: $('time-value'),
  timeBar: $('time-bar-fill'),
  timeWrap: $('time-wrap'),
  foundText: $('found-text'),
  foundDots: $('found-dots'),
  hints: $('hints-value'),
  hintBtn: $('hint-btn'),
  message: $('message-line'),
  muteBtn: $('mute-btn'),
  roundClearTitle: $('round-clear-title'),
  roundClearDetail: $('round-clear-detail'),
  nextBtn: $('next-btn'),
  winTotal: $('win-total'),
  winDetail: $('win-detail'),
  timeUpDetail: $('timeup-detail'),
  overlayTitle: $('overlay-title'),
  overlayRound: $('overlay-round'),
  overlayWin: $('overlay-win'),
  overlayTimeup: $('overlay-timeup'),
};

const leftCanvas = $('panel-left');
const rightCanvas = $('panel-right');
const renderer = new PanelRenderer(leftCanvas, rightCanvas);
const sounds = new SoundBank();
const game = new Game(elements, renderer, sounds);

$('start-btn').addEventListener('click', () => {
  sounds.ensure();
  sounds.click();
  game.startGame();
});
$('next-btn').addEventListener('click', () => {
  sounds.click();
  game.nextRound();
});
$('retry-btn').addEventListener('click', () => game.restartRound());
$('play-again-btn').addEventListener('click', () => game.startGame());
$('restart-all-btn').addEventListener('click', () => game.startGame());
elements.hintBtn.addEventListener('click', () => game.useHint());
$('restart-btn').addEventListener('click', () => game.restartRound());
elements.muteBtn.addEventListener('click', () => game.toggleMute());

bindPanelClicks(leftCanvas, rightCanvas, (x, y) => game.onSpot(x, y));
bindKeys({
  hint: () => game.useHint(),
  restart: () => game.restartRound(),
  confirm: () => game.confirm(),
  mute: () => game.toggleMute(),
});

// The title screen shows the first scene behind it, so the game looks alive
// before the first click.
renderer.loadScene(game.scene);
game.updateHud();

const staged = applyShotStaging(game);
if (staged) renderer.loadScene(game.scene);

function frame(now) {
  game.tick(now);
  renderer.draw(game.state, now);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
