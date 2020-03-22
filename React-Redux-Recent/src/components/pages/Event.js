import React, { Component } from "react";
import axios from "axios";
import { extractDateString } from "../../utils/utils";
import Timer from "../Timer";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "./Event.css";
import Loader from "../layout/Loader";

class Event extends Component {
  constructor(props) {
    super(props);

    this.state = {
      auth: {},
      event: {},
      loading: true,
      isRegistered: false,
      deadlineEnded: false,
      member2: "",
      member3: "",
      member4: "",
      member5: "",
      teamName: ""
    };
  }

  static getDerivedStateFromProps(props) {
    if (props.auth) {
      return {
        auth: props.auth
      };
    }
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    const auth = this.props.auth;

    axios
      .get(`https://api-msi-event-manager.now.sh/event/${id}`)
      .then(res => {
        if (res.data) {
          this.setState({ event: res.data, loading: false }, () => {
            if (auth.isAuthenticated) {
              if (res.data.type === "MULTIPLE") {
                const { usersRegistered } = this.state.event;

                const ifRegistered = usersRegistered.filter(
                  team =>
                    team.Member_1_Email === auth.user.email ||
                    team.Member_2_Email === auth.user.email ||
                    team.Member_3_Email === auth.user.email ||
                    team.Member_4_Email === auth.user.email ||
                    team.Member_5_Email === auth.user.email
                );

                if (ifRegistered.length > 0) {
                  this.setState({ isRegistered: true });
                }
              } else {
                const { usersRegistered } = this.state.event;
                const ifRegistered = usersRegistered.filter(
                  user => user.user.toString() === this.state.auth.user.id
                );

                if (ifRegistered.length > 0) {
                  this.setState({ isRegistered: true });
                }
              }
            }
          });
        }
      })
      .catch(err => {
        if (err.response) {
          console.log(err.response.data);
        } else {
          console.log(err);
        }
      });
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onClickRegisterSingle = () => {
    const { user, isAuthenticated } = this.state.auth;
    if (isAuthenticated) {
      if (user.isProfileCreated) {
        const { _id } = this.state.event;
        const user_id = this.state.auth.user.id;

        axios
          .get(`https://api-msi-event-manager.now.sh/profile/${user_id}`)
          .then(res => {
            if (res.data) {
              axios
                .post(
                  `https://api-msi-event-manager.now.sh/event/${_id}/register-user`,
                  { user: res.data }
                )
                .then(res => {
                  if (res.data) {
                    this.setState({ isRegistered: true });
                    axios
                      .put(
                        "https://api-msi-event-manager.now.sh/profile/add-registered-event/id",
                        { eventId: _id }
                      )
                      .then(res => {
                        if (res.data) {
                          console.log("registered!");
                        }
                      })
                      .catch(err => {
                        console.log(err);
                      });
                  }
                })
                .catch(err => console.log(err));
            }
          });
      } else {
        alert("Please create your profile to register on an event.");
        this.props.history.push("/user/profile");
      }
    } else {
      this.props.history.push("/login");
    }
  };

  toggleTeamForm = () => {
    const { isAuthenticated } = this.state.auth;
    if (isAuthenticated) {
      const { event } = this.state;
      const form = document.querySelector(`#team-${event._id.toString()}`);
      form.classList.toggle("team-register-show");
    } else {
      this.props.history.push("/login");
    }
  };

  CloseMultiForm = () => {
    const { event } = this.state;
    const form = document.querySelector(`#team-${event._id.toString()}`);
    form.classList.remove("team-register-show");
  };

  onClickRegisterMultiple = e => {
    e.preventDefault();
    const { user } = this.state.auth;

    if (user.isProfileCreated) {
      const { auth, event, teamName } = this.state;
      const { _id } = this.state.event;
      let users = [];
      users.push(auth.user.email);

      for (let i = 0; i < event.members - 1; i++) {
        users.push(this.state[`member${i + 2}`]);
      }
      console.log(users);
      axios
        .post("https://api-msi-event-manager.now.sh/profile/emails", {
          emails: users
        })
        .then(res => {
          if (res.data) {
            const { _id } = this.state.event;
            let registerData = {};
            registerData.teamName = teamName;
            res.data.map((profile, i) => {
              registerData[`Member_${i + 1}_Name`] = profile.fullName;
              registerData[`Member_${i + 1}_Email`] = profile.email;
              registerData[`Member_${i + 1}_Phone`] = profile.phone;
              registerData[`Member_${i + 1}_E_ID`] = profile.enrollment_id;
              registerData[`Member_${i + 1}_Course`] = profile.course;
              registerData[`Member_${i + 1}_Institute`] = profile.institute;
            });

            axios
              .post(
                `https://api-msi-event-manager.now.sh/event/${_id}/register-user`,
                { user: registerData, type: event.type }
              )
              .then(res => {
                if (res.data) {
                  this.setState({ isRegistered: true });
                  this.CloseMultiForm();
                  users.forEach(email => {
                    axios
                      .put(
                        "https://api-msi-event-manager.now.sh/profile/add-registered-event/email",
                        { email, eventId: _id }
                      )
                      .then(res => {
                        if (res.data) {
                          console.log("success");
                        }
                      })
                      .catch(err => console.log(err));
                  });
                }
              });
          }
        });
    } else {
      alert("Please create your profile to register on an event.");
      this.props.history.push("/user/profile");
    }
  };

  endDeadline = () => {
    this.setState({ deadlineEnded: true });
  };

  render() {
    const { event, loading, auth, deadlineEnded, isRegistered } = this.state;

    let registerButton = <></>;

    if (event.type === "MULTIPLE") {
      registerButton = (
        <button onClick={this.toggleTeamForm} className="event-register">
          Submit Team
        </button>
      );
    } else {
      registerButton = (
        <button className="event-register" onClick={this.onClickRegisterSingle}>
          Register
        </button>
      );
    }

    if (loading) {
      return <Loader />;
    } else {
      return (
        <div className="container">
          {event.type === "MULTIPLE" && (
            <form
              id={`team-${event._id.toString()}`}
              className="team-register"
              onSubmit={this.onClickRegisterMultiple}
            >
              <button
                type="button"
                className="btn-close"
                onClick={this.CloseMultiForm}
              >
                x
              </button>

              <h2 className="heading">
                Submit Team ({`${event.members} Members`})
              </h2>
              <div>
                <strong>Leader: </strong>
                {auth.user.email}
              </div>
              {[...Array(event.members - 1)].map((e, i) => (
                <>
                  <input
                    type="email"
                    name={`member${i + 2}`}
                    placeholder={`Email of team member ${i + 2}`}
                    onChange={this.onChange}
                    required
                  />
                </>
              ))}
              <input
                type="text"
                name="teamName"
                placeholder="Team Name"
                onChange={this.onChange}
                value={this.state.teamName}
              ></input>
              <button>Submit</button>
            </form>
          )}

          <div className="event">
            <h1>{event.title}</h1>
            <h5>{event.type === "MULTIPLE" ? "Team Event" : "Single Event"}</h5>
            <div className="event-image">
              <img src={event.image.url} />
            </div>
            <p className="event-date">
              <strong>Date: </strong> {extractDateString(event.date)}
            </p>
            <p>{event.description}</p>

            <div className="event-deadline">
              <strong>Registration Deadline:</strong>
              <span className="deadline">
                {extractDateString(event.deadline)}
              </span>
              <Timer deadline={event.deadline} endDeadline={this.endDeadline} />
            </div>

            <div className="footer">
              <div className="venue">
                <strong>Venue:</strong> {event.venue}
              </div>

              {deadlineEnded ? (
                <div>Registration Closed!</div>
              ) : (
                <>
                  {auth.user.role === "STUDENT" ||
                  auth.user.role === "ADMIN" ||
                  auth.isAuthenticated === false ? (
                    <>
                      {isRegistered ? (
                        <button className="event-register" disabled>
                          Registered
                        </button>
                      ) : (
                        registerButton
                      )}
                    </>
                  ) : null}
                </>
              )}

              {auth.isAuthenticated &&
              (auth.user.role === "SUPER_ADMIN" ||
                auth.user.role === "ADMIN") ? (
                <button
                  className="event-register"
                  onClick={() =>
                    this.props.history.push(
                      `/event/${this.props.match.params.id}/registered`
                    )
                  }
                >
                  Users Registered
                </button>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps, null)(withRouter(Event));
