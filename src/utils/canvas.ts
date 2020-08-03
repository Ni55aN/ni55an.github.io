export class Canvas2D {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    const ctx = this.canvas.getContext('2d')
    if (!ctx) throw new Error('2d context')
    this.ctx = ctx
  }
}