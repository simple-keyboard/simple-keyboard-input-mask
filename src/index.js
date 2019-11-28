class SimpleKeyboardInputMask {
  init = keyboard => {
    keyboard.registerModule("inputMask", module => {
      if (!keyboard.options.inputMask) {
        console.warn(
          "SimpleKeyboardInputMask: You must provide the inputMask option with your input mask"
        );
        return false;
      }

      if (!keyboard.options.disableCaretPositioning) {
        console.warn(
          "SimpleKeyboardInputMask: Caret placement is not supported in this release. Option disableCaretPositioning will be enabled. To disable this warning, set option disableCaretPositioning to true."
        );
        keyboard.options.disableCaretPositioning = true;
      }

      module.getMaskedInput = (button, input, caretPos, moveCaret) => {
        let inputMask = keyboard.options.inputMask;
        let resultingInput = "";

        if (
          inputMask &&
          (typeof inputMask === "object" || typeof inputMask === "string") &&
          !module.isBksp(button) &&
          moveCaret
        ) {
          let inputMaskStr;

          if (typeof inputMask === "object") {
            inputMaskStr =
              keyboard.options.inputMask[keyboard.options.inputName];
          } else {
            inputMaskStr = inputMask;
          }

          let overrides = module.autoAddSymbol(
            caretPos,
            input,
            inputMaskStr,
            button
          );

          input = overrides.input || input;
          caretPos = overrides.caretPos || caretPos;

          let inputProposal = module.fn.getUpdatedInput(
            button,
            input,
            caretPos,
            false
          );

          if (
            module.validateInputProposal(inputProposal, inputMaskStr, caretPos)
          ) {
            resultingInput = module.fn.getUpdatedInput(
              button,
              input,
              caretPos,
              moveCaret
            );
          } else {
            resultingInput = keyboard.getInput();
          }
        } else {
          resultingInput = module.fn.getUpdatedInput(
            button,
            input,
            caretPos,
            moveCaret
          );
        }

        return resultingInput;
      };

      module.inputClass = keyboard.options.inputMaskTargetClass || "input";
      module.currentButton = "";
      module.fn = {};

      module.fn.getUpdatedInput = keyboard.utilities.getUpdatedInput;

      keyboard.utilities.getUpdatedInput = (
        button,
        input,
        caretPos,
        moveCaret
      ) => {
        return module.getMaskedInput(button, input, caretPos, moveCaret);
      };

      module.onKeyPressed = e => {
        let isInputTarget = e.target.classList.contains(module.inputClass);
        if (!isInputTarget) return false;

        if (keyboard.options.debug) console.log("isInputTarget", isInputTarget);

        if (keyboard.options.debug) console.log("input", e);

        let layoutKey = keyboard.physicalKeyboard.getSimpleKeyboardLayoutKey(e);
        if (layoutKey && layoutKey.includes("numpad"))
          layoutKey = layoutKey.replace("numpad", "");

        let buttonElement =
          keyboard.getButtonElement(layoutKey) ||
          keyboard.getButtonElement(`{${layoutKey}}`);

        if (buttonElement) {
          let isFctBtn = buttonElement.classList.contains("hg-functionBtn");
          let layoutKeyFormatted = isFctBtn ? `{${layoutKey}}` : layoutKey;

          if (
            isFctBtn &&
            (layoutKey.includes("shift") || layoutKey.includes("caps"))
          ) {
            return false;
          }

          if (keyboard.options.debug)
            console.log("layoutKeyFormatted", layoutKeyFormatted);

          keyboard.handleButtonClicked(layoutKeyFormatted);

          e.target.value = "";
          e.target.value = keyboard.getInput();
        }

        if (keyboard.options.debug) console.log(layoutKey, buttonElement);
      };

      module.initInputHandling = () => {
        document.addEventListener("keyup", module.onKeyPressed);
      };

      module.destroy = () => {
        document.removeEventListener("keyup", module.onKeyPressed);
      };

      module.validateInputProposal = (inputProposal, inputMask, caretPos) => {
        if (
          inputProposal &&
          typeof inputProposal === "string" &&
          inputMask &&
          typeof inputProposal === "string"
        ) {
          let inputPropArr = inputProposal.split("");
          let validated = true;
          let i = caretPos || 0;

          for (i = 0; i < inputPropArr.length; i++) {
            validated = module.isCharAllowed(inputPropArr[i], inputMask[i]);
          }

          return validated;
        } else {
          return false;
        }
      };

      module.isCharAllowed = (character, maskCharacter) => {
        if (!(character && maskCharacter) && character !== "0") {
          return false;
        }

        /**
         * Number check
         */
        let numberCheck =
          module.isNumber(character) && module.isNumber(maskCharacter);

        /**
         * Letter check
         */
        let letterCheck =
          module.isLetter(character) && module.isLetter(maskCharacter);

        /**
         * Symbol check
         */
        let symbolCheck =
          // If char not maskChar are numbers or letters
          !numberCheck &&
          !letterCheck &&
          // If char and maskChar are the same
          character === maskCharacter;

        return numberCheck || letterCheck || symbolCheck;
      };

      module.isBksp = button => {
        return button === "{bksp}" || button === "{backspace}";
      };

      module.isNumber = input => {
        return (
          input === "0" ||
          // If char is a number
          (!isNaN(Number(input)) &&
            // If char is not a whitespace
            input.match(/^\s$/) === null)
        );
      };

      module.isLetter = input => {
        let letterCheckPattern;
        let defaultCheckPattern = /[a-z]/i;

        if (typeof keyboard.options.letterCheckPattern === "object") {
          letterCheckPattern =
            keyboard.options.letterCheckPattern[keyboard.options.inputName] ||
            defaultCheckPattern;
        } else {
          letterCheckPattern =
            keyboard.options.letterCheckPattern || defaultCheckPattern;
        }

        return (
          // If char is a letter
          input.match(letterCheckPattern)
        );
      };

      module.isSymbol = () => {};

      module.autoAddSymbol = (caretPos, input, inputMaskStr, button) => {
        if (!input.trim() && !caretPos) {
          caretPos = 0;
        } else {
          caretPos = input.length;
        }

        let inputMaskArr = inputMaskStr.split("");

        for (let i = caretPos; i < inputMaskArr.length; i++) {
          if (
            inputMaskArr[i] &&
            !module.isNumber(inputMaskArr[i]) &&
            !module.isLetter(inputMaskArr[i]) &&
            (Number(button) || Number(button) === 0)
          ) {
            input = keyboard.utilities.addStringAt(
              input,
              inputMaskArr[i],
              i,
              false
            );

            if (!keyboard.options.disableCaretPositioning) {
              keyboard.caretPosition = keyboard.caretPosition
                ? keyboard.caretPosition + 1
                : 1;
            }
          } else {
            break;
          }
        }

        return {
          input: input,
          caretPos: keyboard.caretPosition
        };
      };

      /**
       * Initializing listeners
       */
      if (keyboard.options.inputMaskPhysicalKeyboardHandling) {
        module.initInputHandling();
      }
    });
  };
}

export default SimpleKeyboardInputMask;
