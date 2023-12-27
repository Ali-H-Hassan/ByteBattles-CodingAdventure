import React from "react";
import "./loginPage.css";

const Login = () => {
  return (
    <div className="login-container">
      {" "}
      <h1>Login</h1>{" "}
      <div className="form-container">
        {" "}
        <label htmlFor="email">Email:</label>{" "}
        <input type="email" id="email" name="email" required />{" "}
        <label htmlFor="password">Password:</label>{" "}
        <input type="password" id="password" name="password" required />{" "}
        <button type="submit">Login</button> <p>Forgot Password?</p>{" "}
      </div>{" "}
      <div className="or-container">
        {" "}
        <hr /> <p>OR</p> <hr />{" "}
      </div>{" "}
      <div className="signup-container">
        {" "}
        <button type="button">Sign Up</button>{" "}
      </div>{" "}
      <p>
        This site is protected by reCAPTCHA and the Google Privacy Policy and
        Terms of Service apply.
      </p>{" "}
    </div>
  );
};

export default Login;
