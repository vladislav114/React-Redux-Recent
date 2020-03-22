import React, { Component } from "react";
import { connect } from "react-redux";
import { getAllEvents } from "../../actions/dataActions";
import "./Events.css";
import EventCard from "./EventCard";
class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
  }

  static getDerivedStateFromProps(props) {
    if (props.events) {
      return {
        events: props.events
      };
    }
  }
  componentDidMount() {
    this.props.getAllEvents();
  }

  render() {
    const { events } = this.state;
    return (
      <div className="container events">
        <h1>Events</h1>
        <hr />

        {events.map((event, index) => (
          <EventCard key={index + event._id} event={event} />
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  events: state.data.allEvents
});
export default connect(
  mapStateToProps,
  { getAllEvents }
)(Events);
