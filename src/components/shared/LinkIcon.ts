import { h } from "easyhard";
import { injectStyles } from "easyhard-styles";

export function LinkIcon() {
  return h('img', { src: '../img/link.png' }, injectStyles({
    background: "url('../img/link.png')",
    backgroundSize: "cover",
    height: "16px",
    width: "16px",
    marginLeft: "6px",
    display: "inline-block",
    opacity: "0.5",
    transition: ".8s"
  }))
}