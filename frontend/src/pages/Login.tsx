import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "/api/auth/login",
        {
          email: email.trim(),
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const token = response.data;

      if (!token || typeof token !== "string") {
        throw new Error("Invalid token received");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("email", email.trim());

      const tokenParts = token.split(".");

      if (tokenParts.length !== 3) {
        throw new Error("Invalid JWT format");
      }

      const payload = JSON.parse(
        atob(tokenParts[1])
      );

      const role = payload.role;
      const tokenEmail = payload.sub;

      localStorage.setItem("role", role);

      if (tokenEmail) {
        localStorage.setItem("email", tokenEmail);
      }

      console.log("Login successful");
      console.log("Role:", role);

      switch (role) {
        case "MANAGER":
          navigate("/manager");
          break;

        case "DISPATCHER":
          navigate("/dashboard");
          break;

        case "TECHNICIAN":
          navigate("/technician");
          break;

        case "CUSTOMER":
          navigate("/customer-portal");
          break;

        default:
          navigate("/dashboard");
          break;
      }

    } catch (err) {
      console.error("LOGIN ERROR:", err);

      if (axios.isAxiosError(err)) {
        console.error("Status:", err.response?.status);
        console.error("Response:", err.response?.data);

        if (err.response?.status === 401) {
          setError("Invalid email or password.");
        } else if (err.response?.status === 403) {
          setError("Access denied.");
        } else {
          setError(
            `Server error: ${err.response?.status || "unknown"}`
          );
        }
      } else {
        setError("Unable to login.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-header">
          <h1>KEYSTONE</h1>
          <p>Field Service Management Platform</p>
        </div>

        <form onSubmit={handleLogin}>

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

        <div className="login-footer">
          <p>KEYSTONE • Service Management</p>
        </div>

      </div>
    </div>
  );
}