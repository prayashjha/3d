import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

class ErrorBoundary extends React.Component<
  {children: React.ReactNode},
  {error: Error | null}
> {
  state = {error: null as Error | null};
  static getDerivedStateFromError(error: Error) {
    return {error};
  }
  componentDidCatch(error: Error) {
    console.error('[TOOLSX 3D] Runtime error:', error);
  }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: '#111319', color: '#e1e2ea', fontFamily: 'system-ui, sans-serif', textAlign: 'center'}}>
        <div style={{maxWidth: 480}}>
          <h1 style={{fontSize: 20, marginBottom: 8}}>Something went wrong</h1>
          <p style={{opacity: 0.8, marginBottom: 16}}>The 3D app hit an unexpected error. Please reload the page.</p>
          <button onClick={() => window.location.reload()} style={{background: '#00f5a0', color: '#003921', border: 0, borderRadius: 6, padding: '10px 18px', cursor: 'pointer', fontWeight: 600}}>
            Reload
          </button>
        </div>
      </div>
    );
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
