import { useEffect } from "react";
import { supabase } from "./supabase";
import axios from "axios";

function AuthCallback() {
  useEffect(() => {
    async function handleCallback() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/";
        return;
      }

      const res = await axios.post(
        "https://quiz-backend-dz0i.onrender.com/api/google-login",
        {
          name: user.user_metadata.full_name,
          email: user.email,
        },
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      window.location.href = "/user";
    }

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Logging in...
    </div>
  );
}

export default AuthCallback;
