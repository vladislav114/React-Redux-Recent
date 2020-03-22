import React, { Component } from "react";
import { Link } from "react-router-dom";
import { logoutUser } from "../../actions/authActions";
import { connect } from "react-redux";
import "./Navbar.css";
import HamburgerIcon from "./HamburgerIcon";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: {}
    };
  }

  static getDerivedStateFromProps(props) {
    if (props.auth) {
      return {
        auth: props.auth
      };
    }
  }

  onClickLogout = () => {
    if (window.confirm("Are you sure? Please confirm")) {
      this.props.logoutUser(this.props.history);
    }
  };

  not_logged_in = (
    <>
      <li className="nav-item">
        <Link to="/login" className="nav-link">
          <button className="button-dark">Login</button>
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/register" className="nav-link">
          <button className="button-dark">Register</button>
        </Link>
      </li>
    </>
  );

  logged_in = state => (
    <>
      <div className="btn-group dropleft">
        <button
          type="button"
          className="btn btn-secondary dropdown-toggle button-dark"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {state.auth.user.name}
        </button>
        <div className="dropdown-menu">
          {state.auth.user.role === "ADMIN" ||
          state.auth.user.role === "SUPER_ADMIN" ? (
            <Link className="dropdown-item" to="/dashboard">
              Dashboard
            </Link>
          ) : (
            <></>
          )}

          {state.auth.user.role !== "SUPER_ADMIN" ? (
            <Link className="dropdown-item" to="/user/profile">
              Profile
            </Link>
          ) : (
            <></>
          )}

          <button onClick={this.onClickLogout} className="dropdown-item">
            Logout
          </button>
        </div>
      </div>
    </>
  );

  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg">
          <div className="navbar-brand">
            <Link to="/">
              <strong> MSI Events</strong>
            </Link>
          </div>

          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <HamburgerIcon />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item active">
                <Link className="nav-link" to="/">
                  Home <span className="sr-only">(current)</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/events">
                  Events
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">
                  Contact
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav ml-auto ">
              {this.state.auth.isAuthenticated
                ? this.logged_in(this.state)
                : this.not_logged_in}
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logoutUser })(Navbar);
