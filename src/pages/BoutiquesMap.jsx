import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

// On suppose que ces imports restent les mêmes
import "../App.css";
import "./BoutiquesMap.css";
import boutiques from "../data/boutiques_luxe.json";

const cityCoords = {
  Paris: [2.3522, 48.8566],
  "New York": [-74.006, 40.7128],
  London: [-0.1276, 51.5072],
  Milan: [9.19, 45.4642],
  Tokyo: [139.6503, 35.6762],
  Osaka: [135.5023, 34.6937],
  "Beverly Hills": [-118.4004, 34.0736],
  Rome: [12.4964, 41.9028],
  "Hong Kong": [114.1694, 22.3193],
  Shanghai: [121.4737, 31.2304],
  Singapore: [103.8198, 1.3521],
  Dubai: [55.2708, 25.2048],
  Zurich: [8.5417, 47.3769],
  Geneva: [6.1432, 46.2044],
  "Genève": [6.1432, 46.2044],
  Seoul: [126.978, 37.5665],
  "Séoul": [126.978, 37.5665],
  Sydney: [151.2093, -33.8688],
  Mexico: [-99.1332, 19.4326],
  "São Paulo": [-46.6333, -23.5505],
  Istanbul: [28.9784, 41.0082],
  Vienna: [16.3738, 48.2082],
  Vienne: [16.3738, 48.2082],
  Munich: [11.582, 48.1351],
};

export default function BoutiquesMap() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    // 🗺️ INITIALISATION
    const map = new maplibregl.Map({
      container: mapContainer.current,
      // Utilisation d'un style gratuit et fiable (CartoDB Voyager)
      style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
      center: [15, 25], // Centré un peu mieux pour une vue mondiale
      zoom: 1.8,
    });

    mapRef.current = map;

    // Contrôles de navigation
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", () => {
      // Forcer le redimensionnement une fois chargé
      map.resize();

      // 📍 AJOUT DES MARQUEURS
      boutiques.forEach((b) => {
        const coords = cityCoords[b.city];
        if (!coords) return;

        const popup = new maplibregl.Popup({ 
          offset: 25,
          closeButton: false 
        }).setHTML(`
          <div style="padding: 5px; color: #333;">
            <strong style="color: #d4af37; font-size: 16px;">${b.name}</strong><br/>
            <div style="margin-top: 4px;">${b.address}</div>
            <div style="font-style: italic; color: #666;">${b.city}, ${b.country}</div>
          </div>
        `);

        new maplibregl.Marker({ color: "#d4af37" })
          .setLngLat(coords)
          .setPopup(popup)
          .addTo(map);
      });
    });

    // Nettoyage à la destruction du composant
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="boutiques-map-page" style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
      <div className="boutiques-map-hero" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontFamily: 'serif', fontSize: '2rem' }}>Cartographie des boutiques de luxe</h2>
        <p>Explorez nos emplacements prestigieux à travers le monde</p>
      </div>

      {/* LE CONTENEUR DE LA MAP */}
      <div
        ref={mapContainer}
        className="map-wrapper"
        style={{ 
          width: "100%", 
          height: "600px", // Hauteur fixe recommandée pour le debug
          maxHeight: "75vh",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          overflow: "hidden" 
        }}
      />

      <div className="boutiques-map-list" style={{ marginTop: '40px' }}>
        <h3 style={{ borderBottom: '2px solid #d4af37', display: 'inline-block', paddingBottom: '5px' }}>
            Nos Adresses
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {boutiques.map((b, i) => (
            <li key={i} style={{ padding: '15px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              <strong style={{ color: '#d4af37' }}>{b.name}</strong>
              <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{b.city} — {b.country}</div>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>{b.address}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}