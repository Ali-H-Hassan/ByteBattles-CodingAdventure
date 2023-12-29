import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const GoogleCallbackHandler = () => {
  const navigate = useNavigate();
  const { setAuthState } = useContext(AuthContext);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      // Replace with the actual endpoint in your backend that handles the Google code
      axios
        .post("http://localhost:3000/api/auth/google/callback", { code })
        .then((response) => {
          // Update authentication state
          setAuthState({
            isAuthenticated: true,
            user: response.data.user,
            token: response.data.token,
          });

          // Redirect user to the login page after successful authentication
          navigate("/login");
        })
        .catch((error) => {
          console.error("Error handling Google auth:", error);
          // Redirect to login page on error
          navigate("/login");
        });
    } else {
      // If no code is present, redirect to the login page
      navigate("/login");
    }
  }, [navigate, setAuthState]);

  return <div>Loading...</div>;
};

export default GoogleCallbackHandler;
