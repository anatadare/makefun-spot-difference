// The game state machine: title, playing, round clear, win and time up.
// It owns the timer, the score, the hints and the round flow, and keeps the
// HUD and the overlays in sync with the state.

import {
  HINTS_PER_ROUND,
  HINT_SHOW_MS,
  LOW_TIME_SECONDS,
  POINTS_PER_FIND,
  POINTS_PER_SECOND_LEFT,
  POINTS_WRONG_CLICK,
  ROUND_TIME_SECONDS,
  TICK_SECONDS,
  TIME_PENALTY_WRONG_CLICK,
} from './config.js';
import { SCENES } from './scenes.js';
import { findDifferenceAt } from './input.js';

export class Game {
  constructor(elements, renderer, sounds) {
    this.el = elements;
    this.renderer = renderer;
    this.sounds = sounds;
    this.phase = 'title';
    this.roundIndex = 0;
    this.scene = SCENES[0];
    this.found = [];
    this.foundSet = new Set();
    this.misses = [];
    this.hint = null;
    this.hintsLeft = HINTS_PER_ROUND;
    this.score = 0;
    this.timeLeftMs = ROUND_TIME_SECONDS * 1000;
    this.lastTick = 0;
    this.lastTickSecond = -1;
    this.roundBonus = 0;
  }

  get state() {
    return { scene: this.scene, found: this.found, misses: this.misses, hint: this.hint };
  }

  get totalDifferences() {
    return this.scene.differences.length;
  }

  startGame() {
    this.score = 0;
    this.roundIndex = 0;
    this.startRound(0);
  }

  startRound(index) {
    this.roundIndex = index;
    this.scene = SCENES[index];
    this.found = [];
    this.foundSet = new Set();
    this.misses = [];
    this.hint = null;
    this.hintsLeft = HINTS_PER_ROUND;
    this.timeLeftMs = ROUND_TIME_SECONDS * 1000;
    this.lastTickSecond = -1;
    this.phase = 'playing';
    this.renderer.loadScene(this.scene);
    this.hideOverlays();
    this.setMessage(`Round ${index + 1}: ${this.scene.name}. ${this.scene.tagline}`);
    this.updateHud();
  }

  restartRound() {
    if (this.phase !== 'playing' && this.phase !== 'timeUp') return;
    this.sounds.click();
    this.startRound(this.roundIndex);
  }

  onSpot(x, y) {
    if (this.phase !== 'playing') return;
    this.sounds.ensure();
    const index = findDifferenceAt(this.scene, this.foundSet, x, y);
    if (index >= 0) {
      this.foundSet.add(index);
      this.found.push({ index, at: performance.now() });
      this.score += POINTS_PER_FIND;
      this.sounds.found();
      const d = this.scene.differences[index];
      const left = this.totalDifferences - this.found.length;
      this.setMessage(
        left === 0 ? `Found it: ${d.what}! Round complete!` : `Found it: ${d.what}! ${left} to go.`,
      );
      if (this.found.length === this.totalDifferences) this.completeRound();
    } else {
      this.misses.push({ x, y, at: performance.now() });
      this.score = Math.max(0, this.score + POINTS_WRONG_CLICK);
      this.timeLeftMs = Math.max(0, this.timeLeftMs - TIME_PENALTY_WRONG_CLICK * 1000);
      this.sounds.miss();
      this.setMessage(`Nothing there. Minus ${TIME_PENALTY_WRONG_CLICK} seconds, watch the clock!`);
    }
    this.updateHud();
  }

  useHint() {
    if (this.phase !== 'playing') return;
    if (this.hintsLeft <= 0) {
      this.setMessage('No hints left this round. Trust your eyes!');
      return;
    }
    const remaining = this.scene.differences.map((_, i) => i).filter((i) => !this.foundSet.has(i));
    if (remaining.length === 0) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    this.hintsLeft -= 1;
    this.hint = { index: pick, until: performance.now() + HINT_SHOW_MS };
    this.sounds.hint();
    this.setMessage(`Hint: look inside the blue ring. ${this.hintsLeft} hint${this.hintsLeft === 1 ? '' : 's'} left.`);
    this.updateHud();
  }

  toggleMute() {
    this.sounds.muted = !this.sounds.muted;
    this.el.muteBtn.textContent = this.sounds.muted ? 'Sound off' : 'Sound on';
    if (!this.sounds.muted) this.sounds.click();
  }

  confirm() {
    if (this.phase === 'title') this.startGame();
    else if (this.phase === 'roundClear') this.nextRound();
    else if (this.phase === 'gameWin' || this.phase === 'timeUp') this.startGame();
  }

  nextRound() {
    if (this.roundIndex + 1 < SCENES.length) this.startRound(this.roundIndex + 1);
    else this.winGame();
  }

