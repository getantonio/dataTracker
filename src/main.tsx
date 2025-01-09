import React from 'react'
import ReactDOM from 'react-dom/client'
import TradeDetailsTracker from './components/TradeDetailsTracker'
import AddressInput from './components/AddressInput'
import AlertsConfig from './components/AlertsConfig'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-4">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Trading Dashboard</h1>
        </header>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-4">
            <div className="space-y-4">
              <AddressInput />
              <AlertsConfig />
            </div>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <TradeDetailsTracker />
          </div>
        </div>
      </main>
    </div>
  </React.StrictMode>,
) 