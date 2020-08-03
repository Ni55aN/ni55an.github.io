import points from './mask.json'
import { Canvas2D } from '../../utils/canvas';

const PICK_RADIUS = 5;
const PEN_WIDTH = 35;

export class MaskPainter {
  points: [number, number][]
  pickedPoint: any = null;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  lastIndex = 0;
  lastTime = 0;

  constructor(private duration: any, private DURATION: number, public isEditMode = false) {
    const canvas2d = new Canvas2D()
    this.canvas = canvas2d.canvas
    this.canvas.width = 512;
    this.canvas.height = 512;
    this.ctx = canvas2d.ctx
    
    this.points = points as [number, number][]
  };


  addPoint(x: number, y: number) {
    this.points.push([x, y]);
    this.pickedPoint = this.points.length - 1;
  };


  pickPoint(x: number, y: number) {
    for (let i = 0; i < this.points.length; i++)
      if (Math.sqrt(Math.pow(this.points[i][0] - x, 2) + Math.pow(this.points[i][1] - y, 2)) < PICK_RADIUS) {
        this.pickedPoint = i;
        return true;
      }
    return null;
  };

  setPoint(i: number, x: number, y: number) {
    this.points[i] = [x, y];
  }

  unpick() {
    this.pickedPoint = null;
  }

  drawBezier(start: number, end: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
    this.ctx.beginPath();

    for (let t = start; t < end; t += 0.001)
      this.ctx.lineTo(
        (1 - t) * (1 - t) * x1 + 2 * t * (1 - t) * x2 + t * t * x3,
        (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * y2 + t * t * y3
      );


    this.ctx.stroke();
  };

  get() {
    return this.canvas;
  }

  draw() {
    if (this.isEditMode) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.fillStyle = 'black';
      this.ctx.lineWidth = PEN_WIDTH;

      for (let i = 0; i <= this.points.length - 3; i += 3) {
        const p1 = this.points[i + 0];
        const p2 = this.points[i + 1];
        const p3 = this.points[i + 2];

        this.drawBezier(0, 1, p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
      }

      this.ctx.lineWidth = 1;
      this.ctx.fillStyle = '#f00';
      for (let i = 0; i < this.points.length; i++) {
        this.ctx.beginPath();
        this.ctx.arc(this.points[i][0], this.points[i][1], PICK_RADIUS, 0, 2 * Math.PI);
        this.ctx.fill();
      }

    } else {

      this.ctx.fillStyle = 'black';
      this.ctx.lineWidth = PEN_WIDTH;

      if (this.duration() > this.DURATION) {
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        return;
      }




      let index = Math.floor(this.points.length * this.duration() / this.DURATION);
      index = index - index % 3;

      const t = this.duration() / this.DURATION * this.points.length / 3 % 1;

      for (let i = this.lastIndex; i <= index; i += 3)
        if (i + 2 < this.points.length) {

          const p1 = this.points[i + 0];
          const p2 = this.points[i + 1];
          const p3 = this.points[i + 2];

          let l = this.lastTime;
          let r = t + 0.02;


          if (i == this.lastIndex && i < index) r = 1;
          else if (i > this.lastIndex && i < index) {
            l = 0;
            r = 1;
          } else if (i > this.lastIndex && i == index) l = 0;

          this.drawBezier(l, r, p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
        }

      this.lastIndex = index;
      this.lastTime = t;
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };
}

export class MaskEditor {

  constructor(private mask: MaskPainter, private svg: SVG) {
  }

  mousedown(e: MouseEvent) {
    if (this.mask.isEditMode) {
      var svgCoordinatesX = (e.offsetX - this.svg.getOffsetX()) / this.svg.getSize() * 512;
      var svgCoordinatesY = (e.offsetY - this.svg.getOffsetY()) / this.svg.getSize() * 512;

      if (this.mask.pickPoint(svgCoordinatesX, svgCoordinatesY)) return;
      if (svgCoordinatesX > 0 && svgCoordinatesY > 0 && svgCoordinatesX < 512 && svgCoordinatesY < 512)
        this.mask.addPoint(svgCoordinatesX, svgCoordinatesY);
    }
  }

  mousemove(e: MouseEvent) {
    if (this.mask.pickedPoint !== null) {
      var svgCoordinatesX = (e.offsetX - this.svg.getOffsetX()) / this.svg.getSize() * 512;
      var svgCoordinatesY = (e.offsetY - this.svg.getOffsetY()) / this.svg.getSize() * 512;

      this.mask.setPoint(this.mask.pickedPoint, svgCoordinatesX, svgCoordinatesY);
    }
  }

  mouseup(e: MouseEvent) {
    this.mask.unpick();
  }

  keydown(e: KeyboardEvent) {
    if (e.keyCode == 16) {
      if (this.mask.isEditMode) this.mask.points = [];
    } else if (e.keyCode == 17) {
      this.mask.isEditMode = !this.mask.isEditMode;
      console.log('editor mode: ' + this.mask.isEditMode);
    } else if (e.keyCode == 18) {
      if (this.mask.isEditMode) {
        var out = '';
        for (var i = 0; i < this.mask.points.length; i++)
          out += '[' + this.mask.points[i][0] + ',' + this.mask.points[i][1] + '],';

        console.log('[' + out + ']');
      }
    }
  }
}

export class SVG {
  pattern: null | CanvasPattern = null;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  img: HTMLImageElement;
  center = {
    x: 0,
    y: 0
  };
  size = 0;

  constructor(url: string, onload: () => void) {
    const canvas2d = new Canvas2D()
  
    this.canvas = canvas2d.canvas
    this.ctx = canvas2d.ctx

    this.img = new Image();
    this.img.onload = () => {
      this.pattern = this.ctx.createPattern(this.img, 'no-repeat');
      onload();
    };

    this.img.src = url;
  }

  getOffsetX() {
    return this.center.x;
  };

  getOffsetY() {
    return this.center.y;
  }

  getSize() {
    return this.size;
  }

  setSize(val: number, { width, height }: { width: number; height: number }) {
    this.size = val;
    this.canvas.width = this.size;
    this.canvas.height = this.size;

    this.center.x = width / 2 - this.size / 2;
    this.center.y = height / 2 - this.size / 2;
  };


  render(mask: MaskPainter) {
    const scale = this.size / this.img.width;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.scale(scale, scale);

    mask.draw();

    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.drawImage(mask.get(), 0, 0);

    this.ctx.globalCompositeOperation = mask.isEditMode ? "destination-over" : "source-in";
    if (!this.pattern) throw new Error('pattern is null')
    this.ctx.fillStyle = this.pattern;
    this.ctx.fillRect(0, 0, this.img.width, this.img.height);


    this.ctx.resetTransform();

    return this.canvas
  }
}
