import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authUser, getAllSites } from "../Constant/services";
import "./Login.css";

const Login = () => {
  const [formState, setFormState] = useState({
    username: "",
    password: "",
    site: "",
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const [sites, setSites] = useState([]);

  const navigate = useNavigate();

  const fetchSitesData = async () => {
    try {
      const sitesRes = await getAllSites();
      setSites(sitesRes);
    } catch (error) {
      console.error("Failed to fetch sites:", error);
    }
  };

  useEffect(() => {
    const checkTokenAndFetchSites = async () => {
      if (localStorage.getItem("token")) {
        setLoggedIn(true);
      } else {
        await fetchSitesData();
      }
    };

    checkTokenAndFetchSites();
  }, []);

  useEffect(() => {
    if (loggedIn) {
      navigate("/webcam");
    }
  }, [loggedIn, navigate]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const { username, password, site } = formState;

    try {
      const res = await authUser({ username, password });
      if (!res.username) {
        alert("Invalid username or password");
      } else if (res.username === username && res.password === password) {
        localStorage.setItem("site-id", site);
        localStorage.setItem("token", res.jwt);
        setLoggedIn(true);
      } else {
        alert("Server error");
      }
    } catch (error) {
      console.error("Error during authentication", error);
    }
  };

  return (
    <>
      <div className="heading">BAC भारत</div>
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
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
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
