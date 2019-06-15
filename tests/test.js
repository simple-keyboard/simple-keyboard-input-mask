import Keyboard from 'simple-keyboard';
import SimpleKeyboardInputMask from '../src/index';

it('Keyboard renders without crashing', () => {
  const div = document.createElement('div');
  
  div.className += "simple-keyboard";
  document.body.appendChild(div);

  new Keyboard({
    debug: true,
    onChange: input => input,
    onKeyPress: button => button,
    inputMask: "(99) 9999-9999",
    modules: [
      SimpleKeyboardInputMask
    ],
  });
});

it('Keyboard disableButtonHold will work', () => {
  const div = document.createElement('div');
  
  div.className += "simple-keyboard";
  document.body.appendChild(div);

  let keyboard = new Keyboard({
    debug: true,
    onChange: input => input,
    onKeyPress: button => button,
    inputMask: "(99) 9999-9999",
    useMouseEvents: true,
    modules: [
      SimpleKeyboardInputMask
    ],
  });

  keyboard.getButtonElement("d").onclick();
  keyboard.getButtonElement("o").onclick();
  keyboard.getButtonElement("{space}").onclick();
  keyboard.getButtonElement("1").onclick();
  keyboard.getButtonElement("2").onclick();
  keyboard.getButtonElement("3").onclick();
  keyboard.getButtonElement("c").onclick();
  keyboard.getButtonElement("4").onclick();
  keyboard.getButtonElement("5").onclick();
  keyboard.getButtonElement("6").onclick();
  keyboard.getButtonElement("7").onclick();
  keyboard.getButtonElement("8").onclick();
  keyboard.getButtonElement("9").onclick();
  keyboard.getButtonElement("0").onclick();

  expect(keyboard.getInput()).toBe("(12) 3456-7890");
});
