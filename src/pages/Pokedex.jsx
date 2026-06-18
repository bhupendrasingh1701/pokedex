import { useEffect, useState } from "react";
import CardGrid from "../components/CardGrid";
import "../styles/button.css";

function Pokedex() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=24&offset=${offset}`
        );
        const data = await res.json();

        const detailedData = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            const details = await res.json();

            return {
              id: details.id,
              name: details.name,
              types: details.types.map((t) => t.type.name),
            };
          })
        );

        setCards((prev) => {
          const newData = detailedData.filter(
            (p) => !prev.some((existing) => existing.id === p.id)
          );
          return [...prev, ...newData];
        });

        setLoading(false);
      } catch (err) {
        console.log(err);
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [offset]);

  // ✅ THIS was missing (return)
  return (
    <div className="page-offset">
      <main className="main-container">
        <div className="section-header"></div>

        <CardGrid cards={cards} loading={loading} error={error} />
      </main>

      {/* Load More Button */}
      <div className="load-more-container">
        <button
          className="load-more-button"
          onClick={() => setOffset((prev) => prev + 12)}
        >
          Load more
        </button>
      </div>
    </div>
  );
}

export default Pokedex;