// The three scenes. Each scene draws itself twice: variant 0 is the left
// panel, variant 1 is the right panel. The two variants differ ONLY at the
// spots listed in `differences`, so every difference is fair and findable.
// Coordinates are in the 560 x 400 scene space; each difference has a
// circular hit zone (x, y, r) and a short name shown when it is found.

import { SCENE_HEIGHT, SCENE_WIDTH } from './config.js';
import { circle, cloud, ellipse, label, line, pineTree, polyline, rect, roundRect, star, triangle } from './draw.js';

function skyGradient(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, SCENE_HEIGHT);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);
}

function sunWithRays(ctx, x, y, rays) {
  ctx.strokeStyle = '#f5b301';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  for (let i = 0; i < rays; i += 1) {
    const a = (i * Math.PI * 2) / rays;
    line(ctx, x + Math.cos(a) * 30, y + Math.sin(a) * 30, x + Math.cos(a) * 44, y + Math.sin(a) * 44, '#f5b301', 4);
  }
  circle(ctx, x, y, 26, '#ffd43b');
  circle(ctx, x - 8, y - 5, 4, '#e8590c');
  circle(ctx, x + 8, y - 5, 4, '#e8590c');
  ctx.beginPath();
  ctx.arc(x, y + 4, 10, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.strokeStyle = '#e8590c';
  ctx.lineWidth = 3;
  ctx.stroke();
}

function drawSeasideCottage(ctx, variant) {
  skyGradient(ctx, '#7ec8f7', '#d6f0ff');
  sunWithRays(ctx, 70, 62, variant === 1 ? 5 : 8);
  cloud(ctx, 140, 58, 0.9, '#ffffff');
  if (variant === 0) cloud(ctx, 292, 66, 1, '#ffffff');
  cloud(ctx, 452, 48, 0.8, '#ffffff');
  // birds
  ctx.strokeStyle = '#33475b';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(196, 108, 9, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(214, 108, 9, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(248, 92, 8, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(264, 92, 8, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();

  // sea
  rect(ctx, 0, 232, SCENE_WIDTH, 70, '#2b8fd9');
  ctx.strokeStyle = '#bfe6ff';
  ctx.lineWidth = 3;
  for (const [wx, wy] of [[60, 252], [180, 268], [300, 250], [500, 272], [120, 286], [360, 286]]) {
    ctx.beginPath();
    ctx.moveTo(wx, wy);
    ctx.quadraticCurveTo(wx + 12, wy - 7, wx + 26, wy);
    ctx.stroke();
  }
  // boat
  triangle(ctx, 428, 246, 428, 208, 462, 246, variant === 1 ? '#ffd43b' : '#e03131');
  line(ctx, 428, 206, 428, 248, '#5c3d1e', 4);
  ctx.beginPath();
  ctx.moveTo(398, 248);
  ctx.lineTo(472, 248);
  ctx.lineTo(460, 266);
  ctx.lineTo(410, 266);
  ctx.closePath();
  ctx.fillStyle = '#8b5a2b';
  ctx.fill();

  // sand
  rect(ctx, 0, 302, SCENE_WIDTH, 98, '#f2d492');
  ellipse(ctx, 60, 352, 26, 7, '#e3c07e');
  ellipse(ctx, 300, 372, 30, 8, '#e3c07e');
  ellipse(ctx, 520, 360, 22, 6, '#e3c07e');
  // starfish (missing on the right panel)
  if (variant === 0) star(ctx, 382, 352, 5, 14, 6, '#ff8c42');
  // bucket (blue on the left, red on the right)
  ctx.beginPath();
  ctx.moveTo(104, 326);
  ctx.lineTo(132, 326);
  ctx.lineTo(128, 358);
  ctx.lineTo(108, 358);
  ctx.closePath();
  ctx.fillStyle = variant === 1 ? '#e03131' : '#1971c2';
  ctx.fill();
  rect(ctx, 102, 322, 32, 6, '#5c3d1e');

  // cottage
  rect(ctx, 150, 196, 118, 96, '#fff4d6');
  triangle(ctx, 144, 198, 209, 148, 274, 198, '#c92a2a');
  rect(ctx, 238, 158, 16, 34, '#a67c52');
  ellipse(ctx, 246, 150, 10, 6, '#e9ecef');
  ellipse(ctx, 252, 140, 8, 5, '#e9ecef');
  roundRect(ctx, 196, 232, 26, 60, 4, '#7c4a21');
  circle(ctx, 216, 264, 3, '#ffd43b');
  // windows
  rect(ctx, 160, 214, 26, 26, '#a5d8ff');
  rect(ctx, 232, 214, 26, 26, '#a5d8ff');
  line(ctx, 173, 214, 173, 240, '#7c4a21', 2);
  line(ctx, 160, 227, 186, 227, '#7c4a21', 2);
  line(ctx, 245, 214, 245, 240, '#7c4a21', 2);
  line(ctx, 232, 227, 258, 227, '#7c4a21', 2);
  // flower box under the left window (missing on the right panel)
  if (variant === 0) {
    roundRect(ctx, 158, 242, 30, 10, 3, '#8b5a2b');
    circle(ctx, 164, 240, 4, '#ff6b9d');
    circle(ctx, 173, 238, 4, '#ffd43b');
    circle(ctx, 182, 240, 4, '#ff6b9d');
  }
  // fence
  for (let i = 0; i < 5; i += 1) rect(ctx, 286 + i * 14, 268, 8, 26, '#c9a06c');
  rect(ctx, 284, 272, 72, 4, '#a67c52');

  // palm tree
  ctx.strokeStyle = '#8b5a2b';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(506, 302);
  ctx.quadraticCurveTo(498, 240, 488, 178);
  ctx.stroke();
  ctx.strokeStyle = '#2f9e44';
  ctx.lineWidth = 7;
  for (const [dx, dy] of [[-38, -18], [-18, -34], [6, -38], [34, -26], [44, -2], [-44, 4]]) {
    ctx.beginPath();
    ctx.moveTo(488, 178);
    ctx.quadraticCurveTo(488 + dx / 2, 178 + dy - 8, 488 + dx, 178 + dy);
    ctx.stroke();
  }
  circle(ctx, 482, 184, 7, '#6b4423');
  circle(ctx, 494, 186, 7, '#6b4423');
  if (variant === 0) circle(ctx, 488, 194, 7, '#6b4423');
}

function drawForestCamp(ctx, variant) {
  skyGradient(ctx, '#0f2b3d', '#1d4e5f');
  // stars
  const stars = [[40, 40], [110, 80], [180, 30], [230, 66], [330, 36], [390, 78], [520, 120], [70, 120], [360, 110]];
  for (const [sx, sy] of stars) star(ctx, sx, sy, 4, 5, 2, '#fff3bf');
  if (variant === 0) star(ctx, 150, 48, 4, 6, 2.5, '#fff3bf');
  // moon: crescent on the left, full on the right
  circle(ctx, 480, 60, 24, '#ffeeb0');
  if (variant === 0) circle(ctx, 490, 54, 20, '#0f2b3d');
  // pine trees
  pineTree(ctx, 40, 250, 1.1, '#5c3d1e', '#1f6b3a');
  pineTree(ctx, 95, 265, 0.9, '#5c3d1e', '#276b3f');
  pineTree(ctx, 520, 255, 1.05, '#5c3d1e', '#1f6b3a');
  pineTree(ctx, 470, 270, 0.85, '#5c3d1e', '#276b3f');
  pineTree(ctx, 150, 240, 0.8, '#5c3d1e', '#1f6b3a');
  // ground
  rect(ctx, 0, 300, SCENE_WIDTH, 100, '#2d4a2b');
  ellipse(ctx, 80, 350, 30, 8, '#264023');
  ellipse(ctx, 480, 365, 34, 8, '#264023');
  // owl on a branch
  line(ctx, 30, 190, 140, 182, '#5c3d1e', 7);
  ellipse(ctx, 92, 162, 20, 26, '#8b6f47');
  circle(ctx, 84, 154, 8, '#ffffff');
  circle(ctx, 100, 154, 8, '#ffffff');
  if (variant === 0) {
    circle(ctx, 84, 154, 4, '#1a1a1a');
    circle(ctx, 100, 154, 4, '#1a1a1a');
  } else {
    line(ctx, 78, 154, 90, 154, '#1a1a1a', 3);
    line(ctx, 94, 154, 106, 154, '#1a1a1a', 3);
  }
  triangle(ctx, 92, 162, 86, 170, 98, 170, '#e8590c');
  // tent
  triangle(ctx, 210, 302, 280, 168, 350, 302, '#e8590c');
  triangle(ctx, 280, 168, 280, 302, 350, 302, '#d9480f');
  triangle(ctx, 262, 302, 280, 248, 298, 302, '#3b2b1a');
  line(ctx, 280, 168, 280, 118, '#5c3d1e', 4);
  triangle(ctx, 280, 118, 280, 138, 306, 128, variant === 1 ? '#4dabf7' : '#ff922b');
  // campfire
  ellipse(ctx, 280, 306, 34, 10, '#6b4423');
  line(ctx, 258, 300, 302, 312, '#7c4a21', 8);
  line(ctx, 302, 300, 258, 312, '#7c4a21', 8);
  circle(ctx, 252, 310, 6, '#868e96');
  circle(ctx, 308, 310, 6, '#868e96');
  circle(ctx, 280, 318, 6, '#868e96');
  ellipse(ctx, 272, 288, 9, 16, '#ff922b');
  ellipse(ctx, 288, 290, 8, 13, '#ffd43b');
  if (variant === 0) ellipse(ctx, 280, 282, 7, 14, '#ff6b35');
  // lantern post
  line(ctx, 430, 300, 430, 196, '#5c3d1e', 6);
  line(ctx, 430, 196, 452, 196, '#5c3d1e', 5);
  roundRect(ctx, 440, 200, 22, 28, 5, '#343a40');
  if (variant === 0) {
    circle(ctx, 451, 214, 16, 'rgba(255, 212, 59, 0.35)');
    rect(ctx, 444, 206, 14, 16, '#ffd43b');
  } else {
    rect(ctx, 444, 206, 14, 16, '#495057');
  }
  // mushrooms
  circle(ctx, 112, 332, 5, '#f1f3f5');
  ellipse(ctx, 112, 326, 12, 7, '#e03131');
  circle(ctx, 130, 336, 4, '#f1f3f5');
  ellipse(ctx, 130, 330, 9, 6, '#e03131');
  if (variant === 0) {
    circle(ctx, 96, 338, 4, '#f1f3f5');
    ellipse(ctx, 96, 332, 9, 6, '#e03131');
  }
  // backpack
  roundRect(ctx, 366, 318, 34, 40, 10, '#1971c2');
  roundRect(ctx, 372, 330, 22, 16, 5, '#1864ab');
  line(ctx, 366, 326, 400, 326, '#0b7285', 4);
  if (variant === 0) roundRect(ctx, 370, 308, 26, 12, 6, '#2f9e44');
}

function drawSpaceStation(ctx, variant) {
  skyGradient(ctx, '#0b0620', '#241a4d');
  const stars = [[30, 60], [60, 180], [140, 30], [200, 120], [330, 40], [380, 140], [450, 40], [520, 200], [40, 280], [530, 300], [170, 150], [300, 90]];
  for (const [sx, sy] of stars) star(ctx, sx, sy, 4, 4, 1.8, '#e7f5ff');
  star(ctx, 250, 60, 4, 6, 2.5, '#fff3bf');
  // ringed planet (ring missing on the right panel)
  circle(ctx, 95, 85, 30, '#9775fa');
  circle(ctx, 86, 78, 8, '#845ef7');
  circle(ctx, 106, 94, 6, '#845ef7');
  if (variant === 0) {
    ctx.beginPath();
    ctx.ellipse(95, 85, 48, 12, -0.4, 0, Math.PI * 2);
    ctx.strokeStyle = '#d0bfff';
    ctx.lineWidth = 5;
    ctx.stroke();
  }
  // satellite (missing on the right panel)
  if (variant === 0) {
    rect(ctx, 488, 62, 24, 14, '#ced4da');
    rect(ctx, 468, 66, 18, 6, '#4dabf7');
    rect(ctx, 514, 66, 18, 6, '#4dabf7');
    line(ctx, 500, 62, 506, 50, '#ced4da', 3);
    circle(ctx, 507, 48, 3, '#ff6b6b');
  }
  // ground
  rect(ctx, 0, 330, SCENE_WIDTH, 70, '#495057');
  ellipse(ctx, 90, 360, 26, 7, '#3d4349');
  ellipse(ctx, 300, 380, 34, 8, '#3d4349');
  ellipse(ctx, 500, 365, 24, 6, '#3d4349');
  // station: main module
  roundRect(ctx, 220, 170, 120, 74, 18, '#e9ecef');
  roundRect(ctx, 228, 178, 104, 58, 12, '#dee2e6');
  // windows: three lit on the left, two on the right
  circle(ctx, 252, 206, 9, '#ffd43b');
  circle(ctx, 280, 206, 9, '#ffd43b');
  circle(ctx, 308, 206, 9, variant === 1 ? '#495057' : '#ffd43b');
  // side modules
  roundRect(ctx, 160, 190, 56, 40, 12, '#adb5bd');
  roundRect(ctx, 344, 190, 56, 40, 12, '#adb5bd');
  line(ctx, 216, 210, 220, 210, '#868e96', 6);
  line(ctx, 340, 210, 344, 210, '#868e96', 6);
  // solar panels: left array 2, right array 3 on the left panel, 2 on the right
  rect(ctx, 96, 182, 56, 34, '#1971c2');
  line(ctx, 124, 182, 124, 216, '#e9ecef', 3);
  rect(ctx, 408, 182, 56, 34, '#1971c2');
  line(ctx, 436, 182, 436, 216, '#e9ecef', 3);
  if (variant === 0) {
    rect(ctx, 468, 182, 28, 34, '#1971c2');
    line(ctx, 466, 199, 496, 199, '#e9ecef', 3);
  }
  line(ctx, 152, 199, 160, 199, '#868e96', 5);
  line(ctx, 400, 199, 408, 199, '#868e96', 5);
  // antenna dish: points up-left on the left panel, up-right on the right
  line(ctx, 280, 170, 280, 138, '#868e96', 5);
  ctx.beginPath();
  if (variant === 0) ctx.arc(268, 128, 16, Math.PI * 0.9, Math.PI * 1.9);
  else ctx.arc(292, 128, 16, Math.PI * 1.1, Math.PI * 0.1);
  ctx.strokeStyle = '#ced4da';
  ctx.lineWidth = 6;
  ctx.stroke();
  circle(ctx, 280, 136, 4, '#ff6b6b');
  // astronaut
  circle(ctx, 200, 252, 16, '#f1f3f5');
  circle(ctx, 200, 252, 11, variant === 1 ? '#fab005' : '#4dabf7');
  roundRect(ctx, 188, 268, 24, 30, 9, '#f1f3f5');
  rect(ctx, 184, 272, 6, 20, '#f1f3f5');
  rect(ctx, 210, 272, 6, 20, '#f1f3f5');
  rect(ctx, 190, 298, 8, 16, '#f1f3f5');
  rect(ctx, 202, 298, 8, 16, '#f1f3f5');
  line(ctx, 216, 280, 236, 268, '#ced4da', 3);
  // rover: 4 wheels on the left panel, 3 on the right
  roundRect(ctx, 108, 330, 66, 20, 6, '#ff922b');
  rect(ctx, 128, 318, 26, 14, '#e9ecef');
  circle(ctx, 120, 352, 8, '#212529');
  circle(ctx, 140, 352, 8, '#212529');
  circle(ctx, 160, 352, 8, '#212529');
  if (variant === 0) circle(ctx, 172, 346, 8, '#212529');
  // flag: red on the left panel, green on the right
  line(ctx, 352, 330, 352, 288, '#ced4da', 4);
  triangle(ctx, 352, 288, 352, 306, 378, 297, variant === 1 ? '#2f9e44' : '#e03131');
  // crates: 3 on the left panel, 2 on the right
  rect(ctx, 452, 336, 22, 22, '#c9a06c');
  rect(ctx, 476, 336, 22, 22, '#a67c52');
  if (variant === 0) rect(ctx, 464, 314, 22, 22, '#c9a06c');
  line(ctx, 452, 347, 474, 347, '#8b6f47', 2);
  line(ctx, 476, 347, 498, 347, '#8b6f47', 2);
}

export const SCENES = [
  {
    id: 'seaside',
    name: 'Seaside Cottage',
    tagline: 'A sunny day at the beach house.',
    draw: drawSeasideCottage,
    differences: [
      { x: 70, y: 62, r: 34, what: 'the sun lost some rays' },
      { x: 300, y: 68, r: 36, what: 'a cloud drifted away' },
      { x: 445, y: 232, r: 30, what: 'the sail changed colour' },
      { x: 173, y: 240, r: 24, what: 'the flower box vanished' },
      { x: 488, y: 188, r: 24, what: 'a coconut fell off the palm' },
      { x: 118, y: 342, r: 24, what: 'the bucket changed colour' },
      { x: 382, y: 352, r: 24, what: 'the starfish is gone' },
    ],
  },
  {
    id: 'forest',
    name: 'Forest Camp',
    tagline: 'A quiet night under the pines.',
    draw: drawForestCamp,
    differences: [
      { x: 480, y: 60, r: 28, what: 'the moon changed phase' },
      { x: 150, y: 48, r: 22, what: 'a star went out' },
      { x: 292, y: 128, r: 22, what: 'the tent flag changed colour' },
      { x: 280, y: 288, r: 30, what: 'a flame went out' },
      { x: 451, y: 214, r: 26, what: 'the lantern went dark' },
      { x: 112, y: 332, r: 26, what: 'a mushroom is missing' },
      { x: 92, y: 160, r: 26, what: 'the owl fell asleep' },
      { x: 383, y: 322, r: 28, what: 'the bedroll is gone' },
    ],
  },
  {
    id: 'space',
    name: 'Space Station',
    tagline: 'A busy day in orbit.',
    draw: drawSpaceStation,
    differences: [
      { x: 95, y: 85, r: 36, what: 'the planet lost its ring' },
      { x: 280, y: 128, r: 26, what: 'the antenna turned around' },
      { x: 482, y: 199, r: 22, what: 'a solar panel is missing' },
      { x: 200, y: 252, r: 26, what: 'the visor changed colour' },
      { x: 364, y: 297, r: 24, what: 'the flag changed colour' },
      { x: 475, y: 330, r: 28, what: 'a crate is missing' },
      { x: 146, y: 350, r: 28, what: 'the rover lost a wheel' },
      { x: 280, y: 206, r: 28, what: 'a station light went out' },
      { x: 500, y: 68, r: 26, what: 'the satellite flew away' },
    ],
  },
];
