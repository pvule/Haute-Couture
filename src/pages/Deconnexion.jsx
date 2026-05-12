import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'monapp_auth_session_v1';

export default function Deconnexion() {
  const navigate = useNavigate();
  const [error] = useState('');


  useEffect(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // même si localStorage est bloqué, on redirige
    }


    navigate('/');
  }, [navigate]);

  return (
    <div style={{ padding: 24 }}>
      {error || 'Déconnexion…'}
    </div>
  );
}

