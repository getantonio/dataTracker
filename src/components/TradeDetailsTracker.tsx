import { useEffect, useState } from 'react';
import { ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';

interface Trade {
  hash: string;
  timestamp: Date;
  type: 'buy' | 'sell';
  token: string;
  amount: string;
  price: number;
  value: number;
  exchange: string;
}

interface TradeDetailsTrackerProps {
  address: string;
  onTradeSelect?: (trade: Trade) => void;
}

export const TradeDetailsTracker = ({ address, onTradeSelect }: TradeDetailsTrackerProps) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrades = async () => {
      setLoading(true);
      try {
        // This will be replaced with real API calls
        setTrades([
          {
            hash: '0x1234...',
            timestamp: new Date(),
            type: 'buy',
            token: 'ETH',
            amount: '2.5',
            price: 2345.67,
            value: 5864.18,
            exchange: 'Uniswap'
          }
        ]);
      } catch (error) {
        console.error('Error fetching trades:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrades();
    const interval = setInterval(fetchTrades, 30000);
    return () => clearInterval(interval);
  }, [address]);

  if (loading) {
    return <div className="text-xs text-zinc-500 text-center py-4">Loading trades...</div>;
  }

  return (
    <div className="space-y-2">
      {trades.map((trade) => (
        <div 
          key={trade.hash}
          onClick={() => onTradeSelect?.(trade)}
          className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 cursor-pointer 
                   hover:bg-zinc-800/50 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {trade.type === 'buy' ? (
                <TrendingUp className="h-3.5 w-3.5 text-green-400" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-red-400" />
              )}
              <span className="text-xs font-medium text-zinc-100">
                {trade.amount} {trade.token}
              </span>
              <a 
                href={`https://etherscan.io/tx/${trade.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-zinc-400"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <span className="text-xs text-zinc-400">
              ${trade.value.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-500">
              {trade.exchange} • {new Date(trade.timestamp).toLocaleTimeString()}
            </span>
            <span className="text-zinc-400">
              @ ${trade.price.toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}; 