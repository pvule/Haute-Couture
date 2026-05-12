import { useState } from 'react';
import { motion } from 'framer-motion';
import '../App.css';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    'RECHERCHE',
    'MODE', 

    'LIFESTYLE',
    'CULTURE',
    'ABOUT',
    'GALERIE',
    'BLOG',
    
    'CONTACT',
    'BOUTIQUES',
    'TOTO' 
    
  ];


  return (
    <header className="header">
      {/* Top Bar */}
      <div className="header-top">
        <div className="header-left">
          <button
            type="button"
            className="hamburger"
            aria-label="Ouvrir le menu"
            onClick={() => setIsMenuOpen((v) => !v)}
          >
            ☰
          </button>
        </div>
        <div className="header-center">
          <h1 className="logo">HAUTE COUTURE</h1>
        </div>
        <div className="header-right">
          <a href="/abonnement" className="cta">ABONNEMENT</a>
          <span className="separator">|</span>
          <a href="/connexion" className="cta">SE CONNECTER</a>
          <span className="separator">|</span>
          <a href="/deconnexion" className="cta">SE DÉCONNECTER</a>

        </div>
      </div>

      {/* Desktop Nav Bar */}
      <nav className="header-nav">
        <div className="nav-container">
        {navItems.map((item, index) => {
          const route = item.toLowerCase();
          return (
            <motion.a
              key={item}
              href={`/${route}`}
              className="nav-link"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.1 }}
            >
              {item}
            </motion.a>
          );
        })}
        </div>
      </nav>

      {/* Fullscreen Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          className="mobile-menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="mobile-menu-content">
            {navItems.map((item, index) => {
              const route = item.toLowerCase();
              return (
                <motion.a
                  key={item}
                  href={`/${route}`}
                  className="mobile-nav-link"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      )}
    </header>
  );
}

export default Header;
