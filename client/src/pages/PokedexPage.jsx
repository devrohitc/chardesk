import React from 'react';
import { Gamepad2, Search } from 'lucide-react';
import { slugTitle } from '../utils/formatters';
import { PokemonSprite } from '../components/PokemonSprite';
import { Tag } from '../components/Tag';
import { SectionHeading } from '../components/SectionHeading';

export function PokedexPage({
  pokemon,
  loading,
  error,
  caughtIds,
  coins,
  partnerId,
  onPartner,
  openDex,
}) {
  const caught = pokemon.filter((item) => caughtIds.includes(item.id));

  return (
    <div className="page-content">
      <div className="page-intro">
        <div>
          <span className="eyebrow">COLLECT AS YOU GROW</span>
          <h1>
            Your Pokédex <span className="wave">✦</span>
          </h1>
          <p className="muted">Every completed quest earns you closer to new companions.</p>
        </div>
        <button className="primary-button" onClick={openDex}>
          <Search size={15} /> Browse Kanto
        </button>
      </div>

      <div className="dex-summary panel">
        <div className="dex-summary-copy">
          <Tag variant="yellow">
            <Gamepad2 size={13} /> KANTO COLLECTION
          </Tag>
          <h2>Small wins. New friends.</h2>
          <p className="muted">
            Catch a Pokémon with coins earned from completing quests. Choose a partner to see them around
            your world.
          </p>
          <div className="dex-summary-stats">
            <div>
              <strong>{caughtIds.length}</strong>
              <span>Collected</span>
            </div>
            <div>
              <strong>{pokemon.length || '—'}</strong>
              <span>In Pokédex</span>
            </div>
            <div>
              <strong>{coins}</strong>
              <span>Coins</span>
            </div>
          </div>
        </div>
        <div className="dex-feature-art">
          <div className="dex-orbit orbit-one" />
          <div className="dex-orbit orbit-two" />
          <PokemonSprite
            pokemon={pokemon.find((item) => item.id === partnerId)}
            className="dex-feature-pokemon"
            artwork
          />
        </div>
      </div>

      <SectionHeading eyebrow="YOUR COLLECTION" title="Your companions" action="Browse all 151" onAction={openDex} />

      <div className="collection-grid">
        {caught.length ? (
          caught.map((item) => (
            <article className="panel collection-card" key={item.id}>
              <div className="collection-number">No. {String(item.id).padStart(3, '0')}</div>
              <PokemonSprite pokemon={item} className="collection-art" artwork />
              <strong>{slugTitle(item.name)}</strong>
              {item.id === partnerId ? (
                <Tag variant="green">Current partner</Tag>
              ) : (
                <button className="secondary-button" onClick={() => onPartner(item.id)}>
                  Choose partner
                </button>
              )}
            </article>
          ))
        ) : (
          <div className="empty-state">
            <Gamepad2 size={26} />
            <strong>Your adventure is just beginning</strong>
            <span>Complete quests to earn coins, then catch your first companion.</span>
            <button className="primary-button" onClick={openDex}>
              Explore Pokédex
            </button>
          </div>
        )}
      </div>

      {loading && (
        <p className="tiny-note">
          <span className="spinner" /> Loading Pokémon data…
        </p>
      )}
      {error && (
        <p className="tiny-note">
          PokéAPI is unavailable right now. A small offline starter list is shown instead.
        </p>
      )}
    </div>
  );
}

export default PokedexPage;

