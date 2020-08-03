import { Attrs, h, $for, $$, Child } from 'easyhard'
import { injectStyles } from 'easyhard-styles'
import { map } from 'rxjs/operators'
import { commands } from '../../consts/cmd'
import backgroundImg from '../../assets/img/ubuntu-bg.png'
import buttonsImg from '../../assets/img/ubuntu-buttons.png'

function Input(props: Attrs<'input'>) {
  return h('input', props, injectStyles({
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'white',
    fontFamily: 'monospace',
    fontSize: '14px',
    flex: '1',
    padding: '0 0.6em'
  }))
}


function Window(...children: Child[]) {
  return h('div', {}, injectStyles({
    width: '40%',
    color: 'white',
    textAlign: 'left',
    margin: 'auto',
    fontStyle: 'normal',
    display: 'block',
    fontFamily: 'monospace',
    fontSize: '14px',
    position: 'relative',
    borderRadius: '10px 10px 4px 4px',
  }),
    h('div', {}, injectStyles({
      borderRadius: '10px 10px 0 0',
      display: 'block',
      height: '28px',
      width: '100%',
      left: '0',
      background: `url('${buttonsImg}') no-repeat, url('${backgroundImg}') repeat-x`
    })),
    h('div', {}, injectStyles({
      padding: '0.5em',
      backgroundColor: '#300A24',
      height: '40vh',
      overflow: 'auto'
    }),
    ...children
    )
  )
}

function Line(...children: Child[]) {
  return h('pre', {}, injectStyles({
    margin: '0',
    padding: '0.2em',
    display: 'block',
    maxHeight: '100%',
    overflow: 'auto',
    boxSizing: 'border-box'
  }), ...children)
}

export function Terminal({ name, path }: { name: string; path: string }) {
  const output = $$<string>([])

  function print(text: string) {
    output.insert(text)
  }

  function cmd(command: string) {
      var chunk = command.split(' ');
      var name = chunk[0];
      var response = commands[name];

      if (response)
          print(response);
      else
          print(name + " is not recognized as an internal or external command");
  }

  return Window(
    h('div', {}, $for(output, map(item => Line(item)))),
    Line(injectStyles({ display: 'flex'}), `${name}: ${path}$`, Input({ keydown(e) {
      if ((e as KeyboardEvent).keyCode == 13) {
        const input = (e as KeyboardEvent).target as HTMLInputElement
        print(`${name}: ${path}$ ${input.value}`)
        cmd(input.value);
        input.value = "";
      }
    }}))
  )
}