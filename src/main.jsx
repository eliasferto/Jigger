import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Polyfill window.storage para compatibilidad con el entorno de desarrollo
if (!window.storage) {
  window.storage = {
    get: (key) => {
      try { const v = localStorage.getItem(key); return Promise.resolve(v ? { key, value: v } : null); }
      catch { return Promise.resolve(null); }
    },
    set: (key, value) => {
      try { localStorage.setItem(key, value); return Promise.resolve({ key, value }); }
      catch { return Promise.resolve(null); }
    },
    delete: (key) => {
      try { localStorage.removeItem(key); return Promise.resolve({ key, deleted: true }); }
      catch { return Promise.resolve(null); }
    },
    list: (prefix) => {
      try {
        const keys = Object.keys(localStorage).filter(k => !prefix || k.startsWith(prefix));
        return Promise.resolve({ keys });
      } catch { return Promise.resolve({ keys: [] }); }
    }
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
