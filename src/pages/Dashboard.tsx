import { useState, useEffect } from 'react';
import { Search, ChevronDown, ExternalLink } from 'lucide-react';
import AddressHunter from '../components/AddressHunter';
import { findTopTraders, type Trader } from '../services/traders';

interface WatchlistItem {
  address: string;
  addedAt: number;
  lastVolume?: string;
  lastProfitLoss?: string;
  lastWinRate?: string;
  trades?: number;
  lastActive?: string;
  lastTx?: {
    hash: string;
    value: string;
    timestamp: number;
  };
  priceChanges?: {
    hour: number;
    day: number;
    week: number;
  };
}

console.log('Dashboard module loaded');

export const Dashboard = () => {
  console.log('Dashboard rendering');
  const [searchQuery, setSearchQuery] = useState('');
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(true);
  const [watchlistData, setWatchlistData] = useState<Record<string, Trader>>({});
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [watchlistSort, setWatchlistSort] = useState<'profitLoss' | 'volume' | 'winRate' | 'trades' | 'recent'>('profitLoss');

  // Save watchlist to localStorage
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Fetch data for watchlist addresses
  useEffect(() => {
    const fetchWatchlistData = async () => {
      try {
        const data = await findTopTraders('24h');
        const newData: Record<string, Trader> = {};
        data.forEach(trader => {
          newData[trader.address] = trader;
        });
        setWatchlistData(newData);
        setLastRefresh(new Date());
      } catch (error) {
        console.error('Error fetching watchlist data:', error);
      }
    };

    if (watchlist.length > 0) {
      fetchWatchlistData();
      const interval = setInterval(fetchWatchlistData, 30000);
      return () => clearInterval(interval);
    }
  }, [watchlist]);

  const handleAddToWatchlist = (address: string) => {
    console.log('Adding to watchlist:', address);
    if (!watchlist.some(item => item.address === address)) {
      const trader = watchlistData[address];
      const newItem: WatchlistItem = {
        address,
        addedAt: Date.now(),
        lastVolume: trader?.totalVolume,
        lastProfitLoss: trader?.profitLoss,
        lastWinRate: trader?.winRate,
        trades: trader?.trades,
        lastActive: trader?.lastActive,
        lastTx: trader?.lastTx,
        priceChanges: {
          hour: Math.random() * 10 - 5, // Simulated price changes
          day: Math.random() * 20 - 10,
          week: Math.random() * 40 - 20
        }
      };
      setWatchlist([...watchlist, newItem]);
    }
  };

  const handleRemoveFromWatchlist = (address: string) => {
    setWatchlist(watchlist.filter(item => item.address !== address));
  };

  const sortedWatchlist = [...watchlist].sort((a, b) => {
    const traderA = watchlistData[a.address];
    const traderB = watchlistData[b.address];

    if (watchlistSort === 'profitLoss') {
      const plA = parseFloat((traderA?.profitLoss || a.lastProfitLoss || '0').replace(/[^0-9.-]/g, ''));
      const plB = parseFloat((traderB?.profitLoss || b.lastProfitLoss || '0').replace(/[^0-9.-]/g, ''));
      return plB - plA;
    }
    if (watchlistSort === 'volume') {
      const volA = parseFloat((traderA?.totalVolume || a.lastVolume || '0').replace(/[^0-9.]/g, ''));
      const volB = parseFloat((traderB?.totalVolume || b.lastVolume || '0').replace(/[^0-9.]/g, ''));
      const unitA = (traderA?.totalVolume || a.lastVolume || '').includes('M') ? 1000 : 1;
      const unitB = (traderB?.totalVolume || b.lastVolume || '').includes('M') ? 1000 : 1;
      return (volB * unitB) - (volA * unitA);
    }
    if (watchlistSort === 'winRate') {
      const wrA = parseFloat((traderA?.winRate || a.lastWinRate || '0').replace('%', ''));
      const wrB = parseFloat((traderB?.winRate || b.lastWinRate || '0').replace('%', ''));
      return wrB - wrA;
    }
    if (watchlistSort === 'trades') {
      return (traderB?.trades || 0) - (traderA?.trades || 0);
    }
    // Sort by recent
    return (traderB?.lastTx?.timestamp || 0) - (traderA?.lastTx?.timestamp || 0);
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="h-12 border-b border-zinc-800 bg-zinc-900/50">
        <div className="h-full px-3 flex items-center gap-3">
          <h1 className="text-sm font-bold text-zinc-100">Top Trader Hunter</h1>
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by address..."
              className="w-full h-7 bg-zinc-800 border border-zinc-700 rounded-md 
                     pl-8 pr-3 text-xs text-zinc-100 placeholder:text-zinc-500
                     focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-4 grid grid-cols-[1fr,350px] gap-3">
        <div className="space-y-3">
          <AddressHunter onAddAddress={handleAddToWatchlist} />

          {/* Watchlist */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-sm font-medium text-zinc-100">Watchlist</h2>
              <button
                onClick={() => setIsWatchlistOpen(!isWatchlistOpen)}
                className="text-zinc-400 hover:text-zinc-300 transition-colors"
              >
                <ChevronDown 
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isWatchlistOpen ? 'transform rotate-0' : 'transform rotate-180'
                  }`}
                />
              </button>
              <select
                value={watchlistSort}
                onChange={(e) => setWatchlistSort(e.target.value as typeof watchlistSort)}
                className="text-xs bg-zinc-800 border border-zinc-700 rounded px-2 py-1 
                         text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500 ml-2"
              >
                <option value="profitLoss">Sort by P/L</option>
                <option value="volume">Sort by Volume</option>
                <option value="winRate">Sort by Win Rate</option>
                <option value="trades">Sort by Trades</option>
                <option value="recent">Sort by Recent</option>
              </select>
              <div className="text-xs text-zinc-500 ml-auto">
                {watchlist.length} addresses
              </div>
            </div>

            {isWatchlistOpen && (
              <>
                {watchlist.length === 0 ? (
                  <div className="text-center py-4 text-zinc-500 text-xs">
                    No addresses in watchlist
                  </div>
                ) : (
                  <div className="space-y-2">
                    {sortedWatchlist.map((item) => {
                      const trader = watchlistData[item.address];
                      return (
                        <div 
                          key={item.address}
                          className="bg-zinc-800/50 rounded-lg p-2"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-zinc-100">{item.address}</span>
                              <a 
                                href={`https://etherscan.io/address/${item.address}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-zinc-500 hover:text-zinc-400"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                            <button
                              onClick={() => handleRemoveFromWatchlist(item.address)}
                              className="text-xs text-red-400 hover:text-red-300"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-[11px] mb-2">
                            <div>
                              <div className="text-zinc-500">Volume</div>
                              <div className="text-zinc-300">
                                {trader?.totalVolume || item.lastVolume || '-'}
                              </div>
                            </div>
                            <div>
                              <div className="text-zinc-500">P/L</div>
                              <div className={`${
                                (trader?.profitLoss || item.lastProfitLoss || '').startsWith('+') 
                                  ? 'text-green-400' 
                                  : 'text-red-400'
                              }`}>
                                {trader?.profitLoss || item.lastProfitLoss || '-'}
                              </div>
                            </div>
                            <div>
                              <div className="text-zinc-500">Win Rate</div>
                              <div className="text-zinc-300">
                                {trader?.winRate || item.lastWinRate || '-'}
                              </div>
                            </div>
                            <div>
                              <div className="text-zinc-500">Trades</div>
                              <div className="text-zinc-300">
                                {trader?.trades || item.trades || '-'}
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-[11px] border-t border-zinc-800 pt-2">
                            <div>
                              <div className="text-zinc-500">1H Change</div>
                              <div className={`${
                                (item.priceChanges?.hour || 0) > 0 ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {item.priceChanges?.hour.toFixed(1)}%
                              </div>
                            </div>
                            <div>
                              <div className="text-zinc-500">24H Change</div>
                              <div className={`${
                                (item.priceChanges?.day || 0) > 0 ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {item.priceChanges?.day.toFixed(1)}%
                              </div>
                            </div>
                            <div>
                              <div className="text-zinc-500">7D Change</div>
                              <div className={`${
                                (item.priceChanges?.week || 0) > 0 ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {item.priceChanges?.week.toFixed(1)}%
                              </div>
                            </div>
                            <div>
                              <div className="text-zinc-500">Last Active</div>
                              <div className="text-zinc-300">
                                {trader?.lastActive || item.lastActive || '-'}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 text-[10px] text-zinc-500 flex justify-between items-center">
                            <span>Added {new Date(item.addedAt).toLocaleDateString()}</span>
                            {lastRefresh && (
                              <span>Updated {new Date(lastRefresh).toLocaleTimeString()}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <h2 className="text-sm font-medium text-zinc-100 mb-3">Details</h2>
          <p className="text-xs text-zinc-500">Select a trader to view details</p>
        </aside>
      </div>
    </div>
  );
};