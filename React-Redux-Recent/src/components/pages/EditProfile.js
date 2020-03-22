import React, { Component } from "react";
import { connect } from "react-redux";
import { registerProfile } from "../../actions/dataActions";
// import { getCurrentUser } from "../../actions/authActions";
import { withRouter } from "react-router-dom";
import Axios from "axios";
import Loader from "../layout/Loader";

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: {},
      name: "",
      institute: "",
      course: "",
      phone: "",
      enrollment_id: "",
      errors: {},
      semester: "",
      section: "",
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
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/login");
    }

    Axios.get("https://api-msi-event-manager.now.sh/profile/").then(res => {
      if (res.data) {
        const {
          fullName,
          enrollment_id,
          institute,
          email,
          phone,
          course,
          semester,
          section
        } = res.data;

        this.setState({
          loading: false,
          name: fullName,
          enrollment_id,
          institute,
          email,
          phone,
          course,
          semester,
          section
        });
      }
    });
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const {
      name,
      auth,
      institute,
      phone,
      course,
      enrollment_id,
      semester,
      section
    } = this.state;
    const user = auth.user.id;
    const email = auth.user.email;
    const data = {
      fullName: name,
      email,
      user,
      enrollment_id,
      phone,
      course,
      institute,
      semester,
      section
    };

    Axios.post("https://api-msi-event-manager.now.sh/profile/edit", data)
      .then(res => {
        if (res.data) {
          this.props.history.push("/user/profile");
        }
      })
      .catch(err => console.log(err));
  };

  render() {
    const { loading } = this.state;
    if (loading) {
      return <Loader />;
    } else
      return (
        <div className="form">
          <form onSubmit={this.onSubmit}>
            <h4 className="heading">Edit Profile</h4>
            <input
              type="text"
              name="name"
              value={this.state.name}
              placeholder="Full Name"
              onChange={this.onChange}
              required
            />
            <br />
            <input
              type="text"
              name="enrollment_id"
              value={this.state.enrollment_id}
              placeholder="Enrollment ID"
              onChange={this.onChange}
              required
            />
            {this.state.errors.enrollment_id && this.state.errors.enrollment_id}
            <br />
            <input
              type="text"
              name="phone"
              value={this.state.phone}
              placeholder="Phone Number"
              onChange={this.onChange}
              required
            />
            {this.state.errors.phone && this.state.errors.phone}
            <br />
            <select
              name="course"
              onChange={this.onChange}
              defaultValue={this.state.course}
              required
            >
              <option value="" disabled>
                Select Course
              </option>
              <option value="BCA" selected={this.state.course === "BCA"}>
                BCA
              </option>
              <option value="B.COM." selected={this.state.course === "B.COM."}>
                B.COM.
              </option>
              <option value="BBA" selected={this.state.course === "BBA"}>
                BBA
              </option>
              <option value=">B.ED." selected={this.state.course === "B.ED."}>
                B.ED.
              </option>
            </select>
            <br />

            <input
              type="text"
              name="semester"
              value={this.state.semester}
              placeholder="Semester"
              onChange={this.onChange}
              required
            />
            <br />
            <input
              type="text"
              name="section"
              value={this.state.section}
              placeholder="Section"
              onChange={this.onChange}
              required
            />
            <br />

            <select name="institute" onChange={this.onChange} required>
              <option value="" disabled>
                Select Institute
              </option>
              <option
                value="Maharaja Surajmal Institute"
                selected={
                  this.state.institute === "Maharaja Surajmal Insititute"
                }
              >
                Maharaja Surajmal Institute
              </option>
            </select>
            <br></br>
            <button type="submit">Submit</button>
          </form>
        </div>
      );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { registerProfile })(
  withRouter(EditProfile)
);
