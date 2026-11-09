import React, { useState } from 'react';
import { ArrowRight, BookOpen, CalendarDays, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { formatDate, shiftDate } from '../utils/formatters';
import { Tag } from '../components/Tag';

export function JournalPage({ selectedDate, setSelectedDate, log, updateLog }) {
  const prompts = [
    'What was the best part of today?',
    'What did I learn about myself?',
    'What is one thing I want to do differently tomorrow?',
  ];
  const [promptIndex, setPromptIndex] = useState(0);

  return (
    <div className="page-content">
      <div className="page-intro">
        <div>
          <span className="eyebrow">YOUR PRIVATE CHRONICLE</span>
          <h1>
            Dear diary <span className="wave">✦</span>
          </h1>
          <p className="muted">Capture the little moments. Your future self will thank you.</p>
        </div>
        <div className="date-picker">
          <button
            className="icon-button"
            onClick={() => setSelectedDate(shiftDate(selectedDate, -1))}
            aria-label="Previous day"
          >
            <ChevronLeft size={17} />
          </button>
          <label>
            <CalendarDays size={15} />
            <input
              aria-label="Journal date"
              type="date"
              value={selectedDate}
              onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
            />
          </label>
          <button
            className="icon-button"
            onClick={() => setSelectedDate(shiftDate(selectedDate, 1))}
            aria-label="Next day"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>

      <div className="journal-layout">
        <aside className="panel journal-sidebar">
          <div className="journal-stamp">✿</div>
          <span className="eyebrow">YOUR STORY, YOUR SPACE</span>
          <h2>{formatDate(selectedDate, { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
          <p className="muted">No pressure to make it perfect. Just make it yours.</p>
          <div className="privacy-note">
            <ShieldCheck size={16} />
            <div>
              <strong>Private by default</strong>
              <span>Your entry is saved in this browser on this device.</span>
            </div>
          </div>
          <div className="journal-prompt">
            <span className="eyebrow">A LITTLE INSPIRATION</span>
            <p>“{prompts[promptIndex]}”</p>
            <button
              className="text-action"
              onClick={() => setPromptIndex((promptIndex + 1) % prompts.length)}
            >
              Another prompt <ArrowRight size={14} />
            </button>
          </div>
        </aside>

        <section className="panel journal-editor">
          <div className="editor-toolbar">
            <Tag variant="green">DAILY ENTRY</Tag>
            <span>
              <span className="saved-dot" /> Auto-saved
            </span>
          </div>
          <input
            className="journal-title-input"
            placeholder="Give today a title (optional)"
            value={log.journalTitle || ''}
            onChange={(e) => updateLog({ journalTitle: e.target.value })}
          />
          <textarea
            className="journal-main-textarea"
            placeholder="Start writing…&#10;&#10;What did you do today? What felt good? What was difficult? What do you want to remember?"
            value={log.journal || ''}
            onChange={(e) => updateLog({ journal: e.target.value })}
            maxLength={20000}
          />
          <div className="editor-footer">
            <span>
              <BookOpen size={14} />{' '}
              {(log.journal || '').trim() ? (log.journal || '').trim().split(/\s+/).length : 0} words
            </span>
            <span>{(log.journal || '').length}/20,000 characters</span>
          </div>
        </section>
      </div>
    </div>
  );
}

export default JournalPage;
