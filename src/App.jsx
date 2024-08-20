import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PrincipalDashboard from "./components/PrincipalDashboard";
import Home from "./components/Home";
import Login from "./components/Login";
import UserDashboard from "./components/UserDashboard";
import RefreshHandler from "./components/RefreshHandler";

const PrivateRoute = ({ element, isAuthenticated }) => {
  return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Initialize authentication state from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  return (
    <Router>
      <RefreshHandler
        setIsAuthenticated={setIsAuthenticated}
        setUserRole={setUserRole}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/user-dashboard"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={
                <UserDashboard
                  setIsAuthenticated={setIsAuthenticated}
                  setUserRole={setUserRole}
                />
              }
            />
          }
        />
        <Route
          path="/principal-dashboard"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={
                <PrincipalDashboard
                  setIsAuthenticated={setIsAuthenticated}
                  setUserRole={setUserRole}
                />
              }
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
