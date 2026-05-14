import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import CartSync from "./context/CartSupabaseSync";

// Import du Header pour qu'il soit global
import Header from "./components/Header"; 

import Panier from "./pages/Panier";
import Gallery from "./pages/Gallery";
import Recherche from "./pages/Recherche";
import Mode from "./pages/Mode";
import Lifestyle from "./pages/Lifestyle";
import Culture from "./pages/Culture";
import Connexion from "./pages/Connexion";
import Deconnexion from "./pages/Deconnexion";
import AuthCallback from "./pages/AuthCallback";
import BoutiquesMap from "./pages/BoutiquesMap";
import Gate from "./pages/Gate";
import Home from "./pages/home";
import ScrollToSection from "./components/ScrollToSection";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <CartSync />
        <BrowserRouter>
          {/* ✅ Le Header est placé ici pour apparaître sur TOUTES les pages */}
          <Header /> 

          <main className="main-content">
            <Routes>
              {/* 🔐 Page d'entrée (Porte) */}
              <Route path="/" element={<Gate />} />

              {/* Pages principales */}
              <Route path="/home" element={<Home />} />
              <Route path="/galerie" element={<Gallery />} />
              <Route path="/recherche" element={<Recherche />} />
              <Route path="/mode" element={<Mode />} />
              <Route path="/lifestyle" element={<Lifestyle />} />
              <Route path="/culture" element={<Culture />} />
              <Route path="/boutiques" element={<BoutiquesMap />} />

              {/* Ancres de défilement */}
              <Route path="/about" element={<ScrollToSection sectionId="about" />} />
              <Route path="/blog" element={<ScrollToSection sectionId="blog" />} />
              <Route path="/contact" element={<ScrollToSection sectionId="contact" />} />

              <Route path="/abonnement" element={<div>Page Abonnement</div>} />

              <Route path="/connexion" element={<Connexion />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/deconnexion" element={<Deconnexion />} />
              <Route path="/panier" element={<Panier />} />

              {/* 404 */}
              <Route path="*" element={<div>404 - Page non trouvée</div>} />
            </Routes>
          </main>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
