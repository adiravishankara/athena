import React, { StrictMode } from 'react'; // Import React
import { createRoot } from 'react-dom/client';
import './index.css'; // Assuming index.css will be moved too
import Popup from './pages/Popup.tsx'; // Renamed App component to Popup

// Ensure the root element exists in your popup HTML (e.g., index.html)
const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <Popup />
    </StrictMode>,
  );
} else {
  console.error("Fatal Error: Root element 'root' not found in the popup document.");
}