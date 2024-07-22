import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authUser } from "../Constant/services";
import "./Login.css";

const Login = () => {
  const [formState, setFormState] = useState({
    username: "",
    password: "",
    site: "",
  });
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("token") !== null
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      navigate("/webcam");
    }
  }, [loggedIn]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const submitForm = (e) => {
    e.preventDefault();
    const { username, password } = formState;
    //if (username === "admin" && password === "123") {
    //  localStorage.setItem(
    //    "token",
    //    "hbdhfbsgbjdskhiflasdadfkbeshfbesjbfusubkjahiakdnkndkbagsgduyw"
    //  );
    const res = authUser({ username, password });
    if (res.status == 200) {
      alert("authenticated");
      localStorage.setItem("site-id", formState.site);
      localStorage.setItem("token", res.jwt);
    } else if (res.status == 401) {
      alert("invalid username or password");
    } else {
      alert("server error");
    }
    setLoggedIn(true);
  };

  return (
    <>
      <div className="heading">BAC भारत</div>{" "}
      <div className="container">
        <div className="card">
          <h1 className="heading-text">LogIn</h1>
          <form onSubmit={submitForm}>
            <div className="form-group">
              <label htmlFor="user_login">Username</label>
              <input
                type="text"
                name="username"
                id="user_login"
                value={formState.username}
                onChange={onChange}
                placeholder="username"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="user_pass">Password</label>
              <input
                type="password"
                name="password"
                id="user_pass"
                value={formState.password}
                onChange={onChange}
                placeholder="password"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="site">Select Site</label>
              <select
                name="site"
                id="site"
                value={formState.site}
                required
                onChange={onChange}
              >
                <option value="">Select Site</option>
                <option value="1">site1</option>
                <option value="2">site2</option>
                <option value="3">site3</option>
                <option value="4">site4</option>
                <option value="5">site5</option>
              </select>
            </div>
            <div className="form-group">
              <input type="submit" className="submit" value="Sign In" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
