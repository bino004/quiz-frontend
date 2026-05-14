import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { LogOut, Search, BookOpen, ArrowRight } from "lucide-react";

function UserDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState("");

  const [attempts, setAttempts] = useState([]);

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    getQuizzes();
    getAttempts();
  }, []);

  async function getQuizzes() {
    const res = await axios.get(
      "https://quiz-backend-dz0i.onrender.com/api/quizzes",
      authConfig,
    );
    setQuizzes(res.data);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  }

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(search.toLowerCase()),
  );

  async function getAttempts() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    const res = await axios.get(
      `https://quiz-backend-dz0i.onrender.com/api/user/${user.id}/attempts`,
      authConfig,
    );
    setAttempts(res.data);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">
      <header className="px-5 sm:px-8 py-5 flex flex-col sm:flex-row justify-between gap-4 sm:items-center border-b border-white/10 bg-white/10 backdrop-blur-xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black">QuizPro</h1>
          <p className="text-slate-300">
            Welcome back, {user?.name || "Student"} 👋
          </p>
        </div>

        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 active:scale-95 transition px-5 py-3 rounded-xl font-semibold shadow-lg"
        >
          <LogOut size={18} />
          Logout
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-6 sm:p-10 mb-8 bg-white/10 border border-white/10 backdrop-blur-2xl shadow-2xl"
        >
          <div className="absolute -top-20 -right-20 w-56 h-56 bg-blue-500/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-purple-500/30 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <p className="uppercase tracking-widest text-blue-200 text-sm mb-2">
              Student Dashboard
            </p>
            <h2 className="text-3xl sm:text-5xl font-black mb-3">
              Choose your next quiz
            </h2>
            <p className="text-slate-300 max-w-2xl">
              Practice, improve your knowledge, and review your answers after
              submission with explanations.
            </p>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold">Available Quizzes</h2>
            <p className="text-slate-300">
              {filteredQuizzes.length} quiz available
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-4 top-3.5 text-slate-400"
              size={20}
            />
            <input
              className="w-full bg-white/10 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search quizzes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filteredQuizzes.length === 0 ? (
          <div className="bg-white/10 border border-white/10 rounded-3xl p-10 text-center">
            <p className="text-slate-300">No quizzes found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredQuizzes.map((quiz, index) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                }}
                className="relative overflow-hidden rounded-[32px] bg-white/10 border border-white/10 backdrop-blur-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] group"
              >
                {/* Glow Effects */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all duration-500"></div>

                <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-all duration-500"></div>

                {/* Top Row */}
                <div className="relative z-10 flex items-start justify-between mb-5">
                  <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:rotate-6 transition">
                    <BookOpen size={26} className="text-white" />
                  </div>

                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wide ${
                      quiz.level === "Easy"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/20"
                        : quiz.level === "Intermediate"
                          ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/20"
                          : "bg-red-500/20 text-red-300 border border-red-400/20"
                    }`}
                  >
                    {quiz.level}
                  </span>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-white mb-3 line-clamp-1">
                    {quiz.title}
                  </h3>

                  <p className="text-slate-300 leading-relaxed min-h-[72px] text-sm mb-5">
                    {quiz.description || "No description added for this quiz."}
                  </p>

                  {/* Info Cards */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
                      <p className="text-slate-400 text-xs mb-1">Timer</p>

                      <h4 className="text-lg font-black text-purple-300">
                        {quiz.timer || 5} min
                      </h4>
                    </div>

                    <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
                      <p className="text-slate-400 text-xs mb-1">Difficulty</p>

                      <h4 className="text-lg font-black text-cyan-300">
                        {quiz.level}
                      </h4>
                    </div>
                  </div>

                  {/* Button */}
                  <a
                    href={`/quiz/${quiz.id}`}
                    className="group/button flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                  >
                    Start Quiz
                    <ArrowRight
                      size={20}
                      className="group-hover/button:translate-x-1 transition"
                    />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        <div className="mt-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <p className="uppercase tracking-widest text-blue-200 text-sm mb-1">
                Performance
              </p>

              <h2 className="text-3xl font-black text-white">
                My Attempt History
              </h2>

              <p className="text-slate-300 mt-1">
                Review your previous quiz attempts and scores.
              </p>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-2xl px-5 py-4 text-center min-w-[140px]">
              <p className="text-slate-300 text-sm">Total Attempts</p>
              <h2 className="text-3xl font-black text-white">
                {attempts.length}
              </h2>
            </div>
          </div>
          {attempts.length === 0 ? (
            <div className="bg-white/10 border border-white/10 rounded-3xl p-8 text-center">
              <p className="text-slate-300">No attempts yet.</p>
            </div>
          ) : (
            <div className="bg-white/95 text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-white/20">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="w-1/3 p-4 text-center">Quiz</th>
                    <th className="w-1/3 p-4 text-center">Score</th>
                    <th className="w-1/3 p-4 text-center">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {attempts.map((a) => (
                    <tr key={a.id} className="border-t hover:bg-slate-50">
                      <td className="w-1/3 p-4 text-center font-semibold">
                        {a.quiz_title}
                      </td>
                      <td className="w-1/3 p-4 text-center">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">
                          {a.score} / {a.total}
                        </span>
                      </td>

                      <td className="w-1/3 p-4 text-center text-slate-500">
                        {new Date(a.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default UserDashboard;
