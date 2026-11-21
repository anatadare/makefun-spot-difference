// Sound effects, synthesised with WebAudio: no audio files, no network.
// Every sound is a few oscillator notes. Audio starts only after the first
// user gesture, as browsers require.

export class SoundBank {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }

  tone(freq, start, length, type = 'sine', volume = 0.16) {
    const ctx = this.ensure();
    if (!ctx || this.muted) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    const t0 = ctx.currentTime + start;
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(volume, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + length);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + length + 0.05);
  }

  found() {
    this.tone(660, 0, 0.14, 'sine');
    this.tone(880, 0.09, 0.22, 'sine');
  }

  miss() {
    this.tone(160, 0, 0.16, 'square', 0.07);
  }

  hint() {
    this.tone(520, 0, 0.1, 'triangle');
    this.tone(780, 0.1, 0.14, 'triangle');
  }

  roundClear() {
    for (const [i, f] of [523, 659, 784, 1047].entries()) this.tone(f, i * 0.11, 0.24, 'triangle');
  }

  gameWin() {
    for (const [i, f] of [523, 659, 784, 1047, 784, 1047].entries()) this.tone(f, i * 0.13, 0.28, 'triangle');
  }

  timeUp() {
    this.tone(392, 0, 0.2, 'sawtooth', 0.06);
    this.tone(311, 0.18, 0.3, 'sawtooth', 0.06);
  }

  tick() {
    this.tone(980, 0, 0.06, 'sine', 0.08);
  }

  click() {
    this.tone(440, 0, 0.06, 'sine', 0.08);
  }
}
