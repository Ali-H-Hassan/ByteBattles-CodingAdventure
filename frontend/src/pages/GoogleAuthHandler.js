// GoogleAuthHandler.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axios from "axios";

const GoogleAuthHandler = () => {
  const navigate = useNavigate();
  const { setAuthState } = useAuth();

  useEffect(() => {
    const exchangeCodeForToken = async () => {
      // Extract the code from URL query
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        try {
          // Post the code to your backend to exchange for tokens
          const response = await axios.post(
            "http://localhost:3000/auth/google/callback",
            { code }
          );
          // Set auth state and token in local storage
          setAuthState({
            isAuthenticated: true,
            user: response.data.user,
            token: response.data.token,
          });
          localStorage.setItem("token", response.data.token);
          // Redirect to home or dashboard
          navigate("/");
        } catch (error) {
          console.error("Error exchanging code for token:", error);
          // Handle error, possibly redirect to an error page or login page
          navigate("/login");
        }
      }
    };

    exchangeCodeForToken();
  }, [navigate, setAuthState]);

  return <div>Processing Google Authentication...</div>;
};

export default GoogleAuthHandler;
