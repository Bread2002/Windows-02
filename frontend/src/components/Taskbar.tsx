import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function formatTime(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

export default function Taskbar() {
  const [time, setTime] = useState(() => formatTime(new Date()));
  const navigate = useNavigate();

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  function handleStart() {
    sessionStorage.removeItem("win02_authed");
    navigate("/login");
  }

  return (
    <div className="taskbar">
      <button className="taskbar-start" onClick={handleStart}>
        <div
          className="login-logo"
          aria-hidden="true"
          style={{ width: "16px", height: "16px" }}
        />
        Start
      </button>

      <div className="taskbar-divider" />

      <div className="taskbar-tray" aria-label="System clock">
        {time}
      </div>
    </div>
  );
}
