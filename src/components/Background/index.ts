import { mat4, vec2, vec3 } from './gl-matrix'
const Delaunay = require('./delaunay.min')

export class Background {
    DENSITY = 0.1
    DEPTH = 0.04
    OFFSET = 15
    SSAO_SHADENESS = 1000.0
    SENSITIVITY = 0.2
    _ctx: null | CanvasRenderingContext2D = null
    _canvas: null | HTMLCanvasElement = null
    _ssao_ctx: null | CanvasRenderingContext2D = null
    _ssao_canvas: null | HTMLCanvasElement = null
    vertices: number[][] = []
    triangles: any[] = []
    normals: any[] = []
    mousePosition = [0, 0, 0]
    perspectiveMatrix = mat4.perspective(Math.PI * 0.3, 1, 0.0001, 10000)

    get ctx() {
        const ctx = this._ctx
        if (ctx === null) throw new Error('ctx is null')
        return ctx
    }

    get ssao_ctx() {
        const ssao_ctx = this._ssao_ctx
        if (ssao_ctx === null) throw new Error('ssao_ctx is null')
        return ssao_ctx
    }

    get canvas() {
        const canvas = this._canvas
        if (canvas === null) throw new Error('canvas is null')
        return canvas
    }

    get ssao_canvas() {
        const canvas = this._ssao_canvas
        if (canvas === null) throw new Error('ssao_canvas is null')
        return canvas
    }

    resize = () => {
        const canvas = this.canvas
        const ssao_canvas = this.ssao_canvas

        if (ssao_canvas === null || canvas === null) return;

        ssao_canvas.width = this.canvas.width = window.innerWidth;
        ssao_canvas.height = this.canvas.height = window.innerHeight;

        this.generate();

        //	this.ctx.scale((window.innerWidth+this.OFFSET)/window.innerWidth,(window.innerHeight+this.OFFSET)/window.innerHeight);
        //	this.ctx.translate(-this.OFFSET/2,-this.OFFSET/2);
    }

    onUpdate = (e: any) => {

        this.mousePosition = [e.clientX / this.canvas.width * 2 - 1, e.clientY / this.canvas.height * 2 - 1, 1];

        this.redraw();
    }

    generate = () => {

        var wcount = Math.ceil(this.canvas.width / 10);
        var hcount = Math.ceil(this.canvas.height / 10);

        var wstep = this.canvas.width / (wcount - 1);
        var hstep = this.canvas.height / (hcount - 1);

        var w = this.canvas.width;
        var h = this.canvas.height;


        this.vertices = [];
        this.normals = [];

        var v = this.vertices;
        var n = this.normals;

        v.push([-1, -1, 0]);
        v.push([1, -1, 0]);
        v.push([-1, 1, 0]);
        v.push([1, 1, 0]);

        for (var i = 0; i < wcount; i++)
            for (var j = 0; j < hcount; j++) {


                var vj = [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * this.DEPTH];

                var valid = true;

                for (var k = 0; k < v.length; k++)
                    if (Math.sqrt(Math.pow(w / h * (v[k][0] - vj[0]), 2) + Math.pow(v[k][1] - vj[1], 2)) < this.DENSITY) {
                        valid = false;
                        break;
                    }
                if (valid) {
                    v.push(vj);
                    let tries = 0; // TODO
                }
            }



        this.triangles = Delaunay.triangulate(v);
        var t = this.triangles;

        for (var i = 0; i < t.length; i += 3)
            n.push(vec3.normal(v[t[i]], v[t[i + 1]], v[t[i + 2]]));

    }

    drawLine = (img: any, v0: any, v1: any) => {

        var x0 = Math.round(v0[0]);
        var y0 = Math.round(v0[1]);
        var d0 = v0[2];
        var x1 = Math.round(v1[0]);
        var y1 = Math.round(v1[1]);
        var d1 = v1[2];

        var tmp;
        if (x0 > x1 || y0 > y1) {
            tmp = x0;
            x0 = x1;
            x1 = tmp;
            tmp = y0;
            y0 = y1;
            y1 = tmp;
        }

        var dy = (y1 - y0);
        var dx = (x1 - x0);
        var k = dy / dx;


        if (y1 - y0 < x1 - x0)
            for (var x = Math.floor(x0), y = y0; x < x1; x++, y += k) {
                if (x < 0 || x > this.canvas.width || y < 0 || y > this.canvas.height) continue;

                var ind = (Math.floor(y) * this.canvas.width + x) * 4;

                var t = (x - x0) / dx;
                img.data[ind + 3] = Math.ceil(this.SSAO_SHADENESS * (t * d0 + (1 - t) * d1));

            }
        else
            for (var y = Math.floor(y0), x = x0; y < y1; y++, x += 1 / k) {
                if (x < 0 || x > this.canvas.width || y < 0 || y > this.canvas.height) continue;

                var ind = (y * this.canvas.width + Math.floor(x)) * 4;
                var t = (y - y0) / dy;
                img.data[ind + 3] = Math.ceil(this.SSAO_SHADENESS * (t * d0 + (1 - t) * d1));
            }


    }

