import React, { useState, useEffect } from 'react';
import { Focus, Sparkles, X } from 'lucide-react';

export function FocusTimer({ onClose, onSession }) {
  const [mode, setMode] = useState('focus');
  const durations = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };
  const [remaining, setRemaining] = useState(durations.focus);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!running) return undefined;
    const timer = window.setInterval(() => setRemaining((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [running, mode]);

  useEffect(() => {
    if (remaining !== 0 || !running) return;
    setRunning(false);
    setCompleted(true);
    if (mode === 'focus') onSession?.();
  }, [remaining, running, mode, onSession]);

  const selectMode = (nextMode) => {
    setMode(nextMode);
    setRemaining(durations[nextMode]);
    setRunning(false);
    setCompleted(false);
  };

  const reset = () => {
    setRunning(false);
    setRemaining(durations[mode]);
    setCompleted(false);
  };

  const minutes = String(Math.floor(remaining / 60)).padStart(2, '0');
  const seconds = String(remaining % 60).padStart(2, '0');
  const progress = ((durations[mode] - remaining) / durations[mode]) * 100;

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section className="focus-modal" role="dialog" aria-modal="true" aria-labelledby="focus-title">
        <button className="icon-button modal-close" onClick={onClose} aria-label="Close focus timer">
          <X size={18} />
        </button>
        <div className="focus-modal-mark">
          <Focus size={20} />
        </div>
        <span className="eyebrow">TRAIN YOUR ATTENTION</span>
        <h2 id="focus-title">Focus, trainer.</h2>
        <p className="muted">One quest. One window. No distractions.</p>
        <div className="timer-modes">
          {[
            ['focus', 'Focus'],
            ['short', 'Short break'],
            ['long', 'Long break'],
          ].map(([key, label]) => (
            <button
              key={key}
              className={mode === key ? 'selected' : ''}
              onClick={() => selectMode(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="timer-ring" style={{ '--timer-progress': `${progress}%` }}>
          <div>
            <strong>
              {minutes}:{seconds}
            </strong>
            <span>{completed ? 'SESSION COMPLETE' : running ? 'IN FOCUS' : 'READY WHEN YOU ARE'}</span>
          </div>
        </div>
        {completed && (
          <p className="success-note">
            <Sparkles size={15} /> Nice work! One focus session added.
          </p>
        )}
        <div className="timer-actions">
          <button
            className="primary-button"
            onClick={() => {
              if (remaining === 0) {
                setRemaining(durations[mode]);
                setCompleted(false);
                setRunning(true);
              } else {
                setRunning((value) => !value);
              }
            }}
          >
            {running ? 'Pause session' : remaining === 0 ? 'Start again' : 'Start focus'}
            {running ? ' Ⅱ' : ' →'}
          </button>
          <button className="secondary-button" onClick={reset}>
            Reset
          </button>
        </div>
        <p className="tiny-note">Keep Pokedesk open while the timer runs. Browser notifications are not required.</p>
      </section>
    </div>
  );
}

export default FocusTimer;
