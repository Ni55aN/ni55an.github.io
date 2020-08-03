import { h, Attrs } from "easyhard";
import './styles.css'

export function Range(props: Attrs<'input'>) {
  return h('input', { className: 'range', type: 'range', ...props })
}