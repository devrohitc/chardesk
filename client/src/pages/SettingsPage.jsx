import React, { useState } from 'react';
import { ArrowRight, Gamepad2, Settings2, ShieldCheck } from 'lucide-react';
import { Tag } from '../components/Tag';

export function SettingsPage({ onReset, onExport }) {
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="page-content">
      <div className="page-intro">
        <div>
          <span className="eyebrow">YOUR SPACE, YOUR RULES</span>
          <h1>
            Settings <span className="wave">✦</span>
          </h1>
          <p className="muted">Your first Pokedesk build is local-first and personal.</p>
        </div>
      </div>

      <div className="settings-grid">
        <article className="panel settings-card">
          <div className="routine-icon lavender">
            <ShieldCheck size={20} />
          </div>
          <h2>Privacy & storage</h2>
          <p className="muted">
            Your goals, journal entries, routines and finance data are saved to localStorage in this browser.
            They are not uploaded to a Pokedesk server.
          </p>
          <button className="secondary-button" onClick={onExport}>
            Export my data <ArrowRight size={14} />
          </button>
        </article>

        <article className="panel settings-card">
          <div className="routine-icon peach">
            <Gamepad2 size={20} />
          </div>
          <h2>Theme & world</h2>
          <p className="muted">
            This MVP focuses on one Pokémon-inspired light theme, matching the visual direction you shared.
            The theme layer is separated in CSS for easier future expansion.
          </p>
          <Tag variant="green">Adventure meadow · Active</Tag>
        </article>

        <article className="panel settings-card danger-card">
          <div className="routine-icon red">
            <Settings2 size={20} />
          </div>
          <h2>Reset local data</h2>
          <p className="muted">
            This permanently removes Pokedesk data saved in this browser. Export it first if you want to keep
            a copy.
          </p>
          {confirmReset ? (
            <div className="confirm-actions">
              <button className="danger-button" onClick={onReset}>
                Yes, reset everything
              </button>
              <button className="secondary-button" onClick={() => setConfirmReset(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <button className="secondary-button danger-outline" onClick={() => setConfirmReset(true)}>
              Reset local data
            </button>
          )}
        </article>
      </div>

      <p className="tiny-note routine-disclaimer">
        Before using this for sensitive long-term records, remember that browser-local storage can be cleared by
        browser settings or device loss. Regularly export your data.
      </p>
    </div>
  );
}

export default SettingsPage;

