import { useState } from "react";

interface Props {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogOn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        onLogin();
      } else {
        setError(data.message ?? "Invalid username or password.");
      }
    } catch {
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-screen">
      <div className="window login-window">
        <div className="title-bar">
          <div className="title-bar-text">Welcome to Windows ʼ02</div>
        </div>

        <div className="window-body">
          <div className="login-header">
            <div
              className="login-logo"
              aria-hidden="true"
              style={{ width: "56px", height: "56px" }}
            />
            <div>
              <p style={{ margin: "0 0 4px", fontWeight: "bold" }}>
                Windows ʼ02
              </p>
              <p style={{ margin: 0 }}>
                Please enter a user name and password to log on.
              </p>
            </div>
          </div>

          <form onSubmit={handleLogOn}>
            <div className="login-form-fields">
              <div className="field-row-stacked">
                <label htmlFor="username">
                  <u>U</u>ser name:
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  autoComplete="username"
                />
              </div>

              <div className="field-row-stacked">
                <label htmlFor="password">
                  <u>P</u>assword:
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && <p className="login-error">{error}</p>}

            <div className="login-buttons">
              <button type="submit" disabled={loading}>
                Log On
              </button>
              <button type="button" onClick={onLogin} disabled={loading}>
                Continue as Guest
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
