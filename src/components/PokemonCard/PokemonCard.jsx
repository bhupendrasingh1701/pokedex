import React from "react";
import "./PokemonCard.css";
import { useNavigate } from "react-router-dom";

const PokemonCard = ({ pokemon }) => {
  const navigate = useNavigate(); // ✅ inside component

  const { id, name, types } = pokemon;

  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  return (
    <div
      className="card"
      onClick={() => navigate(`/pokemon/${id}`)} // ✅ whole card clickable
    >
      <div className="content">
        {/* Image */}
        <img
          src={imageUrl}
          alt={name}
          className="pokemon-img"
        />

        {/* Name */}
        <h3 className="pokemon-name">{name}</h3>

        {/* Types */}
        <div className="types">
          {types.map((t, index) => (
            <span key={index} className={`badge ${t}`}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;