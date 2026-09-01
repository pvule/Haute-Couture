import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { FinanceProvider } from "./context/FinanceContext";

import Header from "./components/Header";

import Connexion from "./pages/Connexion";
import Deconnexion from "./pages/Deconnexion";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/family-bank/Dashboard";
import Transactions from "./pages/family-bank/Transactions";
import Historique from "./pages/family-bank/Historique";
import Cotisations from "./pages/family-bank/Cotisations";
import Membres from "./pages/family-bank/Membres";
import Objectifs from "./pages/family-bank/Objectifs";

function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <BrowserRouter>
          <Header />

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/historique" element={<Historique />} />
              <Route path="/cotisations" element={<Cotisations />} />
              <Route path="/membres" element={<Membres />} />
              <Route path="/objectifs" element={<Objectifs />} />

              <Route path="/connexion" element={<Connexion />} />
              <Route path="/deconnexion" element={<Deconnexion />} />
              <Route path="/auth/callback" element={<AuthCallback />} />

              <Route path="*" element={<div>404 - Page non trouvée</div>} />
            </Routes>
          </main>
        </BrowserRouter>
      </FinanceProvider>
    </AuthProvider>
  );
}

export default App;