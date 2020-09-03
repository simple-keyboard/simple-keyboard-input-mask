class SimpleKeyboardInputMask {
  init = keyboard => {
    keyboard.registerModule("inputMask", module => {
      module.inputClass = keyboard.options.inputMaskTargetClass || "input";
      module.currentButton = "";
      module.fn = {};

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

      module.isMaskingEnabled = () => {
        const { inputMask } = keyboard.options;
        return !!(
          typeof inputMask === "object" &&
          inputMask[keyboard.options.inputName] &&
          inputMask[keyboard.options.inputName].mask &&
          inputMask[keyboard.options.inputName].regex
        );
      };

      module.getInputMaskStr = () => {
        const { inputMask, inputName } = keyboard.options;
        return module.isMaskingEnabled() ? inputMask[inputName].mask : "";
      };

      module.getInputMaskRegex = () => {
        const { inputMask, inputName } = keyboard.options;
        return module.isMaskingEnabled() ? inputMask[inputName].regex : "";
      };

      /**
       * getMaskedInput
       */
      module.getMaskedInput = (button, input, caretPos) => {
        let overrides = module.autoAddSymbol(caretPos, input, button);
        let resultingInput = "";

        input = overrides.input || input;
        caretPos = overrides.caretPos || caretPos;

        let inputProposal = module.fn.getUpdatedInput(
          button,
          input,
          caretPos,
          caretPos,
          false
        );

        if (module.validateInputProposal(inputProposal, caretPos)) {
          resultingInput = module.fn.getUpdatedInput(
            button,
            input,
            caretPos,
            caretPos,
            true
          );
        } else {
          resultingInput = keyboard.getInput();
        }

        return resultingInput;
      };

      module.validateInputProposal = (inputProposal, caretPos) => {
        const inputMask = module.getInputMaskStr();

        if (
          inputProposal &&
          typeof inputProposal === "string" &&
          inputMask &&
          typeof inputProposal === "string"
        ) {
          let inputPropArr = inputProposal.split("");
          let i = caretPos || 0;

          return module.isCharAllowed(inputPropArr[i]);
        } else {
          return false;
        }
      };

      module.isCharAllowed = character => {
        return character && !!character.match(module.getInputMaskRegex());
      };

      module.isBksp = button => {
        return button === "{bksp}" || button === "{backspace}";
      };

      /**
       * autoAddSymbol
       */
      module.autoAddSymbol = (caretPos, input, button) => {
        const inputMaskStr = module.getInputMaskStr();

        if (!input.trim() && !caretPos) {
          caretPos = 0;
        } else {
          caretPos = input.length;
        }

        let inputMaskArr = inputMaskStr.split("");

        //for (let i = caretPos; i < inputMaskArr.length; i++) {
        if (
          // If exists in mask
          typeof inputMaskArr[caretPos] !== "undefined" &&
          // But it is not according to regex
          inputMaskArr[caretPos].match(module.getInputMaskRegex()) === null
        ) {
          input = keyboard.utilities.addStringAt(
            input,
            inputMaskArr[caretPos],
            caretPos,
            caretPos,
            true
          );

          // if (!keyboard.options.disableCaretPositioning) {
          //   keyboard.setCaretPosition(i);
          // }

          return module.autoAddSymbol(caretPos++, input, button);
        } else {
          return {
            input,
            caretPos
          };
        }
        //}
      };

      module.onKeyPressed = e => {
        if (!module.isMaskingEnabled()) return false;

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

      module.fn.getUpdatedInput = keyboard.utilities.getUpdatedInput;
      keyboard.utilities.getUpdatedInput = (
        button,
        input,
        caretPos,
        caretPosEnd,
        moveCaret = false
      ) => {
        /**
         * If masking is enabled for input
         */
        if (module.isMaskingEnabled() && !module.isBksp(button)) {
          /**
           * Enforce maxLength
           */
          const { maxLength = {}, inputName } = keyboard.options;
          keyboard.setOptions({
            maxLength: {
              ...maxLength,
              [inputName]: module.getInputMaskStr().length
            }
          });

          var ipt = module.getMaskedInput(button, input, caretPos);
          return ipt;
        } else {
          return module.fn.getUpdatedInput(
            button,
            input,
            caretPos,
            caretPosEnd,
            moveCaret
          );
        }
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
