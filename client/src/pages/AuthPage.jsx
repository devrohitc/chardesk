import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Sparkles, User, Lock, ChevronRight, UserPlus, ArrowLeft } from 'lucide-react';
import { loginUser, registerUser, getRegisteredUsers, STARTER_AVATARS } from '../services/authService';

function pokemonAvatarUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

function TrainerCard({ trainer, onClick }) {
  const avatarId = STARTER_AVATARS[trainer.avatar ?? 0];
  return (
    <button className="auth-trainer-card" onClick={onClick} type="button">
      <div className="auth-trainer-avatar">
        <img
          src={pokemonAvatarUrl(avatarId)}
          alt={trainer.displayName}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
      <div className="auth-trainer-info">
        <strong>{trainer.displayName}</strong>
        <span>@{trainer.username}</span>
      </div>
      <ChevronRight size={16} className="auth-trainer-arrow" />
    </button>
  );
}

function LoginForm({ onLogin, onBack, prefillUsername }) {
  const [username, setUsername] = useState(prefillUsername || '');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await loginUser({ username, password });
    setLoading(false);
    if (result.ok) {
      onLogin(result.user);
    } else {
      setError(result.error);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {onBack && (
        <button type="button" className="auth-back-btn" onClick={onBack}>
          <ArrowLeft size={15} /> Switch trainer
        </button>
      )}
      <div className="auth-form-header">
        <span className="eyebrow">WELCOME BACK</span>
        <h2>Log in, Trainer</h2>
        <p className="muted">Your adventure awaits. Pick up where you left off.</p>
      </div>

      {error && (
        <div className="auth-error" role="alert">
          <span>⚠</span> {error}
        </div>
      )}

      <label className="auth-field">
        <span>Trainer ID</span>
        <div className="auth-input-wrap">
          <User size={15} className="auth-input-icon" />
          <input
            id="login-username"
            type="text"
            autoComplete="username"
            autoFocus={!prefillUsername}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your-trainer-id"
            required
          />
        </div>
      </label>

      <label className="auth-field">
        <span>Password</span>
        <div className="auth-input-wrap">
          <Lock size={15} className="auth-input-icon" />
          <input
            id="login-password"
            type={showPass ? 'text' : 'password'}
            autoComplete="current-password"
            autoFocus={!!prefillUsername}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            className="auth-eye-btn"
            onClick={() => setShowPass((v) => !v)}
            aria-label={showPass ? 'Hide password' : 'Show password'}
          >
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </label>

      <button
        id="login-submit-btn"
        className="auth-primary-btn"
        type="submit"
        disabled={loading || !username.trim() || !password}
      >
        {loading ? (
          <>
            <span className="spinner" /> Entering the world…
          </>
        ) : (
          <>
            Start Adventure <ChevronRight size={16} />
          </>
        )}
      </button>
    </form>
  );
}

function RegisterForm({ onRegister, onBack }) {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match. Try again!');
      return;
    }
    setLoading(true);
    const result = await registerUser({ username, displayName, password });
    setLoading(false);
    if (result.ok) {
      onRegister(result.user);
    } else {
      setError(result.error);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <button type="button" className="auth-back-btn" onClick={onBack}>
        <ArrowLeft size={15} /> Back
      </button>
      <div className="auth-form-header">
        <span className="eyebrow">NEW ADVENTURE</span>
        <h2>Create your Trainer</h2>
        <p className="muted">Every legend starts with a first step. Begin yours.</p>
      </div>

      {error && (
        <div className="auth-error" role="alert">
          <span>⚠</span> {error}
        </div>
      )}

      <label className="auth-field">
        <span>
          Trainer Name <span className="auth-optional">(display name)</span>
        </span>
        <div className="auth-input-wrap">
          <Sparkles size={15} className="auth-input-icon" />
          <input
            id="reg-displayname"
            type="text"
            autoComplete="name"
            autoFocus
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Ash Ketchum"
            maxLength={40}
          />
        </div>
      </label>

      <label className="auth-field">
        <span>
          Trainer ID <span className="auth-required">*</span>
        </span>
        <div className="auth-input-wrap">
          <User size={15} className="auth-input-icon" />
          <input
            id="reg-username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
            placeholder="ash-ketchum"
            minLength={3}
            maxLength={30}
            required
          />
        </div>
        <small className="auth-hint">Lowercase, no spaces. Min 3 characters.</small>
      </label>

      <label className="auth-field">
        <span>
          Password <span className="auth-required">*</span>
        </span>
        <div className="auth-input-wrap">
          <Lock size={15} className="auth-input-icon" />
          <input
            id="reg-password"
            type={showPass ? 'text' : 'password'}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
            minLength={6}
            required
          />
          <button
            type="button"
            className="auth-eye-btn"
            onClick={() => setShowPass((v) => !v)}
            aria-label={showPass ? 'Hide password' : 'Show password'}
          >
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </label>

      <label className="auth-field">
        <span>
          Confirm Password <span className="auth-required">*</span>
        </span>
        <div className="auth-input-wrap">
          <Lock size={15} className="auth-input-icon" />
          <input
            id="reg-confirm-password"
            type={showPass ? 'text' : 'password'}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
            required
          />
        </div>
      </label>

      <button
        id="register-submit-btn"
        className="auth-primary-btn"
        type="submit"
        disabled={loading || !username.trim() || !password || !confirmPassword}
      >
        {loading ? (
          <>
            <span className="spinner" /> Creating trainer…
          </>
        ) : (
          <>
            Begin Adventure <Sparkles size={16} />
          </>
        )}
      </button>
    </form>
  );
}

