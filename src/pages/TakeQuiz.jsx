import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Home,
} from "lucide-react";

function TakeQuiz() {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const storageKey = `quiz-progress-${id}`;

  useEffect(() => {
    getQuestions();
  }, []);

  

  useEffect(() => {
    if (score !== null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [score, questions, answers]);


  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(storageKey));

    if (saved) {
      setAnswers(saved.answers || {});
      setCurrentQuestion(saved.currentQuestion || 0);
      setTimeLeft(saved.timeLeft || 300);
    }
  }, []);

  useEffect(() => {
    if (score !== null) return;

    localStorage.setItem(
      storageKey,
      JSON.stringify({
        answers,
        currentQuestion,
        timeLeft,
      }),
    );
  }, [answers, currentQuestion, timeLeft, score]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (score === null) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [score]);

  async function getQuestions() {
    const res = await axios.get(
      `https://quiz-backend-dz0i.onrender.com/api/quizzes/${id}/questions`,
      authConfig,
    );
    setQuestions(res.data);
  }

  function handleAnswer(questionId, answer) {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  }

  async function submitQuiz() {
    if (score !== null) return;

    let totalScore = 0;

    questions.forEach((q) => {
      if (answers[q.id] === q.correct_answer) {
        totalScore++;
      }
    });

    setScore(totalScore);
    localStorage.removeItem(storageKey);

    const user = JSON.parse(localStorage.getItem("user"));

    try {
      await axios.post(
        "https://quiz-backend-dz0i.onrender.com/api/attempts",
        {
          user_id: user.id,
          quiz_id: id,
          score: totalScore,
          total: questions.length,
        },
        authConfig,
      );
    } catch (error) {
      alert("Score shown, but not saved to database");
    }
  }

  const answeredCount = Object.keys(answers).length;
  const progress =
    questions.length > 0
      ? Math.round((answeredCount / questions.length) * 100)
      : 0;

  const current = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 mb-6 bg-white/10 border border-white/10 backdrop-blur-2xl shadow-2xl">
          <div className="absolute -top-20 -right-20 w-56 h-56 bg-blue-500/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-purple-500/30 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="uppercase tracking-widest text-blue-200 text-sm mb-2">
                Quiz Session
              </p>
              <h1 className="text-3xl sm:text-5xl font-black">Take Quiz</h1>
              <p className="text-slate-300 mt-2">
                Answer each question carefully. Review will appear after submit.
              </p>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-3">
              <Clock className="text-red-300" />
              <div>
                <p className="text-slate-300 text-sm">Time Left</p>
                <h2 className="text-2xl font-bold">
                  {Math.floor(timeLeft / 60)}:
                  {String(timeLeft % 60).padStart(2, "0")}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {score === null && (
          <div className="bg-white/10 border border-white/10 rounded-3xl p-5 mb-6 backdrop-blur-xl">
            <div className="flex justify-between text-sm text-slate-300 mb-2">
              <span>
                Progress: {answeredCount}/{questions.length}
              </span>
              <span>{progress}%</span>
            </div>

            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {score === null && current && (
          <div className="grid lg:grid-cols-[1fr_280px] gap-6">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/95 text-slate-900 rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/40"
            >
              <p className="text-blue-600 font-bold mb-3">
                Question {currentQuestion + 1} of {questions.length}
              </p>

              <h2 className="text-2xl font-black mb-6">{current.question}</h2>

              {[
                ["A", current.option_a],
                ["B", current.option_b],
                ["C", current.option_c],
                ["D", current.option_d],
              ].map(([letter, text]) => (
                <label
                  key={letter}
                  className={`flex gap-4 items-center border rounded-2xl px-5 py-4 mb-4 cursor-pointer transition ${
                    answers[current.id] === letter
                      ? "border-blue-600 bg-blue-50 shadow-md"
                      : "border-slate-200 hover:border-blue-400 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${current.id}`}
                    className="hidden"
                    checked={answers[current.id] === letter}
                    onChange={() => handleAnswer(current.id, letter)}
                  />

                  <span
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                      answers[current.id] === letter
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {letter}
                  </span>

                  <span className="font-medium">{text}</span>
                </label>
              ))}

              <div className="flex justify-between mt-8">
                <button
                  disabled={currentQuestion === 0}
                  onClick={() => setCurrentQuestion(currentQuestion - 1)}
                  className="flex items-center gap-2 bg-slate-700 text-white px-5 py-3 rounded-xl disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  <ArrowLeft size={18} />
                  Previous
                </button>

                <button
                  disabled={currentQuestion === questions.length - 1}
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  Next
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>

            <div className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-3xl p-5 h-fit">
              <h3 className="font-bold mb-4">Question Palette</h3>

              <div className="grid grid-cols-5 gap-3">
                {questions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-10 h-10 rounded-xl font-bold transition ${
                      currentQuestion === index
                        ? "bg-blue-600 text-white"
                        : answers[q.id]
                          ? "bg-emerald-500 text-white"
                          : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={submitQuiz}
                className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition text-white py-4 rounded-2xl font-black shadow-lg"
              >
                Submit Quiz
              </button>
            </div>
          </div>
        )}

        {score !== null && (
          <div className="mt-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/95 text-slate-900 rounded-3xl shadow-2xl p-8 text-center mb-8"
            >
              <h2 className="text-4xl font-black">
                Your Score: {score} / {questions.length}
              </h2>

              <a
                href="/user"
                className="inline-flex items-center gap-2 mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold"
              >
                <Home size={18} />
                Back to Dashboard
              </a>
            </motion.div>

            <h2 className="text-3xl font-black mb-5">Answer Review</h2>

            {questions.map((q, index) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.correct_answer;

              const options = {
                A: q.option_a,
                B: q.option_b,
                C: q.option_c,
                D: q.option_d,
              };

              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className={`bg-white/95 text-slate-900 rounded-3xl shadow-xl p-6 mb-5 border-2 ${
                    isCorrect ? "border-emerald-400" : "border-red-400"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    {isCorrect ? (
                      <CheckCircle className="text-emerald-500" />
                    ) : (
                      <XCircle className="text-red-500" />
                    )}

                    <h3 className="text-lg font-black">
                      {index + 1}. {q.question}
                    </h3>
                  </div>

                  <p>
                    Your answer:{" "}
                    <span className="font-bold">
                      {userAnswer
                        ? `${userAnswer}. ${options[userAnswer]}`
                        : "Not answered"}
                    </span>
                  </p>

                  <p className="mt-2">
                    Correct answer:{" "}
                    <span className="font-bold text-emerald-600">
                      {q.correct_answer}. {options[q.correct_answer]}
                    </span>
                  </p>

                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mt-4">
                    <p className="font-bold text-blue-700 mb-1">Explanation</p>
                    <p className="text-slate-700">
                      {q.explanation || "No explanation added."}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default TakeQuiz;
