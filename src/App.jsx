import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Panier from "./pages/Panier";
import Home from "./pages/home";
import Gallery from "./pages/Gallery";
import Recherche from "./pages/Recherche";
import Mode from "./pages/Mode";
import Lifestyle from "./pages/Lifestyle";
import Culture from "./pages/Culture";
import Connexion from "./pages/Connexion";
import Deconnexion from "./pages/Deconnexion";
import BoutiquesMap from "./pages/BoutiquesMap";

import { AuthProvider } from "./context/AuthContext";
import CartSupabaseSync from "./context/CartSupabaseSync";




import Header from "./components/Header";
import ScrollToSection from "./components/ScrollToSection";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Header />
          <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/galerie" element={<Gallery />} />
          
          <Route path="/recherche" element={<Recherche />} />
          <Route path="/mode" element={<Mode />} />
          
          <Route path="/lifestyle" element={<Lifestyle />} />
          <Route path="/culture" element={<Culture />} />
          <Route path="/boutiques" element={<BoutiquesMap />} />

          <Route path="/about" element={<ScrollToSection sectionId="about" />} />
          <Route path="/blog" element={<ScrollToSection sectionId="blog" />} />
          <Route path="/contact" element={<ScrollToSection sectionId="contact" />} />
           <Route path="/TOTO" element={<Recherche />} />
          
          
          <Route path="/abonnement" element={<div>Page Abonnement (à créer)</div>} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/deconnexion" element={<Deconnexion />} />

          <Route path="/panier" element={<Panier />} />

          <Route path="*" element={<div>404 - Page non trouvée</div>} />
        </Routes>
          </main>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}


export default App;
