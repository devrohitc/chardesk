import React, { useState, useMemo } from 'react';
import { CheckCircle2, Coins, Plus, Search, X } from 'lucide-react';
import { PokemonSprite } from './PokemonSprite';
import { Tag } from './Tag';
import { slugTitle } from '../utils/formatters';

export function PokemonModal({
  pokemon,
  caughtIds,
  coins,
  onClose,
  onCatch,
  onPartner,
  partnerId,
  loading,
}) {
  const [search, setSearch] = useState('');
  const filtered = useMemo(
    () =>
      pokemon.filter(
        (item) =>
          item.label.toLowerCase().includes(search.toLowerCase()) ||
          String(item.id).includes(search)
      ),
    [pokemon, search]
  );
  const catchCost = 20;

  return (
    <div
      className="modal-backdrop pokedex-backdrop"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section className="pokedex-modal" role="dialog" aria-modal="true" aria-labelledby="dex-title">
        <div className="dex-modal-head">
          <div>
            <span className="eyebrow">KANTO FIELD GUIDE</span>
            <h2 id="dex-title">
              Pokédex <span>{pokemon.length || '—'}</span>
            </h2>
            <p className="muted">Collect companions by showing up for yourself.</p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close Pokédex">
            <X size={18} />
          </button>
        </div>

        <div className="dex-toolbar">
          <div className="search-box">
            <Search size={16} />
            <input
              placeholder="Search Pokémon or dex number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Tag variant="yellow">
            <Coins size={12} /> {coins} coins
          </Tag>
        </div>

        {loading ? (
          <div className="loading-line">
            <span className="spinner" /> Talking to PokéAPI…
          </div>
        ) : (
          <div className="pokemon-grid">
            {filtered.map((item) => {
              const caught = caughtIds.includes(item.id);
              const isPartner = partnerId === item.id;
              return (
                <article
                  className={`pokemon-card ${caught ? 'is-caught' : ''}`}
                  key={`${item.id}-${item.name}`}
                >
                  <div className="pokemon-card-number">
                    #{String(item.id).padStart(3, '0')}
                    {caught && <CheckCircle2 size={13} />}
                  </div>
                  <PokemonSprite pokemon={item} className="pokemon-card-art" artwork />
                  <strong>{slugTitle(item.name)}</strong>
                  {isPartner ? (
                    <Tag variant="green">Your partner</Tag>
                  ) : caught ? (
                    <button className="mini-action" onClick={() => onPartner(item.id)}>
                      Choose partner
                    </button>
                  ) : (
                    <button
                      className="mini-action catch-action"
                      disabled={coins < catchCost}
                      onClick={() => onCatch(item.id, catchCost)}
                    >
                      <Plus size={12} /> Catch · {catchCost}
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        )}

        <p className="tiny-note dex-note">
          Pokémon names and artwork are loaded from PokéAPI’s public data and sprite repository.
          Catching a Pokémon uses in-app coins earned from completed quests.
        </p>
      </section>
    </div>
  );
}

export default PokemonModal;
