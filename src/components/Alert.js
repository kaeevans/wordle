import React from "react";
import "./Alert.css";

class Alert extends React.Component {
  render() {
    if (this.props.alertShouldFade) {
      setTimeout(() => this.props.dismissAlert());
    }
    return (
      <div
        className={`alert ${
          this.props.isAlertVisible ? "alert-shown" : "alert-hidden"
        }`}
      >
        <div className="alert-inner">{this.props.alertText}</div>
      </div>
    );
  }
}

export default Alert;
