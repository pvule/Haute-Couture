import "../App.css";
import { motion } from "framer-motion";

function Culture() {
  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1>CULTURE</h1>
          <p>L'héritage de la mode</p>
          <button className="btn">Plonger</button>
        </motion.div>
      </section>

      {/* CONTENT */}
      <section className="featured">
        <h2>ARTS & TRADITIONS</h2>
        <div className="grid">
          {["/images/look7.jpg", "/images/look1.jpg", "/images/look2.jpg"].map((img, index) => (
            <motion.div className="card" key={index} whileHover={{ scale: 1.05 }}>
              <img src={img} alt="culture" />
              <div className="overlay">
                <h3>Histoire Mode</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="about">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2>NOTRE PATRIMOINE</h2>
          <p>La culture mode à travers les époques et les continents.</p>
        </motion.div>
      </section>
    </div>
  );
}

export default Culture;
