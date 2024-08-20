import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function RefreshHandler({ setIsAuthenticated, setUserRole }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);

      if (location.pathname === "/login" || location.pathname === "/") {
        if (role.toLowerCase() === "teacher" || role.toLowerCase() === "student") {
          navigate("/user-dashboard", { replace: true });
        } else {
          navigate(`/${role.toLowerCase()}-dashboard`, { replace: true });
        }
      }
    }
  }, [location, navigate, setIsAuthenticated, setUserRole]);

  return null;
}

export default RefreshHandler;
