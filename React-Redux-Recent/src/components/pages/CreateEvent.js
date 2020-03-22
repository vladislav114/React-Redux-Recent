import React, { Component } from "react";
import { connect } from "react-redux";
import { registerEvent } from "../../actions/dataActions";

class CreateEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      venue: "",
      deadline: "",
      description: "",
      date: "",
      type: "SINGLE",
      errors: {},
      auth: {},
      dateNow: "",
      img: null,
      members: null
    };
  }

  static getDerivedStateFromProps(props) {
    if (props.auth) {
      return {
        auth: props.auth,
        errors: props.errors
      };
    }
  }

  componentDidMount() {
    const dateNow = new Date();
    const date = dateNow.getDate();
    const month = dateNow.getMonth() + 1;
    const year = dateNow.getFullYear();
    const d = `${year}-${month}-${date}`;
    this.setState({ dateNow: d });
  }

  onChange = e => {
    switch (e.target.name) {
      case "img":
        this.setState({ img: e.target.files[0] });
        break;

      default:
        this.setState({ [e.target.name]: e.target.value });
    }
  };

  onSubmit = e => {
    e.preventDefault();
    const { id } = this.state.auth.user;
    const {
      date,
      title,
      venue,
      description,
      deadline,
      img,
      type,
      members
    } = this.state;

    console.log(this.state);

    const data = new FormData(); // using FormData to send file to the server
    data.append("creator", id);
    data.append("title", title);
    data.append("venue", venue);
    data.append("description", description);
    data.append("imgFile", img);
    data.append("deadline", deadline);
    data.append("date", date);
    data.append("type", type);

    if (type === "MULTIPLE") {
      data.append("members", members);
    }

    this.props.registerEvent(data, this.props.history);
  };

  render() {
    const { dateNow, type } = this.state;
    return (
      <div className="form">
        <form onSubmit={this.onSubmit}>
          <h4 className="heading">Add Event</h4>
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={this.state.title}
            onChange={this.onChange}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={this.state.description}
            onChange={this.onChange}
          />
          <input
            type="text"
            name="venue"
            placeholder="Venue"
            value={this.state.venue}
            onChange={this.onChange}
          />
          <label>Date </label>
          <input
            type="date"
            name="date"
            value={this.state.date}
            onChange={this.onChange}
            min={dateNow}
          />
          <label>Type Of Event</label>
          <div className="form__radio">
            <input
              className="radio"
              type="radio"
              name="type"
              value="SINGLE"
              onChange={this.onChange}
              required
            />{" "}
            <span>Single</span>
            <input
              className="radio"
              type="radio"
              name="type"
              value="MULTIPLE"
              onChange={this.onChange}
              required
            />{" "}
            <span>Team</span>
          </div>
          {type === "MULTIPLE" ? (
            <>
              <label>Number Of Members In A Team: </label>
              <input
                placeholder="Min: 2, Max: 5"
                name="members"
                type="number"
                min={2}
                max={5}
                onChange={this.onChange}
                required
              />
            </>
          ) : (
            <></>
          )}
          <label>Deadline </label>
          <input
            type="date"
            name="deadline"
            value={this.state.deadline}
            onChange={this.onChange}
            min={dateNow}
          />
          <input
            onChange={this.onChange}
            type="file"
            name="img"
            placeholder="upload image for the event"
            required
          />
          <button>Submit</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps, { registerEvent })(CreateEvent);
