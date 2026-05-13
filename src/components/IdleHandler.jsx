import { useEffect, useState } from "react";

const IdleHandler = () => {
  const [isWarning, setIsWarning] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ Only run if user is logged in
  if (!token) return null;

  let idleTimer;
  let warningTimer;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const resetTimer = () => {
    clearTimeout(idleTimer);
    clearTimeout(warningTimer);

    setIsWarning(false);

    warningTimer = setTimeout(
      () => {
        setIsWarning(true);
      },
      5 * 60 * 1000,
    );

    idleTimer = setTimeout(
      () => {
        logout();
      },
      5 * 60 * 1000 + 30000,
    );
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll"];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, []);

  return (
    <>
      {isWarning && (
        <div className="fixed bottom-5 right-5 bg-red-500 text-white px-4 py-2 rounded shadow-lg">
          ⚠️ You are inactive. You will be logged out soon!
        </div>
      )}
    </>
  );
};

export default IdleHandler;
