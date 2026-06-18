import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/PokemonDetail.css";

function PokemonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [weaknesses, setWeaknesses] = useState({
  weak: [],
  resist: [],
  immune: []
});
  const [evolution, setEvolution] = useState([]);
  const [selectedAbility, setSelectedAbility] = useState(null);
  const [isShiny, setIsShiny] = useState(false);
  const [genderView, setGenderView] = useState("default");
  const [is3D, setIs3D] = useState(false);

  // 🔥 FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        // pokemon
        const res1 = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data1 = await res1.json();

        // species
        const res2 = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
        const data2 = await res2.json();

        // evolution
        const res3 = await fetch(data2.evolution_chain.url);
        const evoData = await res3.json();

        // ✅ extract evolution chain (CORRECT WAY)
        const evoArray = [];
        let current = evoData.chain;

        while (current) {
          evoArray.push({
            name: current.species.name,
            url: current.species.url,
          });
          current = current.evolves_to[0];
        }

        setPokemon(data1);
        setSpecies(data2);
        setEvolution(evoArray);

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id]);

    useEffect(() => {
    if (!pokemon || !pokemon.types) return;

    const fetchTypeEffectiveness = async () => {
        const typeData = await Promise.all(
        pokemon.types.map(t => fetch(t.type.url).then(res => res.json()))
        );

        const damageMap = {};

        typeData.forEach(type => {
        // 2x damage
        type.damage_relations.double_damage_from.forEach(t => {
            damageMap[t.name] = (damageMap[t.name] || 1) * 2;
        });

        // 0.5x damage
        type.damage_relations.half_damage_from.forEach(t => {
            damageMap[t.name] = (damageMap[t.name] || 1) * 0.5;
        });

        // 0x damage
        type.damage_relations.no_damage_from.forEach(t => {
            damageMap[t.name] = 0;
        });
        });

        const result = {
        weak: [],
        resist: [],
        immune: []
        };

        Object.entries(damageMap).forEach(([type, value]) => {
        if (value === 0) result.immune.push(type);
        else if (value > 1) result.weak.push({ type, value });
        else if (value < 1) result.resist.push({ type, value });
        });

        setWeaknesses(result);
    };

    fetchTypeEffectiveness();
    }, [pokemon]);

  if (!pokemon || !species) return <p style={{ color: "white" }}>Loading...</p>;

  // 🔥 DESCRIPTION
  const description = species.flavor_text_entries
    .find((e) => e.language.name === "en")
    ?.flavor_text.replace(/\f/g, " ");

  // 🔥 GENDER
  const genderRate = species.gender_rate;
  const female = genderRate >= 0 ? (genderRate * 12.5).toFixed(1) : null;
  const male = genderRate >= 0 ? (100 - female).toFixed(1) : null;

  // 🔥 TOTAL STATS
  const totalStats = pokemon.stats.reduce(
    (sum, stat) => sum + stat.base_stat,
    0
  );

  //  HELPER (important)
  const getIdFromUrl = (url) => {
    const parts = url.split("/");
    return parts[parts.length - 2];
  };

  //  IMAGE HELPER
    const getImage = () => {
    // Female variant
    if (genderView === "female") {
        return isShiny
        ? pokemon.sprites.front_shiny_female || pokemon.sprites.front_shiny
        : pokemon.sprites.front_female || pokemon.sprites.front_default;
    }

    // Default artwork
    return isShiny
        ? pokemon.sprites.other["official-artwork"].front_shiny
        : pokemon.sprites.other["official-artwork"].front_default;
    };

  return (
    <div className="detail-container">
        <div className="nav-buttons">

        <button
        disabled={pokemon.id <= 1}
        onClick={() => navigate(`/pokemon/${pokemon.id - 1}`)}
        className="nav-btn"
        >
        ← Prev
        </button>

        <button
        onClick={() => navigate(`/pokemon/${pokemon.id + 1}`)}
        className="nav-btn"
        >
        Next →
        </button>

        </div>
      <div className="detail-layout">

        {/* LEFT */}
        <div className="left-panel">

          <div className="view-toggle">

            <button
                className={!isShiny && !is3D ? "active" : ""}
                onClick={() => {
                setIs3D(false);
                setIsShiny(false);
                }}
            >
                Normal
            </button>

            <button
                className={isShiny && !is3D ? "active" : ""}
                onClick={() => {
                setIs3D(false);
                setIsShiny(true);
                }}
            >
                Shiny ✨
            </button>

            <button
                className={is3D ? "active" : ""}
                onClick={() => {
                setIs3D(true);
                alert("3D view coming soon 🚀");
                }}
            >
                3D 🔒
            </button>
            <div className="gender-toggle">
            <button
                className={genderView === "default" ? "active" : ""}
                onClick={() => setGenderView("default")}
            >
                ♂ Default
            </button>

            <button
                className={genderView === "female" ? "active" : ""}
                onClick={() => setGenderView("female")}
            >
                ♀ Female
            </button>
            </div>

            </div>

          {!is3D ? (
            <img
              src={
                isShiny
                    ? pokemon.sprites.other["official-artwork"].front_shiny
                    : pokemon.sprites.other["official-artwork"].front_default
                }
              alt={pokemon.name}
              className="detail-img"
            />
          ) : (
            <div className="coming-soon">🚧 3D Coming Soon</div>
          )}
        </div>

        {/* RIGHT */}
        <div className="right-panel">

          <h1 className="detail-name">{pokemon.name}</h1>

          <div className="type-section">
            <h3>Type</h3>
            <div className="detail-types">
                {pokemon.types.map((t, i) => (
                <span key={i} className={`badge ${t.type.name}`}>
                    {t.type.name}
                </span>
                ))}
            </div>
            </div>

          <div className="detail-info">
            <p>Height: {(pokemon.height / 10).toFixed(1)} m</p>
            <p>Weight: {(pokemon.weight / 10).toFixed(1)} kg</p>
          </div>

          <p className="description">{description}</p>
          
          
          <div className="weakness-section">

            {/* WEAK */}
            <div>
                <h3>Weaknesses</h3>
                <div className="weakness-list">
                {weaknesses.weak.map((w, i) => (
                    <span key={i} className={`badge ${w.type}`}>
                    {w.type} ({w.value}×)
                    </span>
                ))}
                </div>
            </div>

            {/* RESIST */}
            <div>
                <h3>Resistances</h3>
                <div className="weakness-list">
                {weaknesses.resist.map((w, i) => (
                    <span key={i} className={`badge ${w.type}`}>
                    {w.type} ({w.value}×)
                    </span>
                ))}
                </div>
            </div>

            {/* IMMUNE */}
            <div>
                <h3>Immunities</h3>
                <div className="weakness-list">
                {weaknesses.immune.map((t, i) => (
                    <span key={i} className={`badge ${t}`}>
                    {t} (0×)
                    </span>
                ))}
                </div>
            </div>

            </div>

          {/* GENDER */}
          <div className="gender">
            <h4>Gender</h4>

            {genderRate === -1 ? (
              <span>Genderless</span>
            ) : (
              <div className="gender-container">

                <div className="gender-bar">
                  <div className="male" style={{ width: `${male}%` }}></div>
                  <div className="female" style={{ width: `${female}%` }}></div>
                </div>

                <div className="gender-labels">
                  <span>♂ {male}%</span>
                  <span>♀ {female}%</span>
                </div>

              </div>
            )}
          </div>

          {/* ABILITIES */}
          <div className="abilities">
            <h3>Abilities</h3>

            {pokemon.abilities.map((a, i) => (
              <span
                key={i}
                className="ability"
                onClick={async () => {
                  const res = await fetch(a.ability.url);
                  const data = await res.json();

                  const effect = data.effect_entries.find(
                    (e) => e.language.name === "en"
                  );

                  setSelectedAbility({
                    name: a.ability.name,
                    description: effect?.effect || "No description",
                  });
                }}
              >
                {a.ability.name} ❔
              </span>
            ))}
          </div>

          {/* STATS */}
          <div className="stats">
            <h3>Stats</h3>

            {pokemon.stats.map((s, i) => (
              <div key={i} className="stat-row">
                <span>{s.stat.name}</span>

                <div className="stat-bar">
                  <div
                    className="stat-fill"
                    style={{ width: `${(s.base_stat / 150) * 100}%` }}
                  ></div>
                </div>

                <span>{s.base_stat}</span>
              </div>
            ))}

            <p className="total">Total: {totalStats}</p>
          </div>
        

        </div>
      </div>
      {/* EVOLUTION */}
        <div className="evolution-section">
        <h2>Evolution Chain</h2>

        <div className="evo-chain">
            {evolution.map((evo, index) => {
            const evoId = getIdFromUrl(evo.url);

            return (
                <div key={index} className="evo-wrapper">

                <div
                    className="evo-card"
                    onClick={() => (window.location.href = `/pokemon/${evoId}`)}
                >
                    <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evoId}.png`}
                    alt={evo.name}
                    />
                    <p>{evo.name}</p>
                    <span>#{evoId.padStart(3, "0")}</span>
                </div>

                {index < evolution.length - 1 && (
                    <div className="evo-arrow">➜</div>
                )}

                </div>
            );
            })}
        </div>
        </div>

      {/* POPUP */}
      {selectedAbility && (
        <div className="ability-popup-overlay">
          <div className="ability-popup">
            <h3>{selectedAbility.name}</h3>
            <p>{selectedAbility.description}</p>

            <button onClick={() => setSelectedAbility(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    
    
  );
}

export default PokemonDetail;