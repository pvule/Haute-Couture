import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { saveUserProfile } from "../lib/auth";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Connexion en cours...");

  useEffect(() => {
    let isMounted = true;

    async function finishAuth() {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
        const code = searchParams.get("code");
        const errorDescription =
          searchParams.get("error_description") ||
          hashParams.get("error_description");

        if (errorDescription) {
          throw new Error(errorDescription);
        }

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }

        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (data.session?.user) {
          try {
            await saveUserProfile(data.session.user);
          } catch (profileError) {
            console.warn("Unable to save profile after auth callback.", profileError);
          }
        }

        navigate("/home", { replace: true });
      } catch (error) {
        console.error(error);
        if (!isMounted) return;
        setMessage("Lien de connexion invalide ou expire. Merci de te reconnecter.");
        window.setTimeout(() => navigate("/connexion", { replace: true }), 2500);
      }
    }

    finishAuth();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <div style={{ padding: 24 }}>
      {message}
    </div>
  );
}
