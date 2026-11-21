// Rendering: draws both panels, the found markers, the hint pulse and the
// miss flashes. Each panel's scene is painted once per round onto an
// offscreen canvas, then blitted every frame with the live markers on top,
// so the animation loop stays cheap.

import { HINT_COLOR, MARKER_CHECK_COLOR, MARKER_RING_COLOR, MISS_COLOR, SCENE_HEIGHT, SCENE_WIDTH } from './config.js';

export class PanelRenderer {
  constructor(leftCanvas, rightCanvas) {
    this.left = leftCanvas;
    this.right = rightCanvas;
    this.leftCtx = leftCanvas.getContext('2d');
    this.rightCtx = rightCanvas.getContext('2d');
    this.leftCache = document.createElement('canvas');
    this.rightCache = document.createElement('canvas');
    for (const c of [this.leftCache, this.rightCache]) {
      c.width = SCENE_WIDTH;
      c.height = SCENE_HEIGHT;
    }
    this.scene = null;
  }

  loadScene(scene) {
    this.scene = scene;
    scene.draw(this.leftCache.getContext('2d'), 0);
    scene.draw(this.rightCache.getContext('2d'), 1);
  }

  draw(state, now) {
    for (const [ctx, cache] of [[this.leftCtx, this.leftCache], [this.rightCtx, this.rightCache]]) {
      ctx.clearRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);
      ctx.drawImage(cache, 0, 0);
      this.drawFoundMarkers(ctx, state, now);
      this.drawHint(ctx, state, now);
      this.drawMisses(ctx, state, now);
    }
  }

  drawFoundMarkers(ctx, state, now) {
    for (const found of state.found) {
      const d = state.scene.differences[found.index];
      const age = now - found.at;
      const pop = age < 240 ? 1 + 0.35 * (1 - age / 240) : 1;
      const r = d.r * pop + 6;
      ctx.beginPath();
      ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
      ctx.strokeStyle = MARKER_RING_COLOR;
      ctx.lineWidth = 4;
      ctx.shadowColor = MARKER_RING_COLOR;
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;
      // small check badge at the ring's top edge
      ctx.beginPath();
      ctx.arc(d.x + d.r * 0.7, d.y - d.r * 0.7, 10, 0, Math.PI * 2);
      ctx.fillStyle = MARKER_CHECK_COLOR;
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(d.x + d.r * 0.7 - 5, d.y - d.r * 0.7);
      ctx.lineTo(d.x + d.r * 0.7 - 1, d.y - d.r * 0.7 + 4);
      ctx.lineTo(d.x + d.r * 0.7 + 5, d.y - d.r * 0.7 - 4);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
  }

  drawHint(ctx, state, now) {
    if (!state.hint || now > state.hint.until) return;
    const d = state.scene.differences[state.hint.index];
    const pulse = 1 + 0.12 * Math.sin(now / 130);
    ctx.beginPath();
    ctx.arc(d.x, d.y, (d.r + 8) * pulse, 0, Math.PI * 2);
    ctx.strokeStyle = HINT_COLOR;
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 8]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawMisses(ctx, state, now) {
    for (const miss of state.misses) {
      const age = now - miss.at;
      if (age > 700) continue;
      const alpha = 1 - age / 700;
      const size = 10 + age / 60;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(miss.x - size, miss.y - size);
      ctx.lineTo(miss.x + size, miss.y + size);
      ctx.moveTo(miss.x + size, miss.y - size);
      ctx.lineTo(miss.x - size, miss.y + size);
      ctx.strokeStyle = MISS_COLOR;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }
}

// Convert a pointer event on a canvas into scene coordinates, honouring
// the canvas's on-screen scale.
export function eventToScene(canvas, event) {
  const box = canvas.getBoundingClientRect();
  const x = ((event.clientX - box.left) / box.width) * SCENE_WIDTH;
  const y = ((event.clientY - box.top) / box.height) * SCENE_HEIGHT;
  return { x, y };
}
