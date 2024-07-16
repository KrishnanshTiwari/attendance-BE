import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formState, setFormState] = useState({
    username: "",
    password: "",
  });
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("token") !== null);

  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      navigate('/webcam');
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
      localStorage.setItem("token", "hbdhfbsgbjdskhiflasdadfkbeshfbesjbfusubkjahiakdnkndkbagsgduyw");
      setLoggedIn(true);
    }
  };

  return (
    <div>
      <div className="container card border pt-5 pb-5" style={{ width: "350px" }}>
        <h1 className="text-center">LogIn</h1>
        <form onSubmit={submitForm}>
          <div className="form-group mt-4">
            <label htmlFor="user_login">Username</label>
            <input
              type="text"
              name="username"
              id="user_login"
              className="form-control"
              value={formState.username}
              onChange={onChange}
              placeholder="username"
              required
            />
          </div>
          <div className="form-group mt-4">
            <label htmlFor="user_pass">Password</label>
            <input
              type="password"
              name="password"
              id="user_pass"
              className="form-control"
              value={formState.password}
              onChange={onChange}
              placeholder="password"
              required
            />
          </div>
          <div className="form-group mt-4">
            <input
              type="submit"
              className="btn btn-primary w-100"
              value="Sign In"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
