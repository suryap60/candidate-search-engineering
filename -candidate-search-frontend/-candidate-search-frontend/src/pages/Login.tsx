import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { login } from "../api/authApi";
import { isAuthenticated, setTokens } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If already logged in, navigate directly to /candidates
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/candidates", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await login({
        email: email.trim(),
        password: password.trim(),
      });

      if (response.success && response.data?.accessToken) {
        setTokens(response.data.accessToken, response.data.refreshToken);
        navigate("/candidates");
      } else {
        setError(response.message || "Invalid response received from server.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else if (err.response?.status === 401) {
          setError("Invalid email or password.");
        } else if (!err.response) {
          setError("Unable to connect to the backend server. Please verify the API is running.");
        } else {
          setError(`Login failed with status ${err.response.status}. Please try again.`);
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">CS</div>
          <h1 className="login-title">Candidate Search</h1>
          <p className="login-subtitle">Sign in to access candidate management</p>
        </div>

        {error && (
          <div className="alert alert-error" role="alert" id="login-error-alert">
            <span className="alert-icon">⚠️</span>
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form" id="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email-input">
              Email Address
            </label>
            <input
              id="email-input"
              type="email"
              className="form-input"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password-input">
              Password
            </label>
            <input
              id="password-input"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary login-btn"
            disabled={loading}
            id="login-submit-btn"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}