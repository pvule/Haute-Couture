import "./Gallery.css";

const looks = [
  {
    id: 1,
    name: "Rihanna",
    brand: "Marc Jacobs",
    image: "/images/look1.jpg"
  },
  {
    id: 2,
    name: "Zendaya",
    brand: "Louis Vuitton",
    image: "/images/look2.jpg"
  },
  {
    id: 3,
    name: "Dua Lipa",
    brand: "Chanel",
    image: "/images/look3.jpg"
  }
];

function Gallery() {
  return (
    <div className="gallery">
      {looks.map((look) => (
        <section className="look" key={look.id}>
          
          <img src={look.image} alt={look.name} />

          <div className="overlay">
            <h2>{look.name}</h2>
            <p>{look.brand}</p>
          </div>

        </section>
      ))}
    </div>
  );
}

export default Gallery;