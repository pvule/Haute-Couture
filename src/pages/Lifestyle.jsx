import "../App.css";
import { motion } from "framer-motion";

function Lifestyle() {
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
          <h1>LIFESTYLE</h1>
          <p>Le chic au quotidien</p>
          <button className="btn">Explorer</button>
        </motion.div>
      </section>

      {/* CONTENT */}
      <section className="featured">
        <h2>STYLE DE VIE</h2>
        <div className="grid">
          {["/images/look4.jpg", "/images/look5.jpg", "/images/look6.jpg"].map((img, index) => (
            <motion.div className="card" key={index} whileHover={{ scale: 1.05 }}>
              <img src={img} alt="lifestyle" />
              <div className="overlay">
                <h3>Élégance Urbaine</h3>
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
          <h2>NOTRE PHILOSOPHIE</h2>
          <p>Intégrer la haute couture dans chaque instant de la vie.</p>
        </motion.div>
      </section>
    </div>
  );
}

export default Lifestyle;
