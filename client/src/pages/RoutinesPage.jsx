import React from 'react';
import { CalendarDays, Check, ChevronLeft, ChevronRight, Dumbbell, Leaf, Plus, Utensils } from 'lucide-react';
import { shiftDate } from '../utils/formatters';

export function RoutinesPage({ selectedDate, setSelectedDate, log, updateLog }) {
  const meals = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  return (
    <div className="page-content">
      <div className="page-intro">
        <div>
          <span className="eyebrow">CARE FOR YOUR PLAYER ONE</span>
          <h1>
            Daily routines <span className="wave">✦</span>
          </h1>
          <p className="muted">Train, fuel up and recover. Your health is the main quest.</p>
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

      <div className="routine-grid">
        <section className="panel routine-card">
          <div className="routine-icon mint">
            <Dumbbell size={22} />
          </div>
          <span className="eyebrow">FITNESS</span>
          <h2>Gym check-in</h2>
          <p className="muted">Show up for your body, even if it’s a lighter day.</p>
          <button
            className={`primary-button ${log.gym ? 'done-button' : ''}`}
            onClick={() => updateLog({ gym: !log.gym })}
          >
            {log.gym ? (
              <>
                <Check size={15} /> Checked in
              </>
            ) : (
              <>
                <Plus size={15} /> Check in today
              </>
            )}
          </button>
          <label className="form-label">
            Workout notes
            <textarea
              value={log.workout || ''}
              onChange={(e) => updateLog({ workout: e.target.value })}
              placeholder="Push day, 45 min walk, recovery…"
            />
          </label>
        </section>

        <section className="panel routine-card">
          <div className="routine-icon peach">
            <Utensils size={22} />
          </div>
          <span className="eyebrow">NUTRITION</span>
          <h2>Meals & fuel</h2>
          <p className="muted">A simple record of what you eat. No judgment, just awareness.</p>
          {meals.map((meal) => (
            <label className="meal-row" key={meal}>
              <span>{meal}</span>
              <input
                value={(log.meals || {})[meal] || ''}
                onChange={(e) =>
                  updateLog({
                    meals: { ...(log.meals || {}), [meal]: e.target.value },
                  })
                }
                placeholder="What did you have?"
              />
            </label>
          ))}
          <label className="form-label water-label">
            Water glasses
            <div className="counter-control">
              <button
                onClick={() => updateLog({ water: Math.max(0, Number(log.water || 0) - 1) })}
                aria-label="Decrease water"
              >
                −
              </button>
              <strong>{Number(log.water || 0)}</strong>
              <button
                onClick={() => updateLog({ water: Math.min(30, Number(log.water || 0) + 1) })}
                aria-label="Add water"
              >
                +
              </button>
              <span className="muted small-text">goal: 8</span>
            </div>
          </label>
        </section>

        <section className="panel routine-card">
          <div className="routine-icon lavender">
            <Leaf size={22} />
          </div>
          <span className="eyebrow">WELLNESS</span>
          <h2>Daily care</h2>
          <p className="muted">Small, repeatable rituals are powerful.</p>
          <label className="form-label">
            Skincare / grooming notes
            <textarea
              value={log.grooming || ''}
              onChange={(e) => updateLog({ grooming: e.target.value })}
              placeholder="AM routine, sunscreen, haircare…"
            />
          </label>
          <label className="check-row">
            <input
              type="checkbox"
              checked={Boolean(log.supplements)}
              onChange={(e) => updateLog({ supplements: e.target.checked })}
            />
            <span>
              <strong>Supplement logged</strong>
              <small>Record that you followed your usual plan.</small>
            </span>
          </label>
          <label className="form-label">
            Sleep (hours)
            <input
              type="number"
              min="0"
              max="24"
              step="0.25"
              value={log.sleep || ''}
              onChange={(e) => updateLog({ sleep: e.target.value })}
              placeholder="e.g. 7.5"
            />
          </label>
          <label className="form-label">
            Mood today
            <select value={log.mood || ''} onChange={(e) => updateLog({ mood: e.target.value })}>
              <option value="">Choose a mood…</option>
              <option>Great</option>
              <option>Good</option>
              <option>Okay</option>
              <option>Low</option>
              <option>Overwhelmed</option>
            </select>
          </label>
        </section>
      </div>
      <p className="tiny-note routine-disclaimer">
        Personal tracking only. This prototype does not provide medical, dietetic or supplement advice.
      </p>
    </div>
  );
}

export default RoutinesPage;
