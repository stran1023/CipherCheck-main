<<<<<<< HEAD
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AnalyzePage from "./pages/AnalyzePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AnalyzePage />} />
      </Routes>
    </Router>
=======
import React, { useContext } from "react";
import RegisterPage from "./pages/RegisterPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AnalyzePage from "./pages/AnalyzePage";
import LoginPage from "./pages/LoginPage";
import { AuthProvider, AuthContext } from "./context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/analyze"
            element={
              <PrivateRoute>
                <AnalyzePage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/analyze" />} />
        </Routes>
      </Router>
    </AuthProvider>
>>>>>>> ec52b92a43e2401691ce1765d83b68d7054d4330
  );
}

export default App;
