import React, { Component } from "react";
import Keyboard from 'react-simple-keyboard';
import inputMask from '../lib/components/InputMask';

import 'simple-keyboard/build/css/index.css';
import './css/App.css';

class App extends Component {
  state = {
    layoutName: "default",
    input: ""
  };

  onChange = input => {
    this.setState({
      input: input
    });
    console.log("Input changed", input);
  };

  onKeyPress = button => {
    console.log("Button pressed", button);

    /**
     * If you want to handle the shift and caps lock buttons
     */
    //if (button === "{shift}" || button === "{lock}") this.handleShift();
  };

  handleShift = () => {
    let layoutName = this.state.layoutName;

    this.setState({
      layoutName: layoutName === "default" ? "shift" : "default"
    });
  };

  onChangeInput = event => {
    let input = event.target.value;
    this.setState(
      {
        input: input
      },
      () => {
        this.keyboard.setInput(input);
      }
    );
  };

  inputStyle = {
    width: "100%",
    height: "100px",
    padding: "10px",
    fontSize: 20,
    border: 0
  };

  render() {
    return (
      <div>
        <input
          value={this.state.input}
          style={this.inputStyle}
          placeholder={"(99) 9999-9999"}
          readOnly
          //onChange={e => this.onChangeInput(e)}
        />
        <Keyboard
          ref={r => (this.keyboard = r)}
          layoutName={this.state.layoutName}
          onChange={input => this.onChange(input)}
          onKeyPress={button => this.onKeyPress(button)}
          disableCaretPositioning={true}
          inputMask={"(99) 9999-9999"}
          // Pattern to compare letters. Default pattern /[a-z]/i
          //letterCheckPattern{/[a-z]/i},
          modules={[inputMask]}
        />
      </div>
    );
  }
}

export default App;