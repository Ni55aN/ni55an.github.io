import { Canvas2D } from "../../utils/canvas";

const FONT_SIZE = 20;
const LINE_HEIGHT = 22;
const FONT_FAMILY = '"Baskerville Old Face"';
const FONT_COLOR = "#c7c7c7";
const CHAR_WIDTH = [14, 10];
const START_OFFSET = 5;

export class BinaryBackground {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    text = new Uint8Array()
    offsetW: any;
    offsetH: any;
    hidedText: any;

    constructor(private stringMask: string) {
        const canvas2d = new Canvas2D()
        this.canvas = canvas2d.canvas
        this.ctx = canvas2d.ctx
    }

    getTextBit(index: number) {
        return this.text[Math.floor(index / 8)] >> index % 8 & 1;
    }

    initChars(width: number) {
        const charsCount = Math.ceil(this.canvas.height / FONT_SIZE * this.canvas.width / Math.min(CHAR_WIDTH[0], CHAR_WIDTH[1]) / 8);
        this.text = new Uint8Array(charsCount);
        this.offsetW = new Uint16Array(charsCount * 8);
        this.offsetH = new Uint16Array(charsCount * 8);
        this.hidedText = [];

        for (let i = 0, w = START_OFFSET, h = LINE_HEIGHT; i < this.text.length; i++) {
            this.text[i] = this.stringMask.charCodeAt(i % this.stringMask.length);

            for (let j = 7; j >= 0; j--) {
                const bitIndex = i * 8 + j;
                this.hidedText.push(bitIndex);

                const bit = this.getTextBit(bitIndex);

                if (w + CHAR_WIDTH[bit] > width) {

                    h += LINE_HEIGHT;
                    w = START_OFFSET;
                }

                this.offsetW[bitIndex] = w;
                this.offsetH[bitIndex] = h;

                w += CHAR_WIDTH[bit];

            }
        }

        this.ctx.fillStyle = FONT_COLOR;
        this.ctx.font = FONT_SIZE + "px " + FONT_FAMILY;
    }

    drawBits(list: number[]) {
        for (let i = 0; i < list.length; i++) {
            const bitIndex = list[i];
            this.ctx.fillText(String(this.getTextBit(bitIndex)), this.offsetW[bitIndex], this.offsetH[bitIndex]);
        }
    }

    getDrawnContenders(elapsed: number, duration: number) {
        const list = [];
        const bitsCount = this.text.length * 8;
        const hidedCount = this.hidedText.length;

        const f = elapsed / duration;

        const prev_show = bitsCount - hidedCount;
        const curr_show = f * bitsCount;

        if (this.hidedText.length > 0) {
            for (let i = 0; i < curr_show - prev_show; i++) {
                const hidedIndex = Math.floor(Math.random() * this.hidedText.length);
                const bitIndex = this.hidedText[hidedIndex];

                this.hidedText.splice(hidedIndex, 1);
                list.push(bitIndex);
            }
        }

        return list;
    };

    render(elapsed: number, duration: number) {
        const drawlist = this.getDrawnContenders(elapsed, duration);
        this.drawBits(drawlist);

        return this.canvas
    }

    reinit(width: number, height: number) {
        this.canvas.width = width;
        this.canvas.height = height;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.initChars(this.canvas.width);
    }
}
