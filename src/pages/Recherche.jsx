import "../App.css";
import "./Recherche.css";
import { motion } from "framer-motion";

function Recherche() {
  return (
    <div className="recherche">
      {/* HERO */}
      <section className="hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1>RECHERCHE</h1>
          <p>Découvrez les dernières tendances</p>
          <button className="btn">Explorer</button>
        </motion.div>
      </section>

      {/* TRENDS */}
      <section className="trends">
        <h2>TENDANCES RECHERCHÉES</h2>
        <div className="grid">
          {[
            { img: "/images/look4.jpg", title: "Met Gala 2025" },
            { img: "/images/look5.jpg", title: "Printemps-Été" },
            { img: "/images/look6.jpg", title: "Street Style" }
          ].map((item, index) => (
            <motion.div 
              className="card" 
              key={index} 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ delay: index * 0.1 }}
            >
              <img src={item.img} alt={item.title} />
              <div className="overlay">
                <h3>{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* RESULTS */}
      <section className="results">
        <h2>RÉSULTATS</h2>
        <p>Plus de 1,247 articles trouvés pour vos recherches mode.</p>
      </section>
    </div>
  );
}

export default Recherche;
