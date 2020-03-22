import React, { Component } from "react";
import "./Notice.css";

class Notice extends Component {
  static defaultProps = {
    text: "There is currently no notice!"
  };

  render() {
    return (
      <div className="notice">
        <h4>Notice</h4>
        <p>{this.props.text}</p>
      </div>
    );
  }
}

export default Notice;
