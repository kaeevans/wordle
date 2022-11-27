import React from "react";
import Cell from "./Cell.js";
import "./Row.css";

class Row extends React.Component {
  renderCells() {
    return this.props.cells.map((cell, i) => (
      <Cell key={i} {...cell} onCellClick={this.props.onCellClick} />
    ));
  }

  render() {
    return <div className="Row">{this.renderCells()}</div>;
  }
}

export default Row;
