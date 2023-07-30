
export function lightness(k: number) {
  return 'rgba(255,255,255,' + k + ')';
}

export function overlayGradient(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, lightness(0));
  gradient.addColorStop(0.5, lightness(0.7));
  gradient.addColorStop(1, lightness(0));

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}
