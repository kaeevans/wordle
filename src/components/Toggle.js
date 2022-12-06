import React from "react";
import Switch from "react-switch";
import "./Toggle.css";

class Toggle extends React.Component {
  render() {
    return (
      <label>
        <span>Hard Mode</span>
        <Switch
          className="Toggle"
          onChange={this.props.setIsHardModeOn}
          checked={this.props.isHardModeOn}
        />
      </label>
    );
  }
}

export default Toggle;
