import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { resetPassword } from "../../redux/auth/authActions";
import { clearPasswordResetState } from "../../redux/auth/authSlice";
import Header from "../../components/Header/Header";
import "./ResetPasswordPage.css";

const ResetPasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { passwordResetLoading, passwordResetSuccess, passwordResetError } =
    useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: searchParams.get("email") || "",
    token: searchParams.get("token") || "",
    newPassword: "",
    confirmPassword: "",
  });

  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    // Clear password reset state when component mounts
    dispatch(clearPasswordResetState());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    // Validate password length
    if (formData.newPassword.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return;
    }

    const result = await dispatch(resetPassword(formData));
    if (result.success) {
      // Redirect to login after successful reset
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };

  const handleBackToLogin = () => {
    dispatch(clearPasswordResetState());
    navigate("/login");
  };

  // Check if token and email are provided
  const hasRequiredParams = formData.email && formData.token;

  return (
    <div className="reset-password-page">
      <Header />
      <div className="reset-password-body">
        <div className="reset-password-container">
          <h2 className="reset-password-title">Create New Password</h2>

          {!hasRequiredParams ? (
            <div className="reset-password-error-state">
              <div className="error-icon">!</div>
              <h3>Invalid Reset Link</h3>
              <p>
                This password reset link is invalid or has expired. Please request
                a new password reset.
              </p>
              <button onClick={handleBackToLogin} className="reset-password-button">
                Back to Login
              </button>
            </div>
          ) : passwordResetSuccess ? (
            <div className="reset-password-success">
              <div className="success-icon">&#10003;</div>
              <h3>Password Reset Successful</h3>
              <p>
                Your password has been reset successfully. You will be redirected
                to the login page.
              </p>
            </div>
          ) : (
            <>
              <p className="reset-password-description">
                Enter your new password below.
              </p>

              <form onSubmit={handleSubmit} className="reset-password-form">
                <div className="input-group">
                  <input
                    className="input"
                    required
                    type="email"
                    id="email"
                    name="email"
                    placeholder=" "
                    value={formData.email}
                    onChange={handleChange}
                    disabled={passwordResetLoading}
                  />
                  <label className="label" htmlFor="email">
                    Email Address
                  </label>
                </div>

                <div className="input-group">
                  <input
                    className="input"
                    required
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    placeholder=" "
                    value={formData.newPassword}
                    onChange={handleChange}
                    disabled={passwordResetLoading}
                    minLength={6}
                  />
                  <label className="label" htmlFor="newPassword">
                    New Password
                  </label>
                </div>

                <div className="input-group">
                  <input
                    className="input"
                    required
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder=" "
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={passwordResetLoading}
                    minLength={6}
                  />
                  <label className="label" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                </div>

                {(validationError || passwordResetError) && (
                  <div className="error-message">
                    {validationError || passwordResetError}
                  </div>
                )}

                <button
                  type="submit"
                  className="reset-password-button"
                  disabled={passwordResetLoading}
                >
                  {passwordResetLoading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </>
          )}

          {!passwordResetSuccess && hasRequiredParams && (
            <div className="reset-password-links">
              <button onClick={handleBackToLogin} className="back-to-login">
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
