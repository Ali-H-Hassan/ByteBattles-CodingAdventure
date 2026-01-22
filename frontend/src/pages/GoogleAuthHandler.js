import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import apiClient from "../services/apiConfig";

const GoogleAuthHandler = () => {
  const navigate = useNavigate();
  const { setAuthState } = useAuth();

  useEffect(() => {
    const exchangeCodeForToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        try {
          const response = await apiClient.post(
            "/auth/google/callback",
            { code }
          );
          setAuthState({
            isAuthenticated: true,
            user: response.data.user,
            token: response.data.token,
          });
          localStorage.setItem("token", response.data.token);
          navigate("/");
        } catch (error) {
          console.error("Error exchanging code for token:", error);
          navigate("/login");
        }
      }
    };

    exchangeCodeForToken();
  }, [navigate, setAuthState]);

  return <div>Processing Google Authentication...</div>;
};

export default GoogleAuthHandler;
