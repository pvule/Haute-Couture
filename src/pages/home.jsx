import "../App.css";
import { motion } from "framer-motion";

function Home() {
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
          <h1>HAUTE COUTURE</h1>
          <p>L’art de la mode moderne</p>
          <button className="btn">Explorer</button>
        </motion.div>
      </section>

      <hr className="section-divider" />

      {/* FEATURED */}
      <section className="featured">
        <h2>FEATURED LOOKS</h2>

        <div className="grid">
          {["/images/look1.jpg", "/images/look2.jpg", "/images/look3.jpg","/images/look4.jpg","/images/look5.jpg","/images/look6.jpg","/images/look7.jpg","/images/look8.jpg","/images/look9.jpg"].map((img, index) => (
            <motion.div className="card" key={index} whileHover={{ scale: 1.05 }}>
              <img src={img} alt="look" />
              <div className="overlay">
                <h3>Met Gala Style</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
<section id="about" className="about">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2>ABOUT</h2>
          <p>
            Ce site explore l’univers de la haute couture, inspiré par les plus grands
            événements de mode et les tendances contemporaines.
          </p>
        </motion.div>
      </section>

      {/* BLOG */}    <section id="blog" className="blog">
        <h2>BLOG</h2>

        <div className="blog-grid">
          <div className="blog-card">
            <h3>Met Gala 2025</h3>
            <p>Les looks les plus marquants de la soirée.</p>
          </div>

          <div className="blog-card">
            <h3>Tendances actuelles</h3>
            <p>Les styles qui dominent la mode moderne.</p>
          </div>

          <div className="blog-card">
            <h3>Art & Mode</h3>
            <p>Quand la mode rencontre l’art contemporain.</p>
          </div>
        </div>
      </section>

      {/* CONTACT */}      <section id="contact" className="contact">
        <h2>CONTACT</h2>

        <form className="contact-form">
          <input type="text" placeholder="Nom" />
          <input type="email" placeholder="Email" />
          <textarea placeholder="Message"></textarea>
          <button className="btn">Envoyer</button>
        </form>
      </section>

    </div>
  );
}

export default Home;