import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CartContext } from "../context/CartContext";
import "./Panier.css";

function formatCfa(value) {
  const n = Number(value) || 0;
  return n.toLocaleString("fr-FR", { style: "currency", currency: "XOF" });
}


export default function Panier() {
  const cart = useContext(CartContext);
  const navigate = useNavigate();

  const { items, cartTotal, cartCount, setQty, clearCart, removeItem } = cart;

  return (
    <div className="panier-page">
      <div className="panier-header">
        <h1>Votre panier</h1>
        <div className="panier-meta">
          <span>{cartCount} article(s)</span>
Total : <strong>{formatCfa(cartTotal)}</strong>
        </div>
      </div>

      {items.length === 0 ? (
        <motion.div
          className="panier-empty"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <p>Votre panier est vide.</p>
          <button className="btn btn-light" onClick={() => navigate("/mode")}>Aller à Mode</button>
        </motion.div>
      ) : (
        <div className="panier-body">
          <div className="panier-items">
            {items.map((it) => (
              <motion.div
                className="panier-item"
                key={it.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <img className="panier-item-img" src={it.image} alt={it.title} />

                <div className="panier-item-info">
                  <h3 className="panier-item-title">{it.title}</h3>
{formatCfa(it.price)}

                  <div className="panier-item-actions">
                    <div className="qty-controls">
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => setQty(it.id, it.qty - 1)}
                        aria-label="Diminuer"
                      >
                        -
                      </button>
                      <div className="qty">{it.qty}</div>
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => setQty(it.id, it.qty + 1)}
                        aria-label="Augmenter"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="link-danger"
                      onClick={() => removeItem(it.id)}
                    >
                      Retirer
                    </button>
                  </div>
                </div>

                <div className="panier-item-subtotal">
{formatCfa(it.qty * it.price)}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="panier-summary">
            <div className="summary-row">
              <span>Total</span>
{formatCfa(cartTotal)}
            </div>

            <div className="summary-actions">
              <button type="button" className="btn btn-light" onClick={() => navigate("/mode")}>Continuer</button>
              <button type="button" className="btn btn-dark" onClick={clearCart}>Vider le panier</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

