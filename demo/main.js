let Keyboard = window.SimpleKeyboard.default;
let inputMask = window.SimpleKeyboardInputMask.default;
let selectedInput;

let keyboard = new Keyboard({
  onChange: input => onChange(input),
  onKeyPress: button => onKeyPress(button),
  modules: [inputMask],
  onModulesLoaded: () => {
    console.log("Module loaded!");
  },
  //debug: true,
  inputMaskPhysicalKeyboardHandling: true,
  inputMaskTargetClass: "input", // Related to "inputMaskPhysicalKeyboardHandling". The input element handled by simple-keyboard must have this class.
  inputMask: {
    "input2": {
      mask: '+1 (999) 999-9999',
      regex: /^[0-9]+$/
    },
    "input3": {
      mask: 'abcde-fghi-0000-00',
      regex: /^[a-z0-9]+$/
    }
  },
  //inputMaskPhysicalKeyboardHandling: true,
  //inputMaskTargetClass: "input",
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

function onInputChange(event) {
  // if(!keyboard.modules.inputMask.isMaskingEnabled()){
  //   keyboard.setInput(event.target.value, event.target.id);
  // }
}

document.querySelectorAll(".input").forEach(input => {
  input.addEventListener("focus", onInputFocus);
  // Optional: Use if you want to track input changes
  // made without simple-keyboard
  input.addEventListener("input", onInputChange);
});

function onInputFocus(event) {
  selectedInput = `#${event.target.id}`;

  keyboard.setOptions({
    inputName: event.target.id
  });
}

function onChange(input) {
  console.log("Input changed", input);
  document.querySelector(selectedInput || ".input").value = input;
}

function onKeyPress(button) {
  console.log("Button pressed", button);

  /**
   * If you want to handle the shift and caps lock buttons
   */
  if (button === "{shiftleft}" || button === "{shiftright}" || button === "{capslock}") handleShift();
}

function handleShift() {
  let currentLayout = keyboard.options.layoutName;
  let shiftToggle = currentLayout === "default" ? "shift" : "default";

  keyboard.setOptions({
    layoutName: shiftToggle
  });
}
