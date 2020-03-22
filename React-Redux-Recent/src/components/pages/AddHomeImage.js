import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { getHomeImages } from "../../actions/dataActions";
import { connect } from "react-redux";

class AddHomeImage extends Component {
  constructor() {
    super();
    this.state = {
      image: null,
      msg: ""
    };
  }

  onChangeInput = e => {
    switch (e.target.name) {
      case "image":
        this.setState({ image: e.target.files[0] });
        break;

      default:
        this.setState({ [e.target.name]: e.target.value });
    }
  };

  onUpload = e => {
    e.preventDefault();

    const { image, id, msg } = this.state;
    let data = new FormData();

    const event = {
      id,
      msg
    };

    data.append("image", image);
    data.append("event", JSON.stringify(event));

    axios //https://api-msi-event-manager.now.sh/image/home/add
      .post("https://api-msi-event-manager.now.sh/image/home/add", data)
      .then(res => {
        if (res.data) {
          this.props.getHomeImages();
          this.props.history.push("/dashboard");
        }
      });
  };

  render() {
    return (
      <div className="form">
        <form onSubmit={this.onUpload}>
          <h4 className="heading">Add Home Image</h4>
          <br />
          <input
            type="text"
            name="id"
            onChange={this.onChangeInput}
            placeholder="Event ID"
          />
          <br />
          <input
            type="text"
            name="msg"
            onChange={this.onChangeInput}
            placeholder="A short message for the event"
          />
          <br />
          <input type="file" name="image" onChange={this.onChangeInput} />
          <button>Upload</button>
        </form>
      </div>
    );
  }
}

export default connect(
  null,
  { getHomeImages }
)(withRouter(AddHomeImage));
