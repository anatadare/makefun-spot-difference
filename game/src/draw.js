// Small canvas drawing helpers shared by every scene.
// Each helper draws one shape in the scene's own coordinates.

export function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
}

export function ellipse(ctx, x, y, rx, ry, fill, rotation = 0) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rotation, 0, Math.PI * 2);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
}

export function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

export function roundRect(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function triangle(ctx, x1, y1, x2, y2, x3, y3, fill) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

export function line(ctx, x1, y1, x2, y2, stroke, width = 2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.stroke();
}

export function polyline(ctx, points, stroke, width = 2) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
}

export function star(ctx, x, y, points, outer, inner, fill) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i += 1) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

export function cloud(ctx, x, y, scale, fill) {
  ctx.fillStyle = fill;
  circle(ctx, x, y, 18 * scale, fill);
  circle(ctx, x + 20 * scale, y - 6 * scale, 22 * scale, fill);
  circle(ctx, x + 44 * scale, y, 17 * scale, fill);
  ctx.fillRect(x - 16 * scale, y, 78 * scale, 16 * scale);
}

export function pineTree(ctx, x, y, scale, trunk, foliage) {
  rect(ctx, x - 4 * scale, y - 14 * scale, 8 * scale, 16 * scale, trunk);
  triangle(ctx, x, y - 66 * scale, x - 26 * scale, y - 12 * scale, x + 26 * scale, y - 12 * scale, foliage);
  triangle(ctx, x, y - 88 * scale, x - 20 * scale, y - 40 * scale, x + 20 * scale, y - 40 * scale, foliage);
  triangle(ctx, x, y - 106 * scale, x - 14 * scale, y - 64 * scale, x + 14 * scale, y - 64 * scale, foliage);
}

export function label(ctx, text, x, y, size, color, align = 'center') {
  ctx.font = `700 ${size}px "Trebuchet MS", Verdana, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}
