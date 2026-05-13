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
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz, index) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="group bg-white/95 text-slate-900 rounded-3xl p-6 shadow-2xl border border-white/40"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-5 group-hover:scale-110 transition">
                  <BookOpen size={22} />
                </div>

                <span
                  className={`inline-block mb-4 px-3 py-1 rounded-full text-sm font-bold ${
                    quiz.level === "Easy"
                      ? "bg-green-100 text-green-700"
                      : quiz.level === "Intermediate"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {quiz.level}
                </span>

                <h3 className="text-2xl font-black mb-2">{quiz.title}</h3>

                <p className="text-slate-600 min-h-[56px] mb-6">
                  {quiz.description || "No description added."}
                </p>

                <a
                  href={`/quiz/${quiz.id}`}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 transition text-white py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/20"
                >
                  Take Quiz
                  <ArrowRight size={18} />
                </a>
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
