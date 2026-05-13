import {
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  Users,
  BarChart3,
  LogOut,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [quizId, setQuizId] = useState("");
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correct, setCorrect] = useState("");

  const [users, setUsers] = useState([]);
  const [results, setResults] = useState([]);
  const [explanation, setExplanation] = useState("");

  const [quizzes, setQuizzes] = useState([]);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editQuestion, setEditQuestion] = useState({});

  const [quizSearch, setQuizSearch] = useState("");
  const [questionSearch, setQuestionSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [resultSearch, setResultSearch] = useState("");

  const [activeTab, setActiveTab] = useState("dashboard");

  const [level, setLevel] = useState("Easy");

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    getResults();
    getQuizzes();
    getQuestions();
    getUsers();
  }, []);

  async function getResults() {
    try {
      const res = await axios.get(
        "https://quiz-backend-dz0i.onrender.com/api/admin/results",
        authConfig,
      );
      setResults(res.data);
    } catch (err) {
      console.log("Error fetching results");
    }
  }

  async function getQuizzes() {
    const res = await axios.get(
      "https://quiz-backend-dz0i.onrender.com/api/quizzes",
      authConfig,
    );
    setQuizzes(res.data);
  }

  async function getUsers() {
    try {
      const res = await axios.get(
        "https://quiz-backend-dz0i.onrender.com/api/admin/users",
        authConfig,
      );
      setUsers(res.data);
    } catch (err) {
      console.log("Error fetching users");
    }
  }

  async function createQuiz(e) {
    e.preventDefault();

    try {
      await axios.post(
        "https://quiz-backend-dz0i.onrender.com/api/quizzes",
        {
          title,
          description,
          level,
        },
        authConfig,
      );

      toast.success("Quiz created successfully");
      setTitle("");
      setDescription("");
      setLevel("Easy");

      getQuizzes();
    } catch (err) {
      toast.error("Error creating quiz");
    }
  }

  async function addQuestion(e) {
    e.preventDefault();

    try {
      await axios.post(
        "https://quiz-backend-dz0i.onrender.com/api/questions",
        {
          quiz_id: quizId,
          question,
          option_a: optionA,
          option_b: optionB,
          option_c: optionC,
          option_d: optionD,
          correct_answer: correct,
          explanation,
        },
        authConfig,
      );
      toast.success("Question added successfully");
      setQuizId("");
      setQuestion("");
      setOptionA("");
      setOptionB("");
      setOptionC("");
      setOptionD("");
      setCorrect("");
      setExplanation("");
      getQuestions();
    } catch (err) {
      toast.error("Error adding question");
    }
  }

  async function getQuestions() {
    const res = await axios.get(
      "https://quiz-backend-dz0i.onrender.com/api/questions",
      authConfig,
    );
    setQuestions(res.data);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  }

  function startEditQuiz(quiz) {
    setEditingQuiz(quiz.id);
    setEditTitle(quiz.title);
    setEditDescription(quiz.description);
  }

  async function updateQuiz(id) {
    try {
      await axios.put(
        `https://quiz-backend-dz0i.onrender.com/api/quizzes/${id}`,
        {
          title: editTitle,
          description: editDescription,
          level,
        },
        authConfig,
      );

      toast.success("Quiz Updated");
      setEditingQuiz(null);
      getQuizzes();
    } catch (err) {
      toast.error("Error updating Quiz");
    }
  }

  async function deleteQuiz(id) {
    const confirmDelete = confirm("Are you sure you want to delete this quiz?");

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://quiz-backend-dz0i.onrender.com/api/quizzes/${id}`,
        authConfig,
      );
      toast.success("Quiz Deleted");
      getQuizzes();
    } catch (err) {
      toast.error("Error Deleting Quiz");
    }
  }

  function startEditQuestion(q) {
    setEditingQuestion(q.id);
    setEditQuestion(q);
  }

  async function updateQuestion(id) {
    await axios.put(
      `https://quiz-backend-dz0i.onrender.com/api/questions/${id}`,
      editQuestion,
      authConfig,
    );
    toast.success("Question Updated");
    setEditingQuestion(null);
    getQuestions();
  }

  async function deleteQuestion(id) {
    if (!confirm("Delete this question?")) return;

    await axios.delete(
      `https://quiz-backend-dz0i.onrender.com/api/questions/${id}`,
      authConfig,
    );
    toast.error("Question deleted");
    getQuestions();
  }

  const quizChartData = quizzes.map((quiz) => {
    const quizAttempts = results.filter((r) => r.quiz_title === quiz.title);

    return {
      name: quiz.title,
      attempts: quizAttempts.length,
    };
  });

  const scoreChartData = [
    {
      name: "Users",
      value: users.length,
    },
    {
      name: "Quizzes",
      value: quizzes.length,
    },
    {
      name: "Questions",
      value: questions.length,
    },
    {
      name: "Attempts",
      value: results.length,
    },
  ];
  const filteredQuizzes = quizzes.filter((q) =>
    q.title.toLowerCase().includes(quizSearch.toLowerCase()),
  );

  const filteredQuestions = questions.filter(
    (q) =>
      q.question.toLowerCase().includes(questionSearch.toLowerCase()) ||
      q.quiz_title.toLowerCase().includes(questionSearch.toLowerCase()),
  );

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()),
  );

  const filteredResults = results.filter(
    (r) =>
      r.name.toLowerCase().includes(resultSearch.toLowerCase()) ||
      r.quiz_title.toLowerCase().includes(resultSearch.toLowerCase()),
  );

  async function deleteAttempt(id) {
    if (!confirm("Delete this result?")) return;

    await axios.delete(
      `https://quiz-backend-dz0i.onrender.com/api/attempts/${id}`,
      authConfig,
    );
    toast.success("Result deleted");
    getResults();
  }

  async function deleteUser(id) {
    if (!confirm("Delete this user? This may also delete their attempts."))
      return;

    try {
      await axios.delete(
        `https://quiz-backend-dz0i.onrender.com/api/admin/users/${id}`,
        authConfig,
      );
      toast.success("User deleted");
      getUsers();
      getResults();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting user");
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
      <Toaster position="top-right" />
      {/* SIDEBAR */}
      <aside className="w-full md:w-72 md:min-h-screen md:sticky md:top-0 bg-white/10 backdrop-blur-xl border-b md:border-b-0 md:border-r border-white/10 text-white p-5">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-white">QuizPro</h2>
          <p className="text-slate-400 text-sm mt-1">Admin Panel</p>
        </div>

        <nav className="grid grid-cols-2 md:grid-cols-1 gap-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              activeTab === "dashboard"
                ? "bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:scale-95 transition-all text-white px-5 py-3 rounded-xl font-semibold"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab("quizzes")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              activeTab === "quizzes"
                ? "bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:scale-95 transition-all text-white px-5 py-3 rounded-xl font-semibold"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <BookOpen size={20} />
            Quizzes
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab("questions")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              activeTab === "questions"
                ? "bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:scale-95 transition-all text-white px-5 py-3 rounded-xl font-semibold"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <HelpCircle size={20} />
            Questions
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setActiveTab("users");
              getUsers();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              activeTab === "users"
                ? "bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:scale-95 transition-all text-white px-5 py-3 rounded-xl font-semibold"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Users size={20} />
            Users
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setActiveTab("results");
              getResults();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              activeTab === "results"
                ? "bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:scale-95 transition-all text-white px-5 py-3 rounded-xl font-semibold"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <BarChart3 size={20} />
            Results
          </motion.button>
        </nav>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={logout}
          className="w-full flex items-center gap-3 bg-red-500 hover:bg-red-600 px-4 py-3 rounded-xl mt-10 font-semibold transition"
        >
          <LogOut size={20} />
          Logout
        </motion.button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-2xl bg-gradient-to-r from-slate-800/90 via-slate-800/80 to-blue-900/80 border border-white/10">
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-500/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl"></div>

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <p className="text-sm uppercase tracking-widest text-blue-200 mb-2">
                  Quiz Platform
                </p>

                <h1 className="text-3xl sm:text-5xl font-black capitalize text-white">
                  {activeTab}
                </h1>

                <p className="text-slate-200 mt-3 max-w-2xl text-base sm:text-lg">
                  Manage quizzes, users, analytics, and performance from one
                  modern dashboard.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/10 border border-white/10 rounded-2xl px-5 py-4 text-center">
                  <p className="text-blue-100 text-sm">Users</p>
                  <h2 className="text-2xl font-bold text-white">
                    {users.length}
                  </h2>
                </div>

                <div className="bg-white/10 border border-white/10 rounded-2xl px-5 py-4 text-center">
                  <p className="text-blue-100 text-sm">Quizzes</p>
                  <h2 className="text-2xl font-bold text-white">
                    {quizzes.length}
                  </h2>
                </div>

                <div className="bg-white/10 border border-white/10 rounded-2xl px-5 py-4 text-center">
                  <p className="text-blue-100 text-sm">Attempts</p>
                  <h2 className="text-2xl font-bold text-white">
                    {results.length}
                  </h2>
                </div>
              </div>
            </div>
          </div>
          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-blue-600 text-white p-6 rounded-2xl shadow">
                  <p>Total Users</p>
                  <h2 className="text-4xl font-bold">{users.length}</h2>
                </div>

                <div className="bg-purple-600 text-white p-6 rounded-2xl shadow">
                  <p>Total Quizzes</p>
                  <h2 className="text-4xl font-bold">{quizzes.length}</h2>
                </div>

                <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow">
                  <p>Total Questions</p>
                  <h2 className="text-4xl font-bold">{questions.length}</h2>
                </div>

                <div className="bg-orange-500 text-white p-6 rounded-2xl shadow">
                  <p>Total Attempts</p>
                  <h2 className="text-4xl font-bold">{results.length}</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white rounded-2xl shadow p-6">
                  <h2 className="text-xl font-bold mb-4">Quiz Attempts</h2>

                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={quizChartData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="attempts" fill="#2563eb" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow p-6">
                  <h2 className="text-xl font-bold mb-4">Platform Overview</h2>

                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={scoreChartData}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={100}
                          label
                        >
                          {scoreChartData.map((entry, index) => (
                            <Cell
                              key={index}
                              fill={
                                ["#2563eb", "#9333ea", "#059669", "#f97316"][
                                  index
                                ]
                              }
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* QUIZZES TAB */}
          {activeTab === "quizzes" && (
            <div className="space-y-6">
              {/* Create Quiz */}
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-2xl shadow-xl border border-white/40"
              >
                <h2 className="font-bold mb-4">Create Quiz</h2>
                <form onSubmit={createQuiz} className="space-y-3">
                  <input
                    className="w-full border border-slate-300 bg-white/80 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                  />
                  <input
                    className="w-full border border-slate-300 bg-white/80 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                  />

                  <select
                    className="w-full border border-slate-300 bg-white/80 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Hard">Hard</option>
                  </select>

                  <button className="bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:scale-95 transition-all text-white px-5 py-3 rounded-xl font-semibold">
                    Create
                  </button>
                </form>
              </motion.div>

              {/* Manage Quizzes */}
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white/95 backdrop-blur-xl p-5 sm:p-6 rounded-3xl shadow-2xl border border-white/40"
              >
                <h2 className="text-xl font-bold mb-4 text-slate-800">
                  Manage Quizzes
                </h2>

                <input
                  className="w-full mb-4 border border-slate-300 bg-white/80 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Search quizzes..."
                  value={quizSearch}
                  onChange={(e) => setQuizSearch(e.target.value)}
                />

                <div className="space-y-4">
                  {filteredQuizzes.map((q) => (
                    <div
                      key={q.id}
                      className="border rounded-xl p-4 bg-slate-50"
                    >
                      {editingQuiz === q.id ? (
                        <div className="space-y-3">
                          <input
                            className="w-full border border-slate-300 bg-white/80 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                          />

                          <input
                            className="w-full border border-slate-300 bg-white/80 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                          />

                          <div className="flex gap-3">
                            <button
                              onClick={() => updateQuiz(q.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] transition text-white px-5 py-3 rounded-xl font-semibold shadow"
                            >
                              Save
                            </button>

                            <button
                              onClick={() => setEditingQuiz(null)}
                              className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center gap-4">
                          <div>
                            <h3 className="font-bold text-slate-800">
                              {q.title}
                            </h3>
                            <p className="text-slate-500">{q.description}</p>
                            <p className="text-xs text-slate-400">ID: {q.id}</p>
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => startEditQuiz(q)}
                              className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => deleteQuiz(q.id)}
                              className="bg-red-500 hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5 active:scale-95 transition-all text-white px-4 py-2 rounded-xl font-semibold"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {/* QUESTIONS TAB */}
          {activeTab === "questions" && (
            <div className="space-y-6">
              {/* Add Question */}
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-2xl shadow-xl border border-white/40"
              >
                <h2 className="font-bold mb-4">Add Question</h2>

                <form onSubmit={addQuestion} className="space-y-3">
                  <select
                    value={quizId}
                    onChange={(e) => setQuizId(e.target.value)}
                    className="w-full border border-slate-300 bg-white/80 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="">Select Quiz</option>
                    {quizzes.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.title}
                      </option>
                    ))}
                  </select>

                  <input
                    className="w-full border border-slate-300 bg-white/80 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Question"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      className="w-full border border-slate-300 bg-white/80 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={optionA}
                      onChange={(e) => setOptionA(e.target.value)}
                      placeholder="Option A"
                    />

                    <input
                      className="w-full border border-slate-300 bg-white/80 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={optionB}
                      onChange={(e) => setOptionB(e.target.value)}
                      placeholder="Option B"
                    />

                    <input
                      className="w-full border border-slate-300 bg-white/80 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={optionC}
                      onChange={(e) => setOptionC(e.target.value)}
                      placeholder="Option C"
                    />

                    <input
                      className="w-full border border-slate-300 bg-white/80 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      value={optionD}
                      onChange={(e) => setOptionD(e.target.value)}
                      placeholder="Option D"
                    />
                  </div>
                  <input
                    className="w-full border border-slate-300 bg-white/80 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={correct}
                    onChange={(e) => setCorrect(e.target.value)}
                    placeholder="Correct Answer"
                  />

                  <textarea
                    className="w-full border border-slate-300 bg-white/80 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Explanation"
                  />

                  <button className="bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] transition text-white px-5 py-3 rounded-xl font-semibold shadow">
                    Add Question
                  </button>
                </form>
              </motion.div>
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-2xl shadow-xl border border-white/40"
              >
                <h2 className="font-bold mb-4">Manage Questions</h2>

                <input
                  className="w-full mb-4 border border-slate-300 bg-white/80 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Search questions or quiz title..."
                  value={questionSearch}
                  onChange={(e) => setQuestionSearch(e.target.value)}
                />

                <div className="space-y-4">
                  {filteredQuestions.map((q) => (
                    <div key={q.id} className="border rounded-xl p-4">
                      {editingQuestion === q.id ? (
                        <div className="space-y-3">
                          <input
                            className="w-full border border-slate-300 bg-white/80 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            value={editQuestion.question}
                            onChange={(e) =>
                              setEditQuestion({
                                ...editQuestion,
                                question: e.target.value,
                              })
                            }
                          />

                          <input
                            className="w-full border border-slate-300 bg-white/80 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            value={editQuestion.option_a}
                            onChange={(e) =>
                              setEditQuestion({
                                ...editQuestion,
                                option_a: e.target.value,
                              })
                            }
                          />

                          <input
                            className="w-full border border-slate-300 bg-white/80 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            value={editQuestion.option_b}
                            onChange={(e) =>
                              setEditQuestion({
                                ...editQuestion,
                                option_b: e.target.value,
                              })
                            }
                          />

                          <input
                            className="w-full border border-slate-300 bg-white/80 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            value={editQuestion.option_c}
                            onChange={(e) =>
                              setEditQuestion({
                                ...editQuestion,
                                option_c: e.target.value,
                              })
                            }
                          />

                          <input
                            className="w-full border border-slate-300 bg-white/80 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            value={editQuestion.option_d}
                            onChange={(e) =>
                              setEditQuestion({
                                ...editQuestion,
                                option_d: e.target.value,
                              })
                            }
                          />

                          <input
                            className="w-full border border-slate-300 bg-white/80 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            value={editQuestion.correct_answer}
                            onChange={(e) =>
                              setEditQuestion({
                                ...editQuestion,
                                correct_answer: e.target.value,
                              })
                            }
                          />

                          <textarea
                            className="w-full border rounded-xl px-4 py-3"
                            value={editQuestion.explanation || ""}
                            onChange={(e) =>
                              setEditQuestion({
                                ...editQuestion,
                                explanation: e.target.value,
                              })
                            }
                          />

                          <div className="flex gap-3">
                            <button
                              onClick={() => updateQuestion(q.id)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg"
                            >
                              Save
                            </button>

                            <button
                              onClick={() => setEditingQuestion(null)}
                              className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between gap-4">
                          <div>
                            <p className="text-sm text-slate-500">
                              {q.quiz_title}
                            </p>
                            <h3 className="font-bold text-slate-800">
                              {q.question}
                            </h3>
                            <p className="text-slate-600">
                              Correct: {q.correct_answer}
                            </p>
                            <p className="text-slate-500">
                              Explanation: {q.explanation || "No explanation"}
                            </p>
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => startEditQuestion(q)}
                              className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => deleteQuestion(q.id)}
                              className="bg-red-500 hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5 active:scale-95 transition-all text-white px-4 py-2 rounded-xl font-semibold"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {/* USERS */}
          {activeTab === "users" && (
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white/95 backdrop-blur-xl p-5 sm:p-6 rounded-3xl shadow-2xl border border-white/40"
            >
              <h2 className="text-xl font-bold mb-4">Registered Users</h2>

              <input
                className="w-full mb-4 border border-slate-300 bg-white/80 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Search users by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-4 text-left">Name</th>
                      <th className="p-4 text-left">Email</th>
                      <th className="p-4 text-left">Role</th>
                      <th className="p-4 text-left">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="border-t hover:bg-slate-50">
                        <td className="p-4 font-semibold">{u.name}</td>
                        <td className="p-4 text-slate-600">{u.email}</td>
                        <td className="p-4">
                          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => deleteUser(u.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-semibold"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* RESULTS */}
          {activeTab === "results" && (
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white/95 backdrop-blur-xl p-5 sm:p-6 rounded-3xl shadow-2xl border border-white/40"
            >
              <h2 className="text-xl font-bold mb-4">User Results</h2>
              <input
                className="w-full mb-4 border border-slate-300 bg-white/80 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Search results by user or quiz..."
                value={resultSearch}
                onChange={(e) => setResultSearch(e.target.value)}
              />
              <div className="overflow-x-auto">
                <table className="min-w-[700px] w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-4 text-left">Name</th>
                      <th className="p-4 text-left">Quiz</th>
                      <th className="p-4 text-left">Score</th>
                      <th className="p-4 text-left">Date</th>
                      <th className="p-4 text-left">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredResults.map((r) => (
                      <tr key={r.id} className="border-t hover:bg-slate-50">
                        <td className="p-4 font-semibold">{r.name}</td>
                        <td className="p-4">{r.quiz_title}</td>
                        <td className="p-4">
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                            {r.score} / {r.total}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500">
                          {new Date(r.created_at).toLocaleString()}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => deleteAttempt(r.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

export default AdminDashboard;
