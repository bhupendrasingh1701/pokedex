import PokemonCard from "./PokemonCard/PokemonCard";

function CardGrid({ cards, loading, error }) {
  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="grid">
      {cards.map((card) => (
        <PokemonCard key={card.id} pokemon={card} />
      ))}
    </div>
  );
}

export default CardGrid;