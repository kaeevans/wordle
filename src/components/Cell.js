import React from "react";
import "./Cell.css";

class Cell extends React.Component {
  render() {
    return (
      <div
        className={`Cell ${this.props.className}`}
        data-color-state={this.props.colorState}
        onClick={(e) =>
          this.props.onCellClick ? this.props.onCellClick(e) : false
        }
      >
        {this.props.value}
      </div>
    );
  }
}

export default Cell;
