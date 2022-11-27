import React from "react";
import Row from "./Row.js";
import { generateBoard } from "../utils.js";
import "./Board.css";

class Board extends React.Component {
  renderRows() {
    const {guesses, secretWord, currentGuess} = this.props;
    const board = generateBoard(guesses, secretWord, currentGuess);
    return Array(board.length)
      .fill(null)
      .map((row, i) => <Row key={i} cells={board[i]} />);
  }

  render() {
    return <div className="Board">{this.renderRows()}</div>;
  }
}

export default Board;
