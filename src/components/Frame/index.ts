import { Child, h } from 'easyhard';
import { injectStyles } from 'easyhard-styles';
import { Observable, interval } from 'rxjs';
import { delay, distinctUntilChanged, first, map, switchMap } from 'rxjs/operators';

export function Frame(props: { open: Observable<boolean> }, ...content: Child[]) {
  return h('div', {},
    injectStyles({
      position: 'absolute',
      top: '4em',
      left: '2em',
      width: 'calc(100% - 4em)',
      height: 'calc(100% - 6em)',
      backdropFilter: 'blur(2px)',
      color: 'rgb(30, 30, 30)',
      zIndex: '20',
      background: 'rgb(255 255 255 / 40%)',
      borderRadius: '2em',
      border: '1px solid #c4c4c442',
      boxShadow: '0px 3px 20px 6px #00000014',
      padding: '2em',
      boxSizing: 'border-box',
      display: 'none',
      '@media': {
        query: {
          maxWidth: '500px',
        },
        top: '3em',
        left: '1em',
        width: 'calc(100% - 2em)',
        height: 'calc(100% - 4em)'
      }
    }),
    injectStyles({
      transition: 'all 0.4s ease-out',
      opacity: props.open.pipe(delay(10), map(open => open ? '1' : '0')),
      filter: props.open.pipe(delay(10), map(open => open ? 'blur(0)' : 'blur(15px)')),
      display: props.open.pipe(
        distinctUntilChanged(),
        switchMap(open => interval(open ? 0 : 400).pipe(first(), map(() => open))),
        map(open => open ? 'block' : 'none')
      )
    }),
    h('div', {}, injectStyles({
      overflowY: 'auto',
      overflowX: 'hidden',
      height: '100%',
      display: 'grid' //fix scroll
    }),
      ...content
    )
  )
}
