import React, { Component } from "react";
import "./Homepage.css";
import { connect } from "react-redux";
import Slider from "../layout/Slider";
import Notice from "../layout/Notice";
import EventCard from "./EventCard";

class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      homeimages: [],
      notice: {},
      events: []
    };
  }

  static getDerivedStateFromProps(props) {
    if (props.homeimages) {
      return {
        homeimages: props.homeimages,
        notice: props.notice,
        events: props.events
      };
    }
  }

  render() {
    const { homeimages, notice, events } = this.state;
    console.log(homeimages);
    return (
      <div className="homepage">
        <div className="row homepage-content">
          <div className="col-md-9 main-container">
            <Slider images={homeimages} />

            <div className="latest-event">
              <h5>Latest Event</h5>
              <EventCard event={events[0]} />
            </div>
          </div>

          <div className="col-md-3 side-container">
            <Notice text={notice.text} />
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  homeimages: state.data.homeimages,
  notice: state.data.notice,
  events: state.data.allEvents
});

export default connect(
  mapStateToProps,
  null
)(Homepage);
