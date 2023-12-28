import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    token: localStorage.getItem("token"),
  });

  // Function to handle login
  const login = (user, token) => {
    setAuthState({ isAuthenticated: true, user, token });
    localStorage.setItem("token", token);
  };

  // Function to handle logout
  const logout = () => {
    setAuthState({ isAuthenticated: false, user: null, token: null });
    localStorage.removeItem("token");
  };

  // Function to handle registration
  const register = (user, token) => {
    setAuthState({ isAuthenticated: true, user, token });
    localStorage.setItem("token", token);
  };

  return (
    <AuthContext.Provider
      value={{ authState, setAuthState, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};
