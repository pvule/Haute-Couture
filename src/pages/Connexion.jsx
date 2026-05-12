import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';


import '../App.css';
import './Connexion.css';

function Connexion() {
  const navigate = useNavigate();
  const { session } = useAuth(); // On récupère la session réelle du contexte
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Si une session existe déjà, on redirige vers l'accueil
  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Supabase désactivé pour le moment (frontend only)
    setLoading(false);
    setError("Connexion/inscription indisponible : Supabase désactivé.");
  };

  return (
    <div className="connexion-page">
      {loading && (
        <div className="connexion-loader" role="status" aria-live="polite">
          <img src="/images/loader.png" alt="Chargement" className="connexion-loader-image" />
        </div>
      )}

      <motion.div
        className="connexion-form-container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="connexion-tabs">
          <button
            className={`tab ${isLogin ? 'active' : ''}`}
            onClick={() => {
              setError('');
              setIsLogin(true);
            }}
            type="button"
          >
            Connexion
          </button>
          <button
            className={`tab ${!isLogin ? 'active' : ''}`}
            onClick={() => {
              setError('');
              setIsLogin(false);
            }}
            type="button"
          >
            Créer un compte
          </button>
        </div>

        <form onSubmit={handleSubmit} className="connexion-form">
          {!isLogin && (
            <input
              type="text"
              placeholder="Nom complet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              required
              disabled={loading}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
            disabled={loading}
          />

          <motion.button
            type="submit"
            className="btn primary"
            whileHover={loading ? undefined : { scale: 1.05 }}
            disabled={loading}
          >
            {loading ? 'Patientez…' : isLogin ? 'Se connecter' : 'Créer le compte'}
          </motion.button>
        </form>

        {error && <p className="connexion-info" style={{ color: '#ff4d4d' }}>{error}</p>}
      </motion.div>
    </div>
  );
}

export default Connexion;