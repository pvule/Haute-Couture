import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Gate.css";

export default function Gate() {
  const navigate = useNavigate();
  const { loading, user } = useContext(AuthContext);

 useEffect(() => {
    if (loading) return;

    if (user) {
      navigate("/home", { replace: true });
      return;
    }

    // Attend 3 secondes puis va à la connexion
    const timer = setTimeout(() => {
      navigate("/connexion");
    }, 3000);

    return () => clearTimeout(timer);
  }, [loading, user, navigate]);
  return (
    <div className="gate-page" onClick={() => navigate("/connexion")}>
      <div className="gate-surface">
        {/* Ton loader ou ton design de porte d'entrée */}
        <div className="loader"></div>
        
        <div style={{ marginTop: "20px", color: "white", textAlign: "center", cursor: "pointer" }}>
           <h1 style={{ letterSpacing: "5px" }}>Haute Couture</h1>
           <p>Push To Start</p>
        </div>
      </div>
    </div>
  );
}
