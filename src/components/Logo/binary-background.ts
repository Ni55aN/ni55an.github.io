import { stringToBinary } from '../../utils/binary';

const CHAR_WIDTH = [14, 10];

export function getBinaryBackground(mask: string, options: { fontSize: number, width: number, height: number, offset: [number, number], lineHeight: number }) {
    const charsCount = Math.ceil(options.height / options.fontSize * options.width / Math.min(CHAR_WIDTH[0], CHAR_WIDTH[1]) / 8);
    const x = new Uint16Array(charsCount * 8);
    const y = new Uint16Array(charsCount * 8);
    const text = new Uint8Array(charsCount * 8);
    const bits = stringToBinary(mask);

    let count = 0

    for (let i = 0, w = options.offset[0], h = options.offset[1]; h < options.height; i++) {
        const bit = text[i] = bits[i % bits.length]

        if (w + CHAR_WIDTH[bit] > options.width) {
            h += options.lineHeight;
            w = options.offset[0];
        }

        x[i] = w;
        y[i] = h;

        w += CHAR_WIDTH[bit];
        count = i
    }

    return {
        x: x.slice(0, count),
        y: y.slice(0, count),
        text: text.slice(0, count)
    }
}

