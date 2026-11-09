import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/styles.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, fontFamily: 'monospace', background: '#1a1a2e', color: '#f0f0f0', minHeight: '100vh' }}>
          <h2 style={{ color: '#e77eae' }}>⚠ Pokedesk crashed</h2>
          <p style={{ color: '#aaa', marginBottom: 16 }}>Error: <strong style={{ color: '#f5b3ce' }}>{this.state.error.message}</strong></p>
          <pre style={{ background: '#111', padding: 16, borderRadius: 8, overflow: 'auto', fontSize: 12, color: '#ccc' }}>{this.state.error.stack}</pre>
          <button
            onClick={() => {
              localStorage.removeItem('pokedesk:session');
              sessionStorage.removeItem('pokedesk:session');
              window.location.reload();
            }}
            style={{ marginTop: 20, padding: '10px 20px', background: '#2d8259', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}
          >
            Clear session &amp; Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
