import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import apiClient from "../services/apiConfig";

const GoogleCallbackHandler = () => {
  const navigate = useNavigate();
  const { setAuthState } = useContext(AuthContext);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      apiClient
        .post("/api/auth/google/callback", { code })
        .then((response) => {
          setAuthState({
            isAuthenticated: true,
            user: response.data.user,
            token: response.data.token,
          });
          navigate("/login");
        })
        .catch((error) => {
          console.error("Error handling Google auth:", error);
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, [navigate, setAuthState]);

  return <div>Loading...</div>;
};

export default GoogleCallbackHandler;
