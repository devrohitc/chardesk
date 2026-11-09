import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { questBooks } from '../data/seed';

export function AddQuestModal({ onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('daily');

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <form
        className="simple-modal"
        onSubmit={(event) => {
          event.preventDefault();
          if (title.trim()) onAdd(title.trim(), category);
        }}
      >
        <button type="button" className="icon-button modal-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        <span className="eyebrow">NEW MISSION</span>
        <h2>Add a quest</h2>
        <p className="muted">Turn one small intention into your next win.</p>
        <label className="form-label">
          Quest name
          <input
            autoFocus
            maxLength={100}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Read for 20 minutes"
          />
        </label>
        <label className="form-label">
          Quest book
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {questBooks
              .filter((book) => book.id !== 'all')
              .map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
          </select>
        </label>
        <button className="primary-button full-button" type="submit" disabled={!title.trim()}>
          Create quest <Plus size={16} />
        </button>
      </form>
    </div>
  );
}

export default AddQuestModal;

