import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [formState, setFormState] = useState({
    username: "",
    password: "",
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
    if (username === "admin" && password === "123") {
      localStorage.setItem(
        "token",
        "hbdhfbsgbjdskhiflasdadfkbeshfbesjbfusubkjahiakdnkndkbagsgduyw"
      );
      setLoggedIn(true);
    }
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
              <input type="submit" className="submit" value="Sign In" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
