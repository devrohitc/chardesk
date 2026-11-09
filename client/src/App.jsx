import React, { useCallback, useEffect, useState } from 'react';
import { initialFinance, initialTasks } from './data/seed';
import { readStore, writeStore, clearPokedeskData } from './utils/storage';
import { fallbackPokemonIndex, fetchPokemonIndex } from './services/pokeapi';
import { getCurrentSession, logoutUser } from './services/authService';
import { TODAY } from './utils/formatters';
import { useSavedState } from './hooks/useSavedState';

import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import JournalPage from './pages/JournalPage';
import RoutinesPage from './pages/RoutinesPage';
import FinancePage from './pages/FinancePage';
import PokedexPage from './pages/PokedexPage';
import SettingsPage from './pages/SettingsPage';

import AppLayout from './layouts/AppLayout';
import FocusTimer from './components/FocusTimer';
import AddQuestModal from './components/AddQuestModal';
import PokemonModal from './components/PokemonModal';
import PokeBallCursor from './components/PokeBallCursor';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const session = getCurrentSession();
    return session?.user || null;
  });

  const handleAuthenticated = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <AuthPage onAuthenticated={handleAuthenticated} />;
  }

  return <AuthenticatedApp currentUser={currentUser} onLogout={handleLogout} />;
}

function AuthenticatedApp({ currentUser, onLogout }) {
  const [page, setPage] = useState('home');
  const [selectedDate, setSelectedDate] = useSavedState('selected-date', TODAY);
  const [tasks, setTasks] = useSavedState('tasks', initialTasks);
  const [completions, setCompletions] = useSavedState('completions', {});
  const [logs, setLogs] = useSavedState('daily-logs', {});
  const [finance, setFinance] = useSavedState('finance', initialFinance);
  const [xp, setXp] = useSavedState('xp', 0);
  const [coins, setCoins] = useSavedState('coins', 30);
  const [caughtIds, setCaughtIds] = useSavedState('caught-pokemon', [25]);
  const [partner, setPartner] = useSavedState('partner-pokemon', 25);
  const [activeBook, setActiveBook] = useState('all');
  const [pokemon, setPokemon] = useState(
    () => readStore('pokemon-index-cache', null)?.items || fallbackPokemonIndex()
  );
  const [pokemonLoading, setPokemonLoading] = useState(true);
  const [pokemonError, setPokemonError] = useState(false);
  const [showFocus, setShowFocus] = useState(false);
  const [showQuestForm, setShowQuestForm] = useState(false);
  const [showDexModal, setShowDexModal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchPokemonIndex()
      .then((items) => {
        if (!cancelled) {
          setPokemon(items);
          setPokemonLoading(false);
          setPokemonError(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPokemon((current) => (current.length ? current : fallbackPokemonIndex()));
          setPokemonLoading(false);
          setPokemonError(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const log = logs[selectedDate] || {};
  const updateLog = useCallback(
    (patch) =>
      setLogs((prev) => ({
        ...prev,
        [selectedDate]: { ...(prev[selectedDate] || {}), ...patch },
      })),
    [selectedDate, setLogs]
  );

  const toggleTask = (taskId) => {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) return;
    const before = completions[selectedDate] || [];
    const alreadyDone = before.includes(taskId);
    setCompletions((prev) => ({
      ...prev,
      [selectedDate]: alreadyDone ? before.filter((id) => id !== taskId) : [...before, taskId],
    }));
    setXp((prev) => Math.max(0, prev + (alreadyDone ? -task.xp : task.xp)));
    setCoins((prev) => Math.max(0, prev + (alreadyDone ? -5 : 5)));
  };

  const addQuest = (title, category) => {
    setTasks((prev) => [
      { id: `q-${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`, title, category, done: false, xp: 10 },
      ...prev,
    ]);
    setShowQuestForm(false);
    setActiveBook(category);
  };

  const catchPokemon = (id, cost) => {
    if (coins < cost || caughtIds.includes(id)) return;
    setCoins((prev) => prev - cost);
    setCaughtIds((prev) => [...prev, id]);
  };

  const exportData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      version: 1,
      trainer: currentUser.username,
      selectedDate,
      tasks,
      completions,
      logs,
      finance,
      xp,
      coins,
      caughtIds,
      partner,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `pokedesk-${currentUser.username}-${selectedDate}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const resetData = () => {
    clearPokedeskData();
    onLogout();
  };

  const recordFocusSession = useCallback(() => {
    setXp((prev) => prev + 15);
    setCoins((prev) => prev + 5);
    const current = readStore('focus-minutes', 0);
    writeStore('focus-minutes', current + 25);
  }, [setXp, setCoins]);

  return (
    <>
    <PokeBallCursor />
    <AppLayout
      page={page}
      setPage={setPage}
      currentUser={currentUser}
      xp={xp}
      onLogout={onLogout}
      onOpenFocus={() => setShowFocus(true)}
    >
      {page === 'home' && (
        <HomePage
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          tasks={tasks}
          completions={completions}
          onToggleTask={toggleTask}
          activeBook={activeBook}
          setActiveBook={setActiveBook}
          xp={xp}
          coins={coins}
          partner={partner}
          pokemon={pokemon}
          openDex={() => setShowDexModal(true)}
          openFocus={() => setShowFocus(true)}
          onAddQuest={() => setShowQuestForm(true)}
          log={log}
          updateLog={updateLog}
          finance={finance}
          setPage={setPage}
          currentUser={currentUser}
        />
      )}
      {page === 'journal' && (
        <JournalPage
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          log={log}
          updateLog={updateLog}
        />
      )}
      {page === 'routines' && (
        <RoutinesPage
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          log={log}
          updateLog={updateLog}
        />
      )}
      {page === 'finance' && (
        <FinancePage
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          finance={finance}
          setFinance={setFinance}
        />
      )}
      {page === 'pokedex' && (
        <PokedexPage
          pokemon={pokemon}
          loading={pokemonLoading}
          error={pokemonError}
          caughtIds={caughtIds}
          coins={coins}
          partnerId={partner}
          onCatch={catchPokemon}
          onPartner={setPartner}
          openDex={() => setShowDexModal(true)}
        />
      )}
      {page === 'settings' && <SettingsPage onReset={resetData} onExport={exportData} />}

      {showFocus && <FocusTimer onClose={() => setShowFocus(false)} onSession={recordFocusSession} />}
      {showQuestForm && <AddQuestModal onClose={() => setShowQuestForm(false)} onAdd={addQuest} />}
      {showDexModal && (
        <PokemonModal
          pokemon={pokemon}
          loading={pokemonLoading}
          caughtIds={caughtIds}
          coins={coins}
          partnerId={partner}
          onClose={() => setShowDexModal(false)}
          onCatch={catchPokemon}
          onPartner={setPartner}
        />
      )}
    </AppLayout>
    </>
  );
}

