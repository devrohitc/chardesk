import { readStore, writeStore } from '../utils/storage';
import { starterPokemon } from '../data/seed';

const CACHE_KEY = 'pokemon-index-cache';
const CACHE_TTL = 1000 * 60 * 60 * 24;

export const STARTER_IDS = [25, 1, 4, 7, 133, 39];

function normaliseName(name) {
  return name.replace(/-/g, ' ');
}

export function spriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export async function fetchPokemonIndex() {
  const cached = readStore(CACHE_KEY, null);
  if (cached?.savedAt && Date.now() - cached.savedAt < CACHE_TTL && Array.isArray(cached.items)) {
    return cached.items;
  }

  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151&offset=0', {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`PokéAPI returned ${response.status}`);
  const data = await response.json();
  const items = data.results
    .map((pokemon) => {
      const id = Number(pokemon.url.match(/\/pokemon\/(\d+)\/?$/)?.[1]);
      return { id, name: pokemon.name, image: spriteUrl(id), label: normaliseName(pokemon.name) };
    })
    .filter((item) => Number.isFinite(item.id));
  writeStore(CACHE_KEY, { savedAt: Date.now(), items });
  return items;
}

export function fallbackPokemonIndex() {
  return starterPokemon.map((pokemon) => ({
    ...pokemon,
    label: normaliseName(pokemon.name),
    image: spriteUrl(pokemon.id),
  }));
}

export function pokemonArtwork(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

