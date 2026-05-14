import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function Deconnexion() {
  const navigate = useNavigate();
  const [error] = useState("");

  useEffect(() => {
    async function logout() {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error(err);
      } finally {
        navigate("/connexion", { replace: true });
      }
    }

    logout();
  }, [navigate]);

  return (
    <div style={{ padding: 24 }}>
      {error || "Déconnexion en cours..."}
    </div>
  );
}
