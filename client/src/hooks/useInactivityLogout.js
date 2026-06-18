import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// inactivityLimitMs and warningMs can be customized for testing
export default function useInactivityLogout({
  isActive = true,
  onLogout,
  warningMs = 5 * 60 * 1000,
  inactivityLimitMs = 2 * 60 * 60 * 1000,
} = {}) {
  const lastActivityRef = useRef(Date.now());
  const timerRef = useRef(null);
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeftMs, setTimeLeftMs] = useState(inactivityLimitMs);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isActive) return;

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
    ];

    const updateActivity = () => {
      lastActivityRef.current = Date.now();
      if (showWarning) setShowWarning(false);
    };

    events.forEach((ev) => window.addEventListener(ev, updateActivity));

    timerRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastActivityRef.current;
      const remaining = inactivityLimitMs - elapsed;
      setTimeLeftMs(Math.max(0, remaining));

      if (elapsed >= inactivityLimitMs) {
        // perform logout
        if (onLogout) onLogout();
        else {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } else if (elapsed >= inactivityLimitMs - warningMs) {
        setShowWarning(true);
      }
    }, 60 * 1000); // check every minute

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, updateActivity));
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, onLogout, warningMs, inactivityLimitMs, navigate, showWarning]);

  const stayLoggedIn = () => {
    lastActivityRef.current = Date.now();
    setShowWarning(false);
  };

  const logoutNow = () => {
    if (onLogout) onLogout();
    else {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return { showWarning, timeLeftMs, stayLoggedIn, logoutNow };
}
