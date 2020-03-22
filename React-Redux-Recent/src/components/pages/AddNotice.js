import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getLatestNotice } from "../../actions/dataActions";
class AddNotice extends Component {
  constructor() {
    super();
    this.state = {
      text: ""
    };
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const { text } = this.state;
    axios
      .post("https://api-msi-event-manager.now.sh/notice/add", { text })
      .then(res => {
        if (res.data) {
          this.props.getLatestNotice();
          this.props.history.push("/dashboard");
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <div className="form">
        <form onSubmit={this.onSubmit}>
          <h4 className="heading">Add Notice</h4>
          <textarea
            name="text"
            value={this.state.text}
            onChange={this.onChange}
            placeholder="Add short descriptive notice (Max Words: 250)"
          />
          <button>Submit</button>
        </form>
      </div>
    );
  }
}

export default connect(
  null,
  { getLatestNotice }
)(withRouter(AddNotice));