  completeRound() {
    const secondsLeft = Math.ceil(this.timeLeftMs / 1000);
    this.roundBonus = secondsLeft * POINTS_PER_SECOND_LEFT;
    this.score += this.roundBonus;
    this.phase = 'roundClear';
    this.sounds.roundClear();
    this.el.roundClearTitle.textContent = `Round ${this.roundIndex + 1} complete!`;
    this.el.roundClearDetail.textContent =
      `${this.scene.name}: all ${this.totalDifferences} differences found with ${secondsLeft}s to spare. ` +
      `Time bonus +${this.roundBonus}.`;
    this.el.nextBtn.textContent = this.roundIndex + 1 < SCENES.length ? 'Next round' : 'See results';
    this.showOverlay('round');
    this.updateHud();
  }

  winGame() {
    this.phase = 'gameWin';
    this.sounds.gameWin();
    this.el.winTotal.textContent = `${this.score} points`;
    this.el.winDetail.textContent =
      `All ${SCENES.length} scenes cleared: ${SCENES.reduce((n, s) => n + s.differences.length, 0)} differences found. ` +
      `A sharp eye indeed.`;
    this.showOverlay('win');
    this.updateHud();
  }

  timeUp() {
    this.phase = 'timeUp';
    this.sounds.timeUp();
    this.el.timeUpDetail.textContent =
      `Time ran out on ${this.scene.name} with ${this.found.length} of ${this.totalDifferences} differences found. ` +
      `Your score of ${this.score} stands if you retry this round.`;
    this.showOverlay('timeup');
    this.updateHud();
  }

  tick(now) {
    if (this.phase !== 'playing') {
      this.lastTick = now;
      return;
    }
    const delta = this.lastTick ? now - this.lastTick : 0;
    this.lastTick = now;
    this.timeLeftMs = Math.max(0, this.timeLeftMs - delta);
    const seconds = Math.ceil(this.timeLeftMs / 1000);
    if (seconds <= TICK_SECONDS && seconds !== this.lastTickSecond && seconds > 0) {
      this.lastTickSecond = seconds;
      this.sounds.tick();
    }
    this.misses = this.misses.filter((m) => now - m.at <= 700);
    if (this.hint && now > this.hint.until) this.hint = null;
    this.updateTimeHud();
    if (this.timeLeftMs <= 0) this.timeUp();
  }

  // Puts the game into an exact mid-game state (used by shots.js to stage
  // the screenshots): a real state a player could reach by playing.
  stage(roundIndex, foundIndexes, secondsLeft, score, hintsLeft) {
    this.score = score;
    this.startRound(roundIndex);
    this.timeLeftMs = secondsLeft * 1000;
    this.hintsLeft = hintsLeft;
    const now = performance.now();
    for (const index of foundIndexes) {
      this.foundSet.add(index);
      this.found.push({ index, at: now - 1000 });
    }
    const left = this.totalDifferences - this.found.length;
    this.setMessage(`Found ${this.found.length} of ${this.totalDifferences}. ${left} still hiding.`);
    this.updateHud();
  }

  stageWin(totalScore) {
    // Behind the win card, show the last round fully found, as a player
    // who just won would see it.
    this.startRound(SCENES.length - 1);
    const now = performance.now();
    for (let i = 0; i < this.totalDifferences; i += 1) {
      this.foundSet.add(i);
      this.found.push({ index: i, at: now - 1000 });
    }
    this.timeLeftMs = 47 * 1000;
    this.score = totalScore;
    this.winGame();
  }

  setMessage(text) {
    this.el.message.textContent = text;
  }

  showOverlay(name) {
    this.hideOverlays();
    this.el[`overlay${name[0].toUpperCase()}${name.slice(1)}`].classList.remove('hidden');
  }

  hideOverlays() {
    for (const key of ['overlayTitle', 'overlayRound', 'overlayWin', 'overlayTimeup']) {
      this.el[key].classList.add('hidden');
    }
  }

  updateHud() {
    this.el.roundName.textContent = this.scene.name;
    this.el.roundCount.textContent = `Round ${this.roundIndex + 1} of ${SCENES.length}`;
    this.el.score.textContent = String(this.score);
    this.el.hints.textContent = String(this.hintsLeft);
    this.el.hintBtn.disabled = this.hintsLeft <= 0 || this.phase !== 'playing';
    const foundCount = this.found.length;
    const total = this.totalDifferences;
    this.el.foundText.textContent = `Found ${foundCount} of ${total} · ${total - foundCount} left`;
    this.el.foundDots.innerHTML = '';
    for (let i = 0; i < total; i += 1) {
      const dot = document.createElement('span');
      dot.className = `dot${i < foundCount ? ' done' : ''}`;
      this.el.foundDots.appendChild(dot);
    }
    this.updateTimeHud();
  }

  updateTimeHud() {
    const seconds = Math.ceil(this.timeLeftMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    this.el.time.textContent = `${minutes}:${String(rest).padStart(2, '0')}`;
    const fraction = this.timeLeftMs / (ROUND_TIME_SECONDS * 1000);
    this.el.timeBar.style.width = `${Math.max(0, fraction * 100)}%`;
    this.el.timeBar.classList.toggle('low', seconds <= LOW_TIME_SECONDS);
    this.el.timeWrap.classList.toggle('low', seconds <= LOW_TIME_SECONDS);
  }
}
