import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { forgotPassword } from "../../redux/auth/authActions";
import { clearPasswordResetState } from "../../redux/auth/authSlice";
import Header from "../../components/Header/Header";
import "./ForgotPasswordPage.css";

const ForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { passwordResetLoading, passwordResetSuccess, passwordResetError, passwordResetToken } =
    useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Clear password reset state when component mounts
    dispatch(clearPasswordResetState());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(forgotPassword(email));
    if (result.success) {
      setSubmitted(true);
    }
  };

  const handleBackToLogin = () => {
    dispatch(clearPasswordResetState());
    navigate("/login");
  };

  return (
    <div className="forgot-password-page">
      <Header />
      <div className="forgot-password-body">
        <div className="forgot-password-container">
          <h2 className="forgot-password-title">Reset Password</h2>

          {!submitted ? (
            <>
              <p className="forgot-password-description">
                Enter your email address and we'll send you instructions to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="forgot-password-form">
                <div className="input-group">
                  <input
                    className="input"
                    required
                    type="email"
                    id="email"
                    name="email"
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={passwordResetLoading}
                  />
                  <label className="label" htmlFor="email">
                    Email Address
                  </label>
                </div>

                {passwordResetError && (
                  <div className="error-message">{passwordResetError}</div>
                )}

                <button
                  type="submit"
                  className="forgot-password-button"
                  disabled={passwordResetLoading}
                >
                  {passwordResetLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </>
          ) : (
            <div className="forgot-password-success">
              <div className="success-icon">&#10003;</div>
              <h3>Check Your Email</h3>
              <p>
                If an account exists with <strong>{email}</strong>, you will receive
                password reset instructions.
              </p>

              {/* Development mode: Show reset token */}
              {passwordResetToken && (
                <div className="dev-token-info">
                  <p className="dev-note">Development Mode - Reset Token:</p>
                  <code className="reset-token">{passwordResetToken}</code>
                  <Link
                    to={`/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(passwordResetToken)}`}
                    className="reset-link"
                  >
                    Click here to reset password
                  </Link>
                </div>
              )}
            </div>
          )}

          <div className="forgot-password-links">
            <button onClick={handleBackToLogin} className="back-to-login">
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
