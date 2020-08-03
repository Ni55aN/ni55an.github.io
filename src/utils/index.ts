import { h, $, untilExist } from 'easyhard'
import { first } from 'rxjs/operators'

export function onMount(el: ChildNode, cb: () => void) {
  $('').pipe(untilExist(el), first()).subscribe(cb)
}

export function onDestroy(el: ChildNode, cb: () => void) {
  $('').pipe(untilExist(el)).subscribe({
      complete: cb
  })
}