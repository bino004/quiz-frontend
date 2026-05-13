import { useState } from "react";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function resetPassword(e) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.post(
        "https://quiz-backend-dz0i.onrender.com/api/reset-password",
        {
          email,
          newPassword,
        },
      );

      alert("Password changed successfully. Please login.");
      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.message || "Reset failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Reset Password</h1>

        <form onSubmit={resetPassword} className="space-y-4">
          <input
            className="w-full border rounded-lg px-4 py-3"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full border rounded-lg px-4 py-3"
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input
            className="w-full border rounded-lg px-4 py-3"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold">
            Change Password
          </button>
        </form>

        <p className="text-center mt-5">
          <a href="/" className="text-blue-600 font-semibold">
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
