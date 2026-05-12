import "../App.css";
import "./Mode.css";
import { motion } from "framer-motion";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function formatCfa(value) {
  const n = Number(value) || 0;
  return n.toLocaleString("fr-FR", { style: "currency", currency: "XOF" });
}

function Mode() {

  const cart = useContext(CartContext);
  const navigate = useNavigate();

  const products = [
    { id: "chanel-automne", img: "/images/look1.jpg", title: "Chanel Automne", price: 3200 },
    { id: "dior-pret-a-porter", img: "/images/look2.jpg", title: "Dior Prêt-à-Porter", price: 1800 },
    { id: "versace-hc", img: "/images/look3.jpg", title: "Versace Haute Couture", price: 4500 },
  ];

  function addToCart(p) {
    cart.addItem(p, 1);
  }

  function goToCart() {
    navigate("/panier");
  }

  return (
    <div className="mode">
      {/* HERO */}
      <section className="hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1>MODE</h1>
          <p>Les dernières collections</p>
          <button className="btn">Découvrir</button>
        </motion.div>
      </section>

      {/* PANIER MINI (chariot à côté de MODE) */}
      <aside className="mode-cart-mini" onClick={goToCart} role="button" tabIndex={0}>
        <div className="mode-cart-mini-left">
          <span className="mode-cart-icon">🛒</span>
          <span className="mode-cart-count">{cart.cartCount}</span>
        </div>
        <div className="mode-cart-mini-right">
          <div className="mode-cart-mini-label">Panier</div>
<span className="mode-cart-mini-total-value">{formatCfa(cart.cartTotal)}</span>
        </div>
      </aside>

      {/* COLLECTIONS */}
      <section className="collections">
        <h2>NOUVELLES COLLECTIONS</h2>
        <div className="grid">
          {products.map((p, index) => (
            <motion.div
              className="card"
              key={p.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ delay: index * 0.1 }}
            >
              <img src={p.img} alt={p.title} />

              <div className="overlay">
                <h3>{p.title}</h3>
{formatCfa(p.price)}
                <div className="overlay-actions">
                  <button
                    type="button"
                    className="btn btn-add"
                    onClick={() => {
                      addToCart(p);
                      goToCart();
                    }}
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* RUNWAY */}
      <section className="runway">
        <h2>RUNWAY</h2>
        <p>Revivez les défilés en direct depuis Paris.</p>
      </section>
    </div>
  );
}

export default Mode;
