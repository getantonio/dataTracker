import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, ArrowRightLeft, TrendingUp, Ban, AlertCircle } from 'lucide-react';

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
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-500" />
            Detailed Trade Analysis
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {recentTrades.map((trade, index) => (
          <Card key={index} className="border-2">
            <CardContent className="p-6">
              {/* Trade Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {trade.type === 'LONG' ? (
                    <ArrowUpRight className="h-6 w-6 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-6 w-6 text-red-500" />
                  )}
                  <div>
                    <div className="text-lg font-bold">{trade.pair}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(trade.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    trade.profitLoss.net.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trade.profitLoss.net}
                  </div>
                  <div className="text-sm text-gray-500">{trade.dex} ({trade.pool})</div>
                </div>
              </div>

              {/* Entry/Exit Details */}
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div className="p-4 bg-gray-50 rounded-lg">
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

                <div className="p-4 bg-gray-50 rounded-lg">
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
                <div className="p-4 border border-red-100 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Ban className="h-4 w-4 text-red-500" />
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

                <div className="p-4 border border-green-100 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
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
              <div className="p-4 bg-gray-50 rounded-lg">
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
              <div className="mt-4 text-sm text-gray-500">
                <a 
                  href={`https://etherscan.io/tx/${trade.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-500"
                >
                  View transaction on Etherscan: {trade.txHash}
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