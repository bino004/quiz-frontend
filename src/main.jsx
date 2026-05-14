
import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import AuthCallback from "./AuthCallback";


import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TakeQuiz from "./pages/TakeQuiz";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import IdleHandler from "./components/IdleHandler";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <IdleHandler />
    <Routes>
      <Route
        path="/"
        element={
          localStorage.getItem("token") ? (
            JSON.parse(localStorage.getItem("user"))?.role === "admin" ? (
              <Navigate to="/admin" />
            ) : (
              <Navigate to="/user" />
            )
          ) : (
            <Login />
          )
        }
      />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRole="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/quiz/:id"
        element={
          <ProtectedRoute allowedRole="user">
            <TakeQuiz />
          </ProtectedRoute>
        }
      />
    </Routes>
    <Route path="/auth/callback" element={<AuthCallback />} />
  </BrowserRouter>,
);