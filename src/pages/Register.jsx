import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { UserPlus } from "lucide-react";
import { motion } from "framer-motion";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

    try {
      await axios.post("https://quiz-backend-dz0i.onrender.com/api/register", {
        name,
        email,
        password,
      });

      toast.success("Registration successful");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-4">
      <Toaster position="top-right" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8 text-white"
      >
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <UserPlus size={30} />
        </div>

        <h1 className="text-4xl font-black text-center mb-2">Create Account</h1>
        <p className="text-slate-300 text-center mb-8">
          Register to start taking quizzes
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 transition text-white py-3 rounded-2xl font-bold shadow-lg"
          >
            Register
          </button>
        </form>

        <p className="text-center text-slate-300 mt-6">
          Already have account?{" "}
          <a href="/" className="text-blue-300 font-bold hover:text-blue-200">
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;
