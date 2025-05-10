// index.js
// This is the main entry point for the React application.
// It sets up the React root and renders the main App component into the DOM.

import React from 'react';
import ReactDOM from 'react-dom/client'; 
import './index.css'; // Importing global styles for the entire application
import App from './App'; // Importing the main application component
import reportWebVitals from './reportWebVitals'; // something fancy for measuring performance

// Get the root DOM element where the React app will be mounted.
const rootElement = document.getElementById('root');

// Create a React root for concurrent rendering (React 18+).
const root = ReactDOM.createRoot(rootElement);

// Render the main App component into the root.
// React.StrictMode is a wrapper that helps identify potential problems in an application.
// It activates additional checks and warnings
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


reportWebVitals();