    redraw = () => {
        var w = this.canvas.width;
        var h = this.canvas.height;

        var ctx = this.ctx;
        var ssao_ctx = this.ssao_ctx;
        var v = this.vertices;
        var t = this.triangles;
        var n = this.normals;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        var ssao_data = ssao_ctx.createImageData(w, h);

        var view = mat4.lookAt([0, 0, -1], [0, 0, 0], [0, 1, 0]);
        var model = mat4.multiply(
            mat4.makeRotationX(h / w * this.SENSITIVITY * this.mousePosition[1]),
            mat4.makeRotationY(this.SENSITIVITY * this.mousePosition[0])
        );

        var vp = mat4.multiply(this.perspectiveMatrix, view);
        var mvp = mat4.multiply(vp, model);

        for (var i = 0, j = 0; i < t.length; i += 3, j++) {

            var x1 = v[t[i + 0]][0];
            var y1 = v[t[i + 0]][1];
            var d1 = v[t[i + 0]][2];

            var x2 = v[t[i + 1]][0];
            var y2 = v[t[i + 1]][1];
            var d2 = v[t[i + 1]][2];

            var x3 = v[t[i + 2]][0];
            var y3 = v[t[i + 2]][1];
            var d3 = v[t[i + 2]][2];


            var p1 = vec3.applyProjection([x1, y1, d1], mvp);
            var p2 = vec3.applyProjection([x2, y2, d2], mvp);
            var p3 = vec3.applyProjection([x3, y3, d3], mvp);


            if (p1[2] < -1 || p2[2] < -1 || p3[2] < -1 || p1[2] > 1 || p2[2] > 1 || p3[2] > 1) continue;

            p1[2] = d1;
            p2[2] = d2;
            p3[2] = d3;

            var mouse = vec3.applyProjection(this.mousePosition, mvp);
            mouse[0] *= -1;

            var triangle_center = vec3.mul(vec3.add(p1, vec3.add(p2, p3)), 1 / 3);

            var direction = vec3.normalize(vec3.sub(mouse, triangle_center));

            var shine = Math.ceil(230 + 20 * vec3.dot(direction, n[j]));

            p1 = vec3.screenSpace(p1, w, h);
            p2 = vec3.screenSpace(p2, w, h);
            p3 = vec3.screenSpace(p3, w, h);

            ctx.fillStyle = "rgba(" + shine + "," + shine + "," + shine + ",1)";


            ctx.beginPath();

            ctx.moveTo(p1[0], p1[1]);
            ctx.lineTo(p2[0], p2[1]);
            ctx.lineTo(p3[0], p3[1]);

            ctx.closePath();
            ctx.fill();

            this.drawLine(ssao_data, p1, p2);
            this.drawLine(ssao_data, p2, p3);
            this.drawLine(ssao_data, p3, p1);
        }

        ssao_ctx.putImageData(ssao_data, 0, 0);


    }

    init() {
        document.body.style.background = "none";

        this._canvas = document.createElement('canvas');
        (this._canvas as any).style = `
            position: fixed;
            left: 0;
            top: 0;
            z-index: -2;
        `
        document.body.appendChild(this.canvas);

        this._ctx = this.canvas.getContext('2d');

        this._ssao_canvas = document.createElement('canvas');
        (this._ssao_canvas as any).style = `
            filter: blur(7px);
            position: fixed;
            left: 0;
            top: 0;
            z-index: -2;
        `
        document.body.appendChild(this.ssao_canvas);

        this._ssao_ctx = this.ssao_canvas.getContext('2d');

        window.addEventListener('resize', this.resize, false);
        window.addEventListener('mousemove', this.onUpdate, false);

        this.resize();
        this.generate();
        this.redraw();
    }

    destroy() {
        window.removeEventListener('resize', this.resize);
        window.removeEventListener('mousemove', this.onUpdate);
    }
}
