import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (search.length < 2) {
      setSuggestions([]);
      return;
    }

    fetch("https://pokeapi.co/api/v2/pokemon?limit=1000")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.results
          .filter((p) => p.name.includes(search.toLowerCase()))
          .slice(0, 6);

        setSuggestions(filtered);
      });
  }, [search]);

  return (
    <nav className="navbar">
      <div className="navbar__inner">

        {/* LEFT */}
        <div className="navbar-logo" onClick={() => navigate("/")}>
          Pokedex
        </div>

        {/* CENTER TABS */}
        <ul className="navbar-tabs">
          <li onClick={() => navigate("/")}>Home</li>
          <li onClick={() => navigate("/pokedex")}>Pokedex</li>
        </ul>

        {/* RIGHT SEARCH */}
        <div className="navbar-search">
          <div className="group">

            <input
              className="input"
              placeholder="Search Pokémon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && search.trim()) {
                  navigate(`/pokemon/${search.toLowerCase()}`);
                  setSearch("");
                  setSuggestions([]);
                }
              }}
            />

            {/* 🔥 SUGGESTIONS DROPDOWN */}
            {suggestions.length > 0 && (
              <div className="suggestions">
                {suggestions.map((p, i) => (
                  <div
                    key={i}
                    className="suggestion-item"
                    onClick={() => {
                      navigate(`/pokemon/${p.name}`);
                      setSearch("");
                      setSuggestions([]);
                    }}
                  >
                    {p.name}
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;