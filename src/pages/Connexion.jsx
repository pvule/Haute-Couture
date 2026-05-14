import { useEffect, useRef, useState, useContext } from "react";
import { motion } from "framer-motion";// Correction : framer-motion est devenu motion/react sur les versions récentes, ou garde ton import actuel si ça marche
import { useNavigate } from "react-router-dom";

import "./Connexion.css";

import { AuthContext } from "../context/AuthContext";
import { supabase } from "../supabase";

const SEND_EMAIL_URL = "/api/send-email";
const EMAIL_TIMEOUT_MS = 8000;

async function sendWelcomeEmail({ email, name }) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), EMAIL_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(SEND_EMAIL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        to: email,
        name,
      }),
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Le serveur email ne répond pas pour le moment.", { cause: error });
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Le serveur SMTP n'a pas pu envoyer l'email.");
  }
}

async function saveUserProfile(user, name = "") {
  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email,
      full_name: name || user.user_metadata?.full_name || user.user_metadata?.name || "",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (error) throw error;
}

function getAuthErrorMessage(error) {
  const message = error.message || "";

  if (message.toLowerCase().includes("already registered")) {
    return "Cet email a déjà un compte. Utilise l'onglet Connexion.";
  }

  if (
    message.toLowerCase().includes("invalid login credentials") ||
    message.toLowerCase().includes("email not confirmed")
  ) {
    return "Email ou mot de passe incorrect.";
  }

  if (message.toLowerCase().includes("password")) {
    return "Le mot de passe doit contenir au moins 6 caractères.";
  }

  if (message.toLowerCase().includes("email")) {
    return "Adresse email invalide.";
  }

  return message || "Une erreur est survenue.";
}

function Connexion() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(null);
  const signupInProgressRef = useRef(false);
  const redirectTimeoutRef = useRef(null);

  useEffect(() => {
    if (user && !signupInProgressRef.current) {
      navigate("/home", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => () => {
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfoMessage("");
    setSignupSuccess(null);

    try {
      if (isLogin) {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (loginError) throw loginError;

        await saveUserProfile(data.user);
        navigate("/home", { replace: true });
        return;
      }

      signupInProgressRef.current = true;
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name,
            full_name: name,
          },
        },
      });

      if (signupError) throw signupError;
      if (!data.user) {
        throw new Error("Impossible de créer le compte pour le moment.");
      }

      setLoading(false);
      setSignupSuccess({
        email,
        emailStatus: "sending",
        hasWarnings: false,
        needsConfirmation: !data.session,
      });
      setInfoMessage("Compte créé. Envoi de l'email en cours...");

      const followUpErrors = [];

      try {
        await saveUserProfile(data.user, name);
      } catch (profileSaveError) {
        followUpErrors.push(profileSaveError);
      }

      let emailSent = false;
      try {
        await sendWelcomeEmail({ email, name });
        emailSent = true;
      } catch (emailError) {
        followUpErrors.push(emailError);
      }

      setSignupSuccess({
        email,
        emailStatus: emailSent ? "sent" : "failed",
        hasWarnings: followUpErrors.length > 0,
        needsConfirmation: !data.session,
      });
      setInfoMessage(
        emailSent
          ? "Compte créé. Un email de bienvenue vient d'être envoyé."
          : "Compte créé, mais l'email n'a pas pu être envoyé pour le moment."
      );

      if (!data.session) {
        signupInProgressRef.current = false;
        return;
      }

      redirectTimeoutRef.current = setTimeout(() => {
        signupInProgressRef.current = false;
        navigate("/home", { replace: true });
      }, emailSent ? 3200 : 5200);
    } catch (err) {
      signupInProgressRef.current = false;
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="connexion-page">
      <div className="overlay"></div>

      <motion.div
        className="connexion-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="connexion-title">{isLogin ? "Connexion" : "Inscription"}</h1>

        {infoMessage && !signupSuccess && (
          <p className="connexion-message connexion-message-success">
            {infoMessage}
          </p>
        )}

        <div className="connexion-tabs">
          <button
            className={`tab ${isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(true)}
            type="button"
          >
            Connexion
          </button>
          <button
            className={`tab ${!isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(false)}
            type="button"
          >
            Inscription
          </button>
        </div>

        {signupSuccess ? (
          <div
            className={`signup-success ${signupSuccess.emailStatus === "failed" ? "signup-success-warning" : ""}`}
            role="status"
            aria-live="polite"
          >
            <span className="signup-success-icon" aria-hidden="true"></span>
            <h2>
              {signupSuccess.needsConfirmation
                ? "Confirme ton email"
                : signupSuccess.emailStatus === "sent"
                ? "Inscription confirmée"
                : "Compte créé"}
            </h2>
            <p>
              {signupSuccess.needsConfirmation
                ? "Ton compte est créé. Supabase demande une confirmation avant connexion pour "
                : signupSuccess.emailStatus === "sent"
                ? "Ton compte est créé et un email de bienvenue a été envoyé à "
                : signupSuccess.emailStatus === "sending"
                  ? "Ton compte est créé. Envoi de l'email de bienvenue vers "
                  : "Ton compte est créé, mais l'email de bienvenue n'a pas pu partir vers "}
              <strong>{signupSuccess.email}</strong>.
            </p>
            <p className="signup-success-note">
              {signupSuccess.needsConfirmation
                ? "Vérifie ta boîte mail, puis reviens te connecter."
                : signupSuccess.emailStatus === "sending"
                ? "Merci de patienter quelques secondes..."
                : "Redirection vers l'accueil..."}
            </p>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="connexion-form">
          {!isLogin && (
            <input
              type="text"
              placeholder="Nom complet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
          />

          <motion.button
            type="submit"
            className="connexion-btn"
            whileHover={{ scale: 1.02 }}
            disabled={loading}
          >
            {loading ? "Chargement..." : isLogin ? "Se connecter" : "S'inscrire"}
          </motion.button>
        </form>
        )}

        {error && <p className="connexion-message connexion-message-error">{error}</p>}
      </motion.div>
    </div>
  );
}

export default Connexion;
