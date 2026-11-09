import React, { useState, useEffect } from 'react';
import { pokemonArtwork } from '../services/pokeapi';
import { slugTitle } from '../utils/formatters';

export function PokemonSprite({ pokemon, className = '', artwork = false, onClick, title }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [pokemon?.id, artwork]);

  if (!pokemon) {
    return <div className={`pokemon-placeholder ${className}`}>?</div>;
  }

  const src = artwork
    ? pokemonArtwork(pokemon.id)
    : (pokemon.image || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`);

  return (
    <button
      className={`pokemon-sprite ${className}`}
      onClick={onClick}
      type="button"
      title={title || slugTitle(pokemon.name)}
      aria-label={title || slugTitle(pokemon.name)}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {failed ? (
        <span className="sprite-fallback">✦</span>
      ) : (
        <img
          src={src}
          alt={slugTitle(pokemon.name)}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
    </button>
  );
}

export default PokemonSprite;

