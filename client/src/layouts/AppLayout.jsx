import React from 'react';
import {
  Bell,
  BookOpen,
  CalendarDays,
  Gamepad2,
  Home,
  LogOut,
  Menu,
  Sparkles,
  Sprout,
  Wallet,
  Zap,
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'journal', label: 'Journal', icon: BookOpen },
  { id: 'routines', label: 'Routines', icon: Sprout },
  { id: 'finance', label: 'Finance', icon: Wallet },
  { id: 'pokedex', label: 'Pokédex', icon: Gamepad2 },
];

export function AppLayout({
  children,
  page,
  setPage,
  currentUser,
  xp,
  onLogout,
  onOpenFocus,
}) {
  const currentPageLabel = NAV_ITEMS.find((item) => item.id === page)?.label || (page === 'settings' ? 'Settings' : 'Home');
  const trainerLevel = Math.floor(xp / 100) + 1;

  return (
    <div className="app-backdrop">
      <main className="app-shell">
        <header className="app-header">
          <button className="brand" onClick={() => setPage('home')} aria-label="Pokedesk home">
            <span className="brand-mark">
              <span>✦</span>
            </span>
            <span className="brand-word">
              POKEDESK<small>YOUR LIFE ADVENTURE</small>
            </span>
          </button>

          <nav className="main-nav" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`nav-item ${page === item.id ? 'nav-active' : ''}`}
                  onClick={() => setPage(item.id)}
                  title={item.label}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="header-actions">
            <span className="header-level">
              <Sparkles size={13} /> Lv. {trainerLevel}
            </span>
            <div className="header-user-chip">
              <span className="header-user-name">{currentUser.displayName}</span>
              <button
                id="logout-btn"
                className="icon-button logout-btn"
                onClick={onLogout}
                aria-label="Log out"
                title="Switch trainer / Log out"
              >
                <LogOut size={16} />
              </button>
            </div>
            <button
              className="icon-button notification-button"
              onClick={onOpenFocus}
              aria-label="Focus timer"
            >
              <Bell size={17} />
              <i />
            </button>
            <button className="icon-button" aria-label="Settings" onClick={() => setPage('settings')}>
              <Menu size={20} />
            </button>
          </div>
        </header>

        <div className="mobile-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={page === item.id ? 'active' : ''}
                onClick={() => setPage(item.id)}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="toolbar">
          <div className="mode-tabs">
            <button className={page === 'home' ? 'mode-active' : ''} onClick={() => setPage('home')}>
              <Home size={14} /> Portal
            </button>
            <button className="focus-tab" onClick={onOpenFocus}>
              <Zap size={14} fill="currentColor" /> Focus now
            </button>
            <button className={page === 'journal' ? 'mode-active' : ''} onClick={() => setPage('journal')}>
              <CalendarDays size={14} /> Journal
            </button>
          </div>
          <div className="toolbar-right">
            <span className="connection-status">
              <span /> Ready
            </span>
            <span className="current-page-chip">{currentPageLabel}</span>
          </div>
        </div>

        <div className="app-content">{children}</div>

        <footer className="app-footer">
          <span>
            <span className="footer-pokeball">●</span> POKEDESK <span className="footer-divider">/</span> YOUR
            LIFE, ONE QUEST AT A TIME
          </span>
          <span>
            Made for your own little world <span className="footer-heart">♥</span>
          </span>
        </footer>
      </main>
    </div>
  );
}

export default AppLayout;