export function AuthPage({ onAuthenticated }) {
  const [view, setView] = useState('landing');
  const [prefillUsername, setPrefillUsername] = useState('');
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    setTrainers(getRegisteredUsers());
  }, []);

  const handleLogin = (user) => {
    onAuthenticated(user);
  };

  const handleRegister = (user) => {
    onAuthenticated(user);
  };

  const selectTrainer = (trainer) => {
    setPrefillUsername(trainer.username);
    setView('login');
  };

  return (
    <div className="auth-backdrop">
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="auth-orb auth-orb-3" />

      <div className="auth-shell">
        <div className="auth-brand-panel">
          <div className="auth-brand-logo">
            <div className="auth-brand-mark">
              <span>✦</span>
            </div>
            <div className="auth-brand-text">
              <span className="auth-brand-name">POKEDESK</span>
              <small>YOUR LIFE ADVENTURE</small>
            </div>
          </div>

          <div className="auth-brand-hero">
            <div className="auth-hero-scene">
              <div className="auth-cloud auth-cloud-a" />
              <div className="auth-cloud auth-cloud-b" />
              <div className="auth-shrine">
                <div className="auth-shrine-roof auth-roof-1" />
                <div className="auth-shrine-roof auth-roof-2" />
                <div className="auth-shrine-top" />
                <div className="auth-shrine-cols">
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
                <div className="auth-shrine-base" />
              </div>
              <span className="auth-flower auth-fl-a">✿</span>
              <span className="auth-flower auth-fl-b">✿</span>
              <span className="auth-flower auth-fl-c">✿</span>
              <span className="auth-grass auth-gr-a">✳</span>
              <span className="auth-grass auth-gr-b">✳</span>
              <span className="auth-grass auth-gr-c">✳</span>
              <div className="auth-pikachu-wrap">
                <img
                  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
                  alt="Pikachu"
                  className="auth-pikachu"
                />
              </div>
            </div>
          </div>

          <div className="auth-brand-tagline">
            <h1>
              Level up your life,
              <br />
              one quest at a time.
            </h1>
            <p>
              Track quests, build routines, manage finances, and collect Pokémon companions — all in one
              adventure.
            </p>
          </div>

          <div className="auth-feature-pills">
            <span>⚡ Daily Quests</span>
            <span>📓 Journal</span>
            <span>💰 Finance</span>
            <span>🎮 Pokédex</span>
          </div>
        </div>

        <div className="auth-form-panel">
          {view === 'landing' && (
            <div className="auth-landing">
              <div className="auth-form-header">
                <span className="eyebrow">TRAINER PORTAL</span>
                <h2>Choose your trainer</h2>
                <p className="muted">Select an existing trainer or start a new adventure.</p>
              </div>

              {trainers.length > 0 && (
                <div className="auth-trainer-list">
                  {trainers.map((t) => (
                    <TrainerCard key={t.id} trainer={t} onClick={() => selectTrainer(t)} />
                  ))}
                </div>
              )}

              <div className="auth-divider">
                <span>{trainers.length > 0 ? 'or' : 'get started'}</span>
              </div>

              <div className="auth-landing-actions">
                <button
                  id="go-to-login-btn"
                  className="auth-primary-btn"
                  type="button"
                  onClick={() => {
                    setPrefillUsername('');
                    setView('login');
                  }}
                >
                  <User size={16} /> Log in with ID
                </button>
                <button
                  id="go-to-register-btn"
                  className="auth-secondary-btn"
                  type="button"
                  onClick={() => setView('register')}
                >
                  <UserPlus size={16} /> Create new trainer
                </button>
              </div>

              <p className="auth-local-note">
                <Lock size={11} /> All data is secured and synced for your trainer ID.
              </p>
            </div>
          )}

          {view === 'login' && (
            <LoginForm
              onLogin={handleLogin}
              onBack={() => setView('landing')}
              prefillUsername={prefillUsername}
            />
          )}

          {view === 'register' && (
            <RegisterForm onRegister={handleRegister} onBack={() => setView('landing')} />
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;

