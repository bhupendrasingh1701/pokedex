import { useNavigate } from "react-router-dom";
import "../styles/home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">

      {/* HERO */}
      <section className="home-hero video-hero">
        <video autoPlay loop muted playsInline className="bg-video">
          <source src="/video/pokemon.mp4" type="video/mp4" />
        </video>

        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h1>Explore the Pokémon World</h1>
          <p>Search, discover, and learn about your favorite Pokémon.</p>

          <button
            className="home-btn"
            onClick={() => navigate("/pokedex")}
          >
            Go to Pokedex
          </button>
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section className="home-features">
        <h2>What you can do</h2>

        <div className="features-grid">
          <div className="feature-card">
            🔍 Search Pokémon instantly
          </div>

          <div className="feature-card">
            📊 View stats & types
          </div>

          <div className="feature-card">
            ⚡ Explore all Pokémon
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;