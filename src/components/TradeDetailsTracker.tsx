import { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, ExternalLink, X, ArrowRight, Wallet, Fuel 
} from 'lucide-react';
import { API_KEYS } from '../config/api-keys';

interface Trade {
  hash: string;
  timestamp: number;
  type: 'buy' | 'sell';
  amount: string;
  price: string;
  status: 'completed' | 'pending' | 'failed';
  profitLoss?: string;
  gas?: string;
  exchange?: string;
  token?: string;
  to: string;
  from: string;
  blockNumber: string;
  ipAddress?: string;
  location?: string;
}

interface TraderStats {
  totalTrades: number;
  successfulTrades: number;
  failedTrades: number;
  pendingTrades: number;
  totalVolume: string;
  avgTradeSize: string;
  lastTradeTime: string;
}

interface TradeDetailsProps {
  address: string | null;
}

interface ExpandedTradeProps {
  trade: Trade;
  onClose: () => void;
}

const ExpandedTrade = ({ trade, onClose }: ExpandedTradeProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg w-full max-w-lg p-4 m-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-zinc-100">Trade Details</h3>
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Transaction Info */}
          <div className="bg-zinc-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              {trade.type === 'buy' ? (
                <TrendingUp className="h-4 w-4 text-green-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400" />
              )}
              <span className="text-sm text-zinc-100">
                {trade.type === 'buy' ? 'Buy' : 'Sell'} {trade.token}
              </span>
              <div className={`ml-auto text-xs ${
                trade.status === 'completed' ? 'text-green-400' :
                trade.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-zinc-500 mb-1">Amount</div>
                <div className="text-zinc-300">{trade.amount}</div>
              </div>
              <div>
                <div className="text-zinc-500 mb-1">Price</div>
                <div className="text-zinc-300">{trade.price}</div>
              </div>
              <div>
                <div className="text-zinc-500 mb-1">Exchange</div>
                <div className="text-zinc-300">{trade.exchange}</div>
              </div>
              <div>
                <div className="text-zinc-500 mb-1">Time</div>
                <div className="text-zinc-300">
                  {new Date(trade.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="bg-zinc-800/50 rounded-lg p-3">
            <h4 className="text-xs font-medium text-zinc-400 mb-2">
              Transaction Details
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Wallet className="h-3 w-3" />
                  <span>Transaction Hash</span>
                </div>
                <a 
                  href={`https://etherscan.io/tx/${trade.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  {trade.hash.slice(0, 6)}...{trade.hash.slice(-4)}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Fuel className="h-3 w-3" />
                  <span>Gas Fee</span>
                </div>
                <span className="text-zinc-300">{trade.gas}</span>
              </div>
              {trade.profitLoss && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <ArrowRight className="h-3 w-3" />
                    <span>Profit/Loss</span>
                  </div>
                  <span className={trade.profitLoss.startsWith('+') ? 
                    'text-green-400' : 'text-red-400'}>
                    {trade.profitLoss}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-500">
                  <span>IP Address</span>
                </div>
                <span className="text-zinc-300">{trade.ipAddress || 'Unknown'}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-500">
                  <span>Location</span>
                </div>
                <span className="text-zinc-300">{trade.location || 'Unknown'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TradeDetailsTracker = ({ address }: TradeDetailsProps) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [stats, setStats] = useState<TraderStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

  useEffect(() => {
    setTrades([]);
    setStats(null);
  }, [address]);

  useEffect(() => {
    if (!address) return;

    const fetchTrades = async () => {
      setLoading(true);
      try {
        const apiKey = API_KEYS.ETHERSCAN;
        console.log('Fetching trades for address:', address);

        // Get token transfers (USDT and other ERC20)
        const tokenUrl = `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`;
        
        // Get ETH transfers
        const txUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`;

        const [tokenResponse, txResponse] = await Promise.all([
          fetch(tokenUrl),
          fetch(txUrl)
        ]);

        const [tokenData, txData] = await Promise.all([
          tokenResponse.json(),
          txResponse.json()
        ]);

        console.log('Token Data:', tokenData);
        console.log('TX Data:', txData);

        if (tokenData.status === '0') {
          console.error('Token API Error:', tokenData.message);
        }
        if (txData.status === '0') {
          console.error('TX API Error:', txData.message);
        }

        const processedTrades: Trade[] = [];

        // Process ETH transactions
        if (Array.isArray(txData.result)) {
          txData.result.forEach((tx: any) => {
            if (tx.value !== '0' && tx.isError === '0') {
              const ethValue = parseInt(tx.value) / 1e18;
              if (ethValue > 0.001) { // Filter out tiny transactions
                processedTrades.push({
                  hash: tx.hash,
                  timestamp: parseInt(tx.timeStamp) * 1000,
                  type: tx.from.toLowerCase() === address.toLowerCase() ? 'sell' : 'buy',
                  amount: `${ethValue.toFixed(4)} ETH`,
                  price: 'Market',
                  status: 'completed',
                  gas: `${(parseInt(tx.gasPrice) * parseInt(tx.gasUsed) / 1e18).toFixed(5)} ETH`,
                  token: 'ETH',
                  to: tx.to,
                  from: tx.from,
                  blockNumber: tx.blockNumber
                });
              }
            }
          });
        }

        // Process token transactions
        if (Array.isArray(tokenData.result)) {
          tokenData.result.forEach((tx: any) => {
            try {
              const tokenDecimals = parseInt(tx.tokenDecimal);
              const amount = parseInt(tx.value) / Math.pow(10, tokenDecimals);
              
              if (amount > 0) { // Filter out zero-value transfers
                processedTrades.push({
                  hash: tx.hash,
                  timestamp: parseInt(tx.timeStamp) * 1000,
                  type: tx.to.toLowerCase() === address.toLowerCase() ? 'buy' : 'sell',
                  amount: `${amount.toFixed(2)} ${tx.tokenSymbol}`,
                  price: 'Market',
                  status: 'completed',
                  gas: `${(parseInt(tx.gasPrice) * parseInt(tx.gasUsed) / 1e18).toFixed(5)} ETH`,
                  token: tx.tokenSymbol,
                  to: tx.to,
                  from: tx.from,
                  blockNumber: tx.blockNumber
                });
              }
            } catch (err) {
              console.error('Error processing token transaction:', err, tx);
            }
          });
        }

        // Sort by timestamp and filter out duplicates
        const uniqueTrades = Array.from(new Map(
          processedTrades.map(trade => [trade.hash, trade])
        ).values());
        
        const sortedTrades = uniqueTrades.sort((a, b) => b.timestamp - a.timestamp);
        console.log('Processed Trades:', sortedTrades);

        setTrades(sortedTrades);
        
        // Update stats
        if (sortedTrades.length > 0) {
          const totalVolume = sortedTrades.reduce((acc, trade) => {
            const amount = parseFloat(trade.amount.split(' ')[0]);
            return acc + (isNaN(amount) ? 0 : amount);
          }, 0);

          setStats({
            totalTrades: sortedTrades.length,
            successfulTrades: sortedTrades.filter(t => t.status === 'completed').length,
            failedTrades: sortedTrades.filter(t => t.status === 'failed').length,
            pendingTrades: 0,
            totalVolume: `${totalVolume.toFixed(2)} transactions`,
            avgTradeSize: `${(totalVolume / sortedTrades.length).toFixed(2)} avg`,
            lastTradeTime: new Date(sortedTrades[0].timestamp).toLocaleString()
          });
        }

      } catch (error) {
        console.error('Error fetching trades:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrades();
    const interval = setInterval(fetchTrades, 15000);
    return () => clearInterval(interval);
  }, [address]);

  if (!address) {
    return (
      <div className="text-center py-8 text-zinc-500 text-xs">
        Select a trader to view details
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-100">Trade History</h3>
        <div className="text-xs text-zinc-500">
          {loading ? 'Refreshing...' : 'Auto-updates every 15s'}
        </div>
      </div>

      {/* Stats Section */}
      {stats && (
        <div className="grid grid-cols-2 gap-2 p-2 bg-zinc-800/30 rounded-lg">
          <div className="text-[11px]">
            <div className="text-zinc-500">Total Trades</div>
            <div className="text-zinc-300">{stats.totalTrades}</div>
          </div>
          <div className="text-[11px]">
            <div className="text-zinc-500">Success Rate</div>
            <div className="text-green-400">
              {((stats.successfulTrades / stats.totalTrades) * 100).toFixed(0)}%
            </div>
          </div>
          <div className="text-[11px]">
            <div className="text-zinc-500">Total Volume</div>
            <div className="text-zinc-300">{stats.totalVolume}</div>
          </div>
          <div className="text-[11px]">
            <div className="text-zinc-500">Avg Trade</div>
            <div className="text-zinc-300">{stats.avgTradeSize}</div>
          </div>
        </div>
      )}

      {/* Trades List */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {trades.map((trade) => (
          <div 
            key={trade.hash}
            className="bg-zinc-800/50 rounded-lg p-2 text-xs cursor-pointer 
                     hover:bg-zinc-800 transition-colors"
            onClick={() => setSelectedTrade(trade)}
          >
            <div className="flex flex-col gap-2">
              {/* Top Row - Main Trade Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {trade.type === 'buy' ? (
                    <TrendingUp className="h-3 w-3 text-green-400 flex-shrink-0" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-400 flex-shrink-0" />
                  )}
                  <span className="font-medium text-zinc-100">
                    {trade.type.toUpperCase()} {trade.token}
                  </span>
                  <span className="text-zinc-300">{trade.amount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500">
                    {new Date(trade.timestamp).toLocaleTimeString()}
                  </span>
                  <a 
                    href={`https://etherscan.io/tx/${trade.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-zinc-400"
                    onClick={e => e.stopPropagation()}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Middle Row - Price & Gas Info */}
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-zinc-500">Price:</span>{' '}
                    <span className="text-zinc-300">{trade.price}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Gas:</span>{' '}
                    <span className="text-zinc-300">{trade.gas}</span>
                  </div>
                  {trade.profitLoss && (
                    <div>
                      <span className="text-zinc-500">P/L:</span>{' '}
                      <span className={trade.profitLoss.startsWith('+') ? 
                        'text-green-400' : 'text-red-400'}>
                        {trade.profitLoss}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Row - Addresses */}
              <div className="flex items-center gap-2 text-[11px] border-t border-zinc-800/50 pt-2">
                <span className="text-zinc-500">From:</span>
                <a 
                  href={`https://etherscan.io/address/${trade.from}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-mono"
                  onClick={e => e.stopPropagation()}
                  title={trade.from}
                >
                  {trade.from.slice(0, 6)}...{trade.from.slice(-4)}
                </a>
                <span className="text-zinc-500">To:</span>
                <a 
                  href={`https://etherscan.io/address/${trade.to}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-mono"
                  onClick={e => e.stopPropagation()}
                  title={trade.to}
                >
                  {trade.to.slice(0, 6)}...{trade.to.slice(-4)}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Expanded Trade View */}
      {selectedTrade && (
        <ExpandedTrade 
          trade={selectedTrade} 
          onClose={() => setSelectedTrade(null)} 
        />
      )}
    </div>
  );
}; 