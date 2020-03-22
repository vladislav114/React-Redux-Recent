import React, { Component } from "react";
import { connect } from "react-redux";
import { registerEvent } from "../../actions/dataActions";
import Axios from "axios";
import Loader from "../layout/Loader";
import { withRouter } from "react-router-dom";

class EditEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      venue: "",
      deadline: "",
      description: "",
      date: "",
      errors: {},
      auth: {},
      img: null,
      image: {},
      loading: true
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
    const id = this.props.match.params.id;
    Axios.get(`https://api-msi-event-manager.now.sh/event/${id}`).then(res => {
      if (res.data) {
        const { date, title, venue, deadline, image, description } = res.data;
        this.setState(
          {
            title,
            venue,
            deadline,
            image,
            description,
            date
          },
          () => {
            const { deadline, date } = this.state;
            const deadL = new Date(deadline);
            const eventDate = new Date(date);

            const dateDl = deadL.getDate();
            const monthDl = deadL.getMonth() + 1;
            const yearDl = deadL.getFullYear();
            const defaultDeadline = `${yearDl}-${monthDl}-${dateDl}`;

            const dateE = eventDate.getDate();
            const monthE = eventDate.getMonth() + 1;
            const yearE = eventDate.getFullYear();
            const defaultDate = `${yearE}-${monthE}-${dateE}`;

            this.setState({
              deadline: defaultDeadline,
              date: defaultDate,
              loading: false
            });
          }
        );
      }
    });
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
    const { title, venue, description, image, deadline, img } = this.state;

    const data = new FormData(); // using FormData to send file to the server
    data.append("creator", id);
    data.append("title", title);
    data.append("venue", venue);
    data.append("description", description);
    if (img !== null) data.append("imgFile", img);
    data.append("deadline", deadline);
    data.append("image_prev", JSON.stringify(image));

    Axios.put(
      `https://api-msi-event-manager.now.sh/event/${this.props.match.params.id}`,
      data
    )
      .then(res => {
        if (res.data) {
          this.props.history.push(`/event/${this.props.match.params.id}`);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const { loading } = this.state;

    if (!loading) {
      return (
        <div className="form">
          <form onSubmit={this.onSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Event Title"
              value={this.state.title}
              onChange={this.onChange}
            />
            <br />
            <textarea
              name="description"
              placeholder="Description"
              value={this.state.description}
              onChange={this.onChange}
            />
            <br />
            <input
              type="text"
              name="venue"
              placeholder="Venue"
              value={this.state.venue}
              onChange={this.onChange}
            />
            <br />
            <label>Deadline</label>
            <input
              type="date"
              name="deadline"
              value={this.state.deadline}
              onChange={this.onChange}
            />
            <br />
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={this.state.date}
              onChange={this.onChange}
            />
            <br />
            <label>Add New Image</label>
            <input
              onChange={this.onChange}
              type="file"
              name="img"
              placeholder="upload image for the event"
            />
            <br />
            <button>Submit</button>
          </form>
        </div>
      );
    } else {
      return <Loader />;
    }
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps, { registerEvent })(
  withRouter(EditEvent)
);
