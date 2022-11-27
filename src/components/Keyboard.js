import React from "react";
import Row from "./Row";
import { generateKeyboard } from "../utils";
import "./Keyboard.css";

class Keyboard extends React.Component {
  renderKeyboardRows() {
    const { guesses, secretWord } = this.props;
    const keyboard = generateKeyboard(guesses, secretWord);
    return Array(keyboard.length)
      .fill(null)
      .map((row, i) => (
        <Row key={i} cells={keyboard[i]} onCellClick={this.props.onCellClick} />
      ));
  }

  render() {
    return <div className="Keyboard">{this.renderKeyboardRows()}</div>;
  }
}

export default Keyboard;
