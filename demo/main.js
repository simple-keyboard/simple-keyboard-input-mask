let Keyboard = window.SimpleKeyboard.default;
let inputMask = window.SimpleKeyboardInputMask.default;

let keyboard = new Keyboard({
  onChange: input => onChange(input),
  onKeyPress: button => onKeyPress(button),
  modules: [inputMask],
  onModulesLoaded: () => {
    console.log("Module loaded!");
  },
  inputMask: "(99) 9999-9999",
  inputMaskPhysicalKeyboardHandling: true,
  inputMaskTargetClass: "input",
  layout: {
    default: [
      "` 1 2 3 4 5 6 7 8 9 0 - = {backspace}",
      "{tab} q w e r t y u i o p [ ] \\",
      "{capslock} a s d f g h j k l ; ' {enter}",
      "{shiftleft} z x c v b n m , . / {shiftright}",
      ".com @ {space}"
    ],
    shift: [
      "~ ! @ # $ % ^ & * ( ) _ + {backspace}",
      "{tab} Q W E R T Y U I O P { } |",
      '{capslock} A S D F G H J K L : " {enter}',
      "{shiftleft} Z X C V B N M < > ? {shiftright}",
      ".com @ {space}"
    ]
  }
});

/**
 * Update simple-keyboard when input is changed directly
 */
/*document.querySelector(".input").addEventListener("input", event => {
  keyboard.setInput(event.target.value);
});*/

function onChange(input) {
  document.querySelector(".input").value = input;
  console.log("Input changed", input);
}

function onKeyPress(button) {
  console.log("Button pressed", button);

  /**
   * If you want to handle the shift and caps lock buttons
   */
  if (button === "{shift}" || button === "{lock}") handleShift();
}

function handleShift() {
  let currentLayout = keyboard.options.layoutName;
  let shiftToggle = currentLayout === "default" ? "shift" : "default";

  keyboard.setOptions({
    layoutName: shiftToggle
  });
}
