// Input: pointer clicks on either panel and the keyboard shortcuts.
// Hit-testing is a circle test against the round's unfound differences.

import { eventToScene } from './render.js';

export function findDifferenceAt(scene, foundIndexes, x, y) {
  for (let i = 0; i < scene.differences.length; i += 1) {
    if (foundIndexes.has(i)) continue;
    const d = scene.differences[i];
    const dx = x - d.x;
    const dy = y - d.y;
    if (dx * dx + dy * dy <= d.r * d.r) return i;
  }
  return -1;
}

export function bindPanelClicks(leftCanvas, rightCanvas, onSpot) {
  const handler = (event) => {
    event.preventDefault();
    const point = eventToScene(event.currentTarget, event);
    onSpot(point.x, point.y);
  };
  leftCanvas.addEventListener('pointerdown', handler);
  rightCanvas.addEventListener('pointerdown', handler);
}

export function bindKeys(actions) {
  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const key = event.key.toLowerCase();
    if (key === 'h' && actions.hint) actions.hint();
    else if (key === 'r' && actions.restart) actions.restart();
    else if ((key === 'enter' || key === ' ') && actions.confirm) {
      event.preventDefault();
      actions.confirm();
    } else if (key === 'm' && actions.mute) actions.mute();
  });
}
