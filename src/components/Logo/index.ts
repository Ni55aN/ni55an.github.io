/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { h, onMount } from 'easyhard'
import { injectStyles } from 'easyhard-styles'
import { getBinaryBackground } from './binary-background'
import { Application } from '@pixi/app'
import { TextStyle, Text } from '@pixi/text'
import { Container } from '@pixi/display'
import { Graphics } from '@pixi/graphics'
import animejs, { AnimeInstance } from 'animejs'
import { createOverlayGradient } from './gradient'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { debounce } from 'lodash-es'

export function Logo({ text, opacity, duration }: { text: string; opacity: Observable<number>, duration: number }) {
    const container = document.createElement('div')

    onMount(container, () => {
        const resize = debounce(() => {
            app.renderer.resize(window.innerWidth, window.innerHeight)
            addDigits()
        }, 500)
        window.addEventListener('resize', resize)

        return () => window.removeEventListener('resize', resize)
    })

    const canvasBg = h('canvas', {},
        injectStyles({
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: '4'
        })
    )
    const app = new Application({
        view: canvasBg,
        backgroundAlpha: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        antialias: true,
    })
    const bg = new Container()

    bg.zIndex = 4

    app.stage.sortableChildren = true

    app.stage.addChild(bg)

    const shadeGradient = new Graphics()

    shadeGradient.endFill()

    let animation: AnimeInstance

    async function addDigits(animate?: boolean) {
        bg.removeChildren()

        const fontSize = 20
        const style = new TextStyle({
            fontSize: fontSize + 'px',
            fill: 'rgb(207 207 207)',
            fontFamily: 'serif'
        });

        const data = {
            background: null as ReturnType<typeof getBinaryBackground> | null,
            indices: null as null | number[]
        }
        if (!animate) {
            if (animation) animation.pause()
            init()
            step(1)
            return
        }
        if (animation) {
            animation.duration = duration
            animation.restart()
            return
        }
        const targets = {
            t: 0
        }

        function init() {
            data.background = getBinaryBackground(text, {
                width: window.innerWidth,
                height: window.innerHeight,
                offset: [5, 5],
                lineHeight: 22,
                fontSize: fontSize
            })
            data.indices = new Array(data.background.text.length).fill(0).map((_, i) => i)
        }
        function step(t: number) {
            const { background, indices } = data
            if (!background) return
            if (!indices) return

            const k = 1 - indices.length / background.text.length

            const length = Math.floor((t - k) * background.text.length)
            const add = new Array(length).fill(null).map(() => indices.splice(Math.floor(Math.random() * indices.length), 1)[0])

            for (const i of add) {
                const text = new Text(background.text[i], style)
                text.x = background.x[i]
                text.y = background.y[i]

                bg.addChild(text)
            }
        }

        animation = animejs({
            targets,
            t: 1,
            duration,
            easing: 'easeInCubic',
            loopBegin() {
                init()
            },
            begin() {
                init()
            },
            update() {
                step(targets.t)
            },
        })
    }
    addDigits(true)

    container.appendChild(canvasBg)

    container.appendChild(createOverlayGradient())

    const masked =
        h('div', {
            style: `
                -webkit-mask-image: url(mask.svg?q=${Math.random()});
                -webkit-mask-size: 100%;
                -webkit-mask-repeat: no-repeat;
                -webkit-mask-position: center;
            `
        },
            injectStyles({
                $name: 'Masked',
                position: 'relative',
                width: '21.6em',
                height: '21.6em',
                transform: 'scale(0.7)',
                transition: 'opacity 0.4s ease-out',
                opacity: opacity.pipe(map(String))
            }),
            h('div', {},
                injectStyles({
                    display: 'block',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    boxSizing: 'border-box',
                    width: '85.9%',
                    height: '85.9%',
                    borderRadius: '100%',
                    border: '1.95em solid white'
                })
            ),
            h('div', {},
                injectStyles({
                    display: 'block',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    boxSizing: 'border-box',
                    width: '83.2%',
                    height: '83.2%',
                    borderRadius: '100%',
                    border: '1.3em solid #6b6b6b'
                })
            ),
            h('div', {
                style: '-webkit-text-stroke: 0.1em white'
            },
                injectStyles({
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontFamily: 'Berlin',
                    fontSize: '6.3em',
                    fontStyle: 'normal',
                    pointerEvents: 'none'
                }),
                'Ni55aN'
            ),
            h('div', {},
                injectStyles({
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontFamily: 'Berlin',
                    fontSize: '6.3em',
                    fontStyle: 'normal',
                    pointerEvents: 'none'
                }),
                h('span', {}, injectStyles({ color: '#6b6b6b' }), 'Ni'),
                h('span', {}, injectStyles({ color: '#f98000' }), '55'),
                h('span', {}, injectStyles({ color: '#6b6b6b' }), 'aN')
            )
        )

    const logoEl = h('div', { style: '' },
        injectStyles({
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '15'
        }),
        masked
    )
    container.appendChild(logoEl)


    return container
}
