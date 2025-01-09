import React from 'react'
import ReactDOM from 'react-dom/client'
import { Dashboard } from './pages/Dashboard'
import './index.css'

console.log('Starting app...');

// Make sure the root element exists
const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('Root element not found');
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);
console.log('Root created, rendering app...');

root.render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
) 