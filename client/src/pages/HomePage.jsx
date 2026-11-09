import React from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Coins,
  Dumbbell,
  Gamepad2,
  Heart,
  Plus,
  Sparkles,
  Sprout,
  Trophy,
  Utensils,
  Zap,
} from 'lucide-react';
import { questBooks } from '../data/seed';
import { readStore } from '../utils/storage';
import { formatDate, shiftDate, slugTitle, CURRENCY, TODAY } from '../utils/formatters';
import { PokemonSprite } from '../components/PokemonSprite';
import { Tag } from '../components/Tag';
import { SectionHeading } from '../components/SectionHeading';

export function HomePage({
  selectedDate,
  setSelectedDate,
  tasks,
  completions,
  onToggleTask,
  activeBook,
  setActiveBook,
  xp,
  coins,
  partner,
  pokemon,
  openDex,
  openFocus,
  onAddQuest,
  log,
  updateLog,
  finance,
  setPage,
  currentUser,
}) {
  const completed = completions[selectedDate] || [];
  const filteredTasks = tasks.filter((task) => activeBook === 'all' || task.category === activeBook);
  const progress = tasks.length ? Math.round((completed.length / tasks.length) * 100) : 0;
  const todaySpend = finance.expenses
    .filter((item) => item.date === selectedDate)
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const water = Number(log.water || 0);
  const partnerPokemon = pokemon.find((item) => item.id === partner) || pokemon.find((item) => item.id === 25);
  const dateLabel = formatDate(selectedDate, { weekday: 'long', month: 'long', day: 'numeric' });
  const trainerName = currentUser?.displayName || 'trainer';

  return (
    <>
      <div className="page-intro">
        <div>
          <span className="eyebrow">YOUR DAILY ADVENTURE</span>
          <h1>
            Hey, {trainerName} <span className="wave">✦</span>
          </h1>
          <p className="muted">A little progress goes a long way. What's your next move?</p>
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
              aria-label="Selected date"
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
          <button className="today-button" onClick={() => setSelectedDate(TODAY)}>
            Today
          </button>
        </div>
      </div>

      <section className="hero-grid">
        <article className="world-card">
          <div className="world-topline">
            <Tag variant="green">
              <span className="live-dot" /> YOUR WORLD
            </Tag>
            <button className="world-menu" onClick={openDex} aria-label="Open Pokédex">
              <Gamepad2 size={17} />
            </button>
          </div>
          <div className="world-scene" role="img" aria-label="A pixel-inspired Pokémon meadow with your companion">
            <div className="cloud cloud-one" />
            <div className="cloud cloud-two" />
            <div className="shrine">
              <div className="shrine-roof roof-one" />
              <div className="shrine-roof roof-two" />
              <div className="shrine-top" />
              <div className="shrine-columns">
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="shrine-base" />
            </div>
            <span className="flower flower-a">✿</span>
            <span className="flower flower-b">✿</span>
            <span className="flower flower-c">✿</span>
            <span className="flower flower-d">✿</span>
            <span className="flower flower-e">✿</span>
            <span className="grass grass-a">✳</span>
            <span className="grass grass-b">✳</span>
            <span className="grass grass-c">✳</span>
            <span className="grass grass-d">✳</span>
            <span className="grass grass-e">✳</span>
            <div className="world-pokemon pokemon-left">
              {pokemon.find((item) => item.id === 1) && (
                <PokemonSprite pokemon={pokemon.find((item) => item.id === 1)} />
              )}
            </div>
            <div className="world-pokemon pokemon-right">
              {pokemon.find((item) => item.id === 4) && (
                <PokemonSprite pokemon={pokemon.find((item) => item.id === 4)} />
              )}
            </div>
            <div className="world-partner">
              <PokemonSprite pokemon={partnerPokemon} artwork />
              <span>{slugTitle(partnerPokemon?.name || 'Pikachu')}</span>
            </div>
            <div className="world-map-label">
              <span>⌖</span> MEADOW ROUTE <span className="route-dot" />
            </div>
          </div>
          <div className="world-footer">
            <div>
              <span className="eyebrow">YOUR PARTNER</span>
              <strong>{slugTitle(partnerPokemon?.name || 'Pikachu')}</strong>
              <span className="muted small-text">Growing with every quest.</span>
            </div>
            <button className="secondary-button" onClick={openDex}>
              Open Pokédex <ArrowRight size={14} />
            </button>
          </div>
        </article>

        <div className="hero-right">
          <article className="stats-card">
            <div className="stats-head">
              <div>
                <span className="eyebrow">TRAINER SUMMARY</span>
                <strong>{dateLabel}</strong>
              </div>
              <span className="weather-sticker">☀</span>
            </div>
            <div className="stats-row">
              <div className="stat">
                <span>Focus time</span>
                <strong>
                  {Math.floor((readStore('focus-minutes', 0) || 0) / 60)}
                  <small>h</small> {(readStore('focus-minutes', 0) || 0) % 60}
                  <small>m</small>
                </strong>
              </div>
              <div className="stat">
                <span>Quests done</span>
                <strong>
                  {completed.length}
                  <small>/{tasks.length}</small>
                </strong>
              </div>
              <div className="stat">
                <span>New cheers</span>
                <strong>
                  {Math.floor(xp / 50)}
                  <small>✦</small>
                </strong>
              </div>
            </div>
            <div className="trainer-level">
              <PokemonSprite pokemon={partnerPokemon} className="level-avatar" />
              <div className="level-content">
                <div className="level-heading">
                  <strong>LV. {Math.floor(xp / 100) + 1} TRAINER</strong>
                  <span>{xp} XP</span>
                </div>
                <div className="xp-track">
                  <span style={{ width: `${xp % 100}%` }} />
                </div>
                <span className="tiny-note">{100 - (xp % 100)} XP to the next level</span>
              </div>
              <Trophy size={20} className="level-trophy" />
            </div>
          </article>
          <article className="focus-card">
            <div className="focus-illustration">
              <span className="focus-spark">✧</span>
              <div className="focus-pokemon">
                {partnerPokemon && <PokemonSprite pokemon={partnerPokemon} artwork />}
              </div>
            </div>
            <div className="focus-copy">
              <Tag variant="yellow">
                <Zap size={12} /> TRAINER MODE
              </Tag>
              <h3>
                Make some
                <br />
                progress today.
              </h3>
              <p>One focused session can change the whole day.</p>
              <button className="primary-button" onClick={openFocus}>
                Focus now <ArrowRight size={14} />
              </button>
            </div>
          </article>
        </div>
      </section>

      <section className="quick-stats-grid">
        <button className="quick-stat" onClick={() => setPage('routines')}>
          <span className="quick-icon mint">
            <Dumbbell size={18} />
          </span>
          <span>
            <small>GYM CHECK-IN</small>
            <strong>{log.gym ? 'Done for today' : 'Not checked in'}</strong>
          </span>
          <span className={`mini-status ${log.gym ? 'done' : ''}`}>
            {log.gym ? <Check size={14} /> : <Plus size={14} />}
          </span>
        </button>
        <button className="quick-stat" onClick={() => setPage('routines')}>
          <span className="quick-icon peach">
            <Utensils size={18} />
          </span>
          <span>
            <small>WATER INTAKE</small>
            <strong>{water} / 8 glasses</strong>
            <span className="micro-progress">
              <i style={{ width: `${Math.min((water / 8) * 100, 100)}%` }} />
            </span>
          </span>
          <span className="mini-status">
            <Plus size={14} />
          </span>
        </button>
        <button className="quick-stat" onClick={() => setPage('finance')}>
          <span className="quick-icon lavender">
            <CircleDollarSign size={18} />
          </span>
          <span>
            <small>SPENT TODAY</small>
            <strong>{CURRENCY.format(todaySpend)}</strong>
          </span>
          <span className="mini-status">
            <ArrowDownRight size={15} />
          </span>
        </button>
      </section>

      <section className="quest-section">
        <SectionHeading
          eyebrow="YOUR MISSION BOARD"
          title="Pick a quest book"
          action="Add a quest +"
          onAction={onAddQuest}
        />
        <div className="quest-books">
          {questBooks.map((book) => {
            const count = book.id === 'all' ? tasks.length : tasks.filter((task) => task.category === book.id).length;
            const doneCount =
              book.id === 'all'
                ? completed.length
                : tasks.filter((task) => task.category === book.id && completed.includes(task.id)).length;
            return (
              <button
                key={book.id}
                className={`quest-book book-${book.color} ${activeBook === book.id ? 'active' : ''}`}
                onClick={() => setActiveBook(book.id)}
              >
                <span className="book-tabs">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="book-number">
                  {String(doneCount).padStart(2, '0')} / {String(count).padStart(2, '0')}
                </span>
                <span className="book-emoji">{book.icon}</span>
                <strong>{book.title}</strong>
                <span className="book-hint">{book.hint}</span>
                <span className="book-edge" />
              </button>
            );
          })}
        </div>
      </section>

      <section className="bottom-grid">
        <article className="panel quest-list-panel">
          <SectionHeading
            eyebrow="MAKE IT COUNT"
            title={
              activeBook === 'all'
                ? 'Today’s quests'
                : questBooks.find((book) => book.id === activeBook)?.title || 'Today’s quests'
            }
            action="Add quest"
            onAction={onAddQuest}
          />
          <div className="quest-progress-line">
            <div className="progress-track">
              <span style={{ width: `${progress}%` }} />
            </div>
            <span>{progress}%</span>
          </div>
          <div className="task-list">
            {filteredTasks.length ? (
              filteredTasks.map((task) => {
                const done = completed.includes(task.id);
                return (
                  <div className={`task-row ${done ? 'task-done' : ''}`} key={task.id}>
                    <button
                      className={`task-check ${done ? 'checked' : ''}`}
                      onClick={() => onToggleTask(task.id)}
                      aria-label={done ? `Uncomplete ${task.title}` : `Complete ${task.title}`}
                    >
                      {done && <Check size={14} />}
                    </button>
                    <button className="task-title-button" onClick={() => onToggleTask(task.id)}>
                      {task.title}
                    </button>
                    <span className="task-xp">+{task.xp} XP</span>
                  </div>
                );
              })
            ) : (
              <div className="empty-state">
                <Sprout size={26} />
                <strong>A fresh page</strong>
                <span>Add your first quest to this book.</span>
              </div>
            )}
          </div>
          <div className="quest-list-footer">
            <span>
              <CheckCircle2 size={14} /> {completed.length} completed today
            </span>
            <span>
              <Coins size={14} /> {coins} coins
            </span>
          </div>
        </article>

        <article className="panel journal-mini">
          <SectionHeading
            eyebrow="A MOMENT FOR YOU"
            title="Daily journal"
            action="Open journal"
            onAction={() => setPage('journal')}
          />
          <p className="journal-date">
            <CalendarDays size={14} />{' '}
            {formatDate(selectedDate, { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
          <textarea
            value={log.journal || ''}
            onChange={(event) => updateLog({ journal: event.target.value })}
            placeholder="What happened today? What are you grateful for? Write it down…"
            maxLength={5000}
          />
          <div className="journal-footer">
            <span>
              <CheckCircle2 size={13} /> Saved locally on this device
            </span>
            <span>{(log.journal || '').length}/5000</span>
          </div>
          <div
            className="prompt-chip"
            onClick={() =>
              updateLog({ journal: `${log.journal ? `${log.journal}\n\n` : ''}One win from today: ` })
            }
            role="button"
            tabIndex={0}
            onKeyDown={(e) =>
              e.key === 'Enter' &&
              updateLog({ journal: `${log.journal ? `${log.journal}\n\n` : ''}One win from today: ` })
            }
          >
            <Sparkles size={14} /> Prompt me: one win from today <ArrowRight size={12} />
          </div>
        </article>
      </section>

      <div className="gentle-reminder">
        <Heart size={15} fill="currentColor" />
        <span>Consistency over perfection. Rest days and missed quests are part of the journey too.</span>
        <span className="reminder-spark">✧</span>
      </div>
    </>
  );
}

export default HomePage;
