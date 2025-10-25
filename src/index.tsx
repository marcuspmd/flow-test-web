import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './pages/App';
import './styles/globals.css';

// Configure Monaco Editor for Electron
import './config/monaco.config';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
