import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    async function finishAuth() {
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get("code");

      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      } else {
        await supabase.auth.getSession();
      }

      navigate("/home", { replace: true });
    }

    finishAuth();
  }, [navigate]);

  return (
    <div style={{ padding: 24 }}>
      Connexion en cours...
    </div>
  );
}
