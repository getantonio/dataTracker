import React from 'react'
import ReactDOM from 'react-dom/client'
import TradeDetailsTracker from './components/TradeDetailsTracker'
import AddressInput from './components/AddressInput'
import AlertsConfig from './components/AlertsConfig'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Trading Dashboard</h1>
        </header>
        <AddressInput />
        <AlertsConfig />
        <TradeDetailsTracker />
      </main>
    </div>
  </React.StrictMode>,
) 