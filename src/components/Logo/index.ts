import { h } from 'easyhard'
import { css } from 'easyhard-styles'
import { MaskPainter, SVG, MaskEditor } from './mask-painter'
import { BinaryBackground } from './binary-background'
import { overlayGradient } from './gradient'
import { onMount, onDestroy } from '../../utils'
import { Canvas2D } from '../../utils/canvas'

const refreshButtonStyles = css({
    $name: 'refreshButton',
    position: 'absolute',
    right: '15px',
    bottom: '15px',
    padding: '5px',
    width: '20px',
    cursor: 'pointer'
})

export function Logo({ text, duration, ondone, debug }: { text: string; duration: number; debug?: boolean; ondone?: () => void }) {
    const container = document.createElement('div')
    const { canvas, ctx } = new Canvas2D()

    let startTime: number = 0;
    const mask = new MaskPainter(getElapsedTime, duration, debug);
    const background = new BinaryBackground(text);
    const svg = new SVG('svg/logo.svg', function () {
        startTime = new Date().getTime();
        resize();
        renderAnimate();
    });
    const editor = new MaskEditor(mask, svg)

    const refreshButton = h('img', { src: 'img/refresh.png', click: refresh, className: refreshButtonStyles.className })
    container.appendChild(refreshButton)
    container.appendChild(canvas)

    function refresh() {
        startTime = new Date().getTime();
        background.reinit(canvas.width, canvas.height);

        mask.clear();
    }

    canvas.addEventListener('mousedown', e => debug && editor.mousedown(e))
    canvas.addEventListener('mousemove', e => debug && editor.mousemove(e))
    canvas.addEventListener('mouseup', e => debug && editor.mouseup(e))

    const handleKeydown = (e: KeyboardEvent) => debug && editor.keydown(e)
    onMount(container, () => window.addEventListener('keydown', handleKeydown))
    onDestroy(container, () => window.removeEventListener('keydown', handleKeydown))

    onMount(container, () => window.addEventListener('resize', resize))
    onDestroy(container, () => window.removeEventListener('resize', resize))

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        var size = canvas.width * 0.1 + 200;
        svg.setSize(size, { width: canvas.width, height: canvas.height });

        clear();
        background.reinit(canvas.width, canvas.height);
        render()
    }

    function getElapsedTime() {
        return new Date().getTime() - startTime;
    }

    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function render() {
        const bg = background.render(getElapsedTime(), duration);
        ctx.drawImage(bg, 0, 0);

        overlayGradient(ctx, canvas.width, canvas.height);

        const img = svg.render(mask);
        ctx.drawImage(img, svg.center.x, svg.center.y);
    }

    function renderAnimate() {
        requestAnimationFrame(renderAnimate);
        
        if (getElapsedTime() >= duration && ondone) {
            ondone();
        }
        clear();
        render()
    }

    return container
}