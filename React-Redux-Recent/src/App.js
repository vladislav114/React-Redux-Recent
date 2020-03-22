import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import "./App.css";
import store from "./store";
import Homepage from "./components/pages/Homepage";
import setAuthToken from "./utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import {
  getHomeImages,
  getAllEvents,
  getLatestNotice
} from "./actions/dataActions";
import Navbar from "./components/layout/Navbar";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Events from "./components/pages/Events";
import Profile from "./components/pages/Profile";
import CreateProfile from "./components/pages/CreateProfile";
import CreateEvent from "./components/pages/CreateEvent";
import Dashboard from "./components/pages/Dashboard";
import Test from "./components/Test";
import Event from "./components/pages/Event";
import UserRegistered from "./components/pages/UserRegistered";
import LoadingScreen from "react-loading-screen";
import isEmpty from "./validation/is-empty";
import logo from "./logo.png";
import AddNotice from "./components/pages/AddNotice";
import EditEvent from "./components/pages/EditEvent";
import AddHomeImage from "./components/pages/AddHomeImage";

import "./components/pages/Form.css";
import EditProfile from "./components/pages/EditProfile";
import Users from "./components/pages/Users";
import About from "./components/pages/About";
import Contact from "./components/pages/Contact";

store.dispatch(getHomeImages());
store.dispatch(getAllEvents());
store.dispatch(getLatestNotice());

if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "/";
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    store.subscribe(() => {
      this.setState({
        loading: !store.getState().data.imagesLoaded
      });
    });
  }

  render() {
    const state = store.getState();
    const { loading } = this.state;
    return (
      <Provider store={store}>
        <LoadingScreen
          loading={loading}
          bgColor="#226b80"
          spinnerColor="#9ee5f8"
          textColor="white"
          logoSrc={logo}
          text="Hi there. Welcome to MSI Events"
        >
          <div className="App">
            <Router>
              <Navbar />
              <Route exact path="/" component={Homepage} />
              <Route exact path="/events" component={Events} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/user/profile" component={Profile} />
              <Route exact path="/user/profile/edit" component={EditProfile} />
              <Route
                exact
                path="/user/profile/create"
                component={CreateProfile}
              />
              <Switch>
                <Route exact path="/event/create" component={CreateEvent} />
                <Route exact path="/event/edit/:id" component={EditEvent} />

                <Route exact path="/event/:id" component={Event} />
                <Route
                  exact
                  path="/event/:id/registered"
                  component={UserRegistered}
                />
              </Switch>
              <Route exact path="/dashboard" component={Dashboard} />
              <Route exact path="/dashboard/users" component={Users} />
              <Route
                exact
                path="/dashboard/home/image/add"
                component={AddHomeImage}
              />

              <Route exact path="/notice/add" component={AddNotice} />
              <Route exact path="/about" component={About} />
              <Route exact path="/contact" component={Contact} />

              <Route exact path="/test" component={Test} />
            </Router>
          </div>
        </LoadingScreen>
      </Provider>
    );
  }
}

export default App;
