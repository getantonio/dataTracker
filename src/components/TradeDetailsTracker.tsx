import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Ban } from 'lucide-react';

const TradeDetailsTracker = () => {
  const [recentTrades] = useState([
    {
      timestamp: '2025-01-08T16:45:23Z',
      type: 'LONG',
      pair: 'ETH/USDC',
      entry: {
        price: 2250.50,
        amount: '5.5 ETH',
        timestamp: '2025-01-08T16:45:23Z',
        gas: '0.012 ETH',
        slippage: '0.1%'
      },
      exit: {
        price: 2315.75,
        amount: '5.5 ETH',
        timestamp: '2025-01-08T17:15:45Z',
        gas: '0.015 ETH',
        slippage: '0.15%'
      },
      stopLoss: {
        price: 2200.00,
        percentage: '2.2%'
      },
      takeProfit: {
        price: 2320.00,
        percentage: '3.1%'
      },
      profitLoss: {
        usd: '+$358.87',
        percentage: '+2.9%',
        gas: '-$45.12',
        net: '+$313.75'
      },
      dex: 'Uniswap V3',
      pool: '0.3%',
      txHash: '0xabcd...'
    },
    {
      timestamp: '2025-01-08T16:15:12Z',
      type: 'SHORT',
      pair: 'WBTC/USDC',
      entry: {
        price: 44750.25,
        amount: '0.25 WBTC',
        timestamp: '2025-01-08T16:15:12Z',
        gas: '0.014 ETH',
        slippage: '0.12%'
      },
      exit: {
        price: 44250.50,
        amount: '0.25 WBTC',
        timestamp: '2025-01-08T16:35:30Z',
        gas: '0.011 ETH',
        slippage: '0.1%'
      },
      stopLoss: {
        price: 45000.00,
        percentage: '0.56%'
      },
      takeProfit: {
        price: 44000.00,
        percentage: '1.68%'
      },
      profitLoss: {
        usd: '+$124.94',
        percentage: '+1.12%',
        gas: '-$41.25',
        net: '+$83.69'
      },
      dex: 'Uniswap V3',
      pool: '0.05%',
      txHash: '0xefgh...'
    }
  ]);

  return (
    <Card className="shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Trade Analysis
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {recentTrades.map((trade, index) => (
          <Card key={index} className="border border-gray-200">
            <CardContent className="p-4">
              {/* Trade Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {trade.type === 'LONG' ? (
                    <div className="p-2 bg-green-100 rounded-full">
                      <ArrowUpRight className="h-6 w-6 text-green-600" />
                    </div>
                  ) : (
                    <div className="p-2 bg-red-100 rounded-full">
                      <ArrowDownRight className="h-6 w-6 text-red-600" />
                    </div>
                  )}
                  <div>
                    <div className="text-xl font-bold tracking-tight">{trade.pair}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(trade.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    trade.profitLoss.net.startsWith('+') 
                    ? 'text-green-600 bg-green-50 px-3 py-1 rounded-full' 
                    : 'text-red-600 bg-red-50 px-3 py-1 rounded-full'
                  }`}>
                    {trade.profitLoss.net}
                  </div>
                  <div className="text-sm text-gray-500 mt-1 font-medium">{trade.dex} • {trade.pool}</div>
                </div>
              </div>

              {/* Entry/Exit Details */}
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors duration-200">
                  <h3 className="font-semibold mb-2">Entry</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Price:</span>
                      <span className="font-medium">${trade.entry.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Amount:</span>
                      <span className="font-medium">{trade.entry.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Gas:</span>
                      <span className="font-medium">{trade.entry.gas}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Slippage:</span>
                      <span className="font-medium">{trade.entry.slippage}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors duration-200">
                  <h3 className="font-semibold mb-2">Exit</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Price:</span>
                      <span className="font-medium">${trade.exit.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Amount:</span>
                      <span className="font-medium">{trade.exit.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Gas:</span>
                      <span className="font-medium">{trade.exit.gas}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Slippage:</span>
                      <span className="font-medium">{trade.exit.slippage}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Management */}
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div className="p-4 border border-red-200 bg-red-50 rounded-lg hover:border-red-300 transition-colors duration-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Ban className="h-5 w-5 text-red-500" />
                    <h3 className="font-semibold">Stop Loss</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Price:</span>
                      <span className="font-medium">${trade.stopLoss.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Distance:</span>
                      <span className="font-medium">{trade.stopLoss.percentage}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-green-200 bg-green-50 rounded-lg hover:border-green-300 transition-colors duration-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <h3 className="font-semibold">Take Profit</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Price:</span>
                      <span className="font-medium">${trade.takeProfit.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Target:</span>
                      <span className="font-medium">{trade.takeProfit.percentage}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* P/L Breakdown */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors duration-200">
                <h3 className="font-semibold mb-2">Profit/Loss Breakdown</h3>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Gross P/L</div>
                    <div className={`font-medium ${
                      trade.profitLoss.usd.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trade.profitLoss.usd}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Percentage</div>
                    <div className={`font-medium ${
                      trade.profitLoss.percentage.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trade.profitLoss.percentage}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Gas Fees</div>
                    <div className="font-medium text-red-600">{trade.profitLoss.gas}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Net P/L</div>
                    <div className={`font-medium ${
                      trade.profitLoss.net.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trade.profitLoss.net}
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="mt-4 text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200">
                <a 
                  href={`https://etherscan.io/tx/${trade.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  <span className="underline underline-offset-4">View transaction on Etherscan:</span>
                  {trade.txHash}
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default TradeDetailsTracker; 