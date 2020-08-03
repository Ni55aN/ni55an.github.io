import { h } from "easyhard";
import { injectStyles } from "easyhard-styles";
import linkImg from "../../assets/img/link.png"

export function LinkIcon() {
  return h('img', { src: linkImg }, injectStyles({
    height: "16px",
    width: "16px",
    marginLeft: "6px",
    display: "inline-block",
    opacity: "0.5",
    transition: ".8s"
  }))
}