import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// PWA Service Worker Registration: Unregister in development, register on window load in production
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  if (import.meta.env.DEV) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const reg of registrations) {
        reg.unregister();
      }
    }).catch(() => {});
  } else {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then((reg) => {
          console.log('[SFCC PWA] Service Worker registered:', reg.scope);
        })
        .catch((err) => {
          console.log('[SFCC PWA] Service Worker registration note:', err);
        });
    });
  }
}

// Global ResizeObserver loop error suppression
if (typeof window !== 'undefined') {
  window.addEventListener(
    'error',
    (event) => {
      if (
        typeof event.message === 'string' &&
        event.message.includes('ResizeObserver loop')
      ) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
    },
    true
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
