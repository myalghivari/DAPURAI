import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Fix for libraries that expect 'global' to be defined in the browser
if (typeof (window as any).global === 'undefined') {
  (window as any).global = window;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
