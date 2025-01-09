import { useState, useEffect } from 'react';
import { Plus, ExternalLink, AlertCircle, ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';
import { findTopTraders, type Trader } from '../services/traders';

interface AddressHunterProps {
  onAddAddress: (address: string) => void;
}

const AddressHunter = ({ onAddAddress }: AddressHunterProps) => {
  console.log('AddressHunter rendering');
  const [loading, setLoading] = useState(false);
  const [traders, setTraders] = useState<Trader[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [volumeFilter, setVolumeFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'volume' | 'trades' | 'recent' | 'winRate' | 'profitLoss'>('volume');
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  const [isTraderListOpen, setIsTraderListOpen] = useState(true);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await findTopTraders('24h');
      console.log('Fetched traders:', data);
      setTraders(data);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch traders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  const filteredAndSortedTraders = traders
    .filter(trader => {
      // Volume filter
      if (volumeFilter !== 'all') {
        const volume = parseFloat(trader.totalVolume.replace(/[^0-9.]/g, ''));
        const unit = trader.totalVolume.includes('M') ? 1000 : 1;
        const volumeInK = volume * unit;
        
        if (volumeFilter === '1m+' && volumeInK < 1000) return false;
        if (volumeFilter === '100k+' && volumeInK < 100) return false;
      }

      // Time filter
      if (timeFilter !== 'all') {
        const minutes = Math.floor((Date.now() - trader.lastTx!.timestamp * 1000) / 60000);
        if (timeFilter === '1h' && minutes > 60) return false;
        if (timeFilter === '24h' && minutes > 1440) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'volume') {
        const volumeA = parseFloat(a.totalVolume.replace(/[^0-9.]/g, ''));
        const volumeB = parseFloat(b.totalVolume.replace(/[^0-9.]/g, ''));
        const unitA = a.totalVolume.includes('M') ? 1000 : 1;
        const unitB = b.totalVolume.includes('M') ? 1000 : 1;
        return (volumeB * unitB) - (volumeA * unitA);
      }
      if (sortBy === 'trades') {
        return b.trades - a.trades;
      }
      if (sortBy === 'winRate') {
        const winRateA = parseFloat(a.winRate.replace('%', ''));
        const winRateB = parseFloat(b.winRate.replace('%', ''));
        return winRateB - winRateA;
      }
      if (sortBy === 'profitLoss') {
        const plA = parseFloat(a.profitLoss.replace(/[^0-9.-]/g, ''));
        const plB = parseFloat(b.profitLoss.replace(/[^0-9.-]/g, ''));
        return plB - plA;
      }
      // Sort by recent
      return b.lastTx!.timestamp - a.lastTx!.timestamp;
    });

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium text-zinc-100">Top Traders</h2>
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="text-zinc-400 hover:text-zinc-300 transition-colors"
            >
              <ChevronDown 
                className={`h-4 w-4 transition-transform duration-200 ${
                  isFiltersOpen ? 'transform rotate-0' : 'transform rotate-180'
                }`}
              />
            </button>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="text-xs text-zinc-400 hover:text-zinc-300 disabled:opacity-50 
                     disabled:cursor-not-allowed transition-opacity"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Filters Section */}
        {isFiltersOpen && (
          <div className="flex flex-wrap gap-2 text-xs">
            <select
              value={volumeFilter}
              onChange={(e) => setVolumeFilter(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 
                       text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Volumes</option>
              <option value="1m+">$1M+</option>
              <option value="100k+">$100K+</option>
            </select>

            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 
                       text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Any Time</option>
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24H</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 
                       text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="profitLoss">Sort by P/L</option>
              <option value="volume">Sort by Volume</option>
              <option value="winRate">Sort by Win Rate</option>
              <option value="trades">Sort by Trades</option>
              <option value="recent">Sort by Recent</option>
            </select>
          </div>
        )}
      </div>

      {/* Traders List Section */}
      <div className="mt-4">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-medium text-zinc-100">Active Traders</h3>
          <button
            onClick={() => setIsTraderListOpen(!isTraderListOpen)}
            className="text-zinc-400 hover:text-zinc-300 transition-colors"
          >
            <ChevronDown 
              className={`h-4 w-4 transition-transform duration-200 ${
                isTraderListOpen ? 'transform rotate-0' : 'transform rotate-180'
              }`}
            />
          </button>
        </div>

        {isTraderListOpen && (
          <>
            {loading ? (
              <div className="text-center py-4 text-zinc-500 text-xs">Loading...</div>
            ) : error ? (
              <div className="flex items-center justify-center gap-2 py-4 text-red-400 text-xs">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            ) : filteredAndSortedTraders.length === 0 ? (
              <div className="text-center py-4 text-zinc-500 text-xs">No traders found</div>
            ) : (
              <div className="space-y-2">
                {filteredAndSortedTraders.map((trader) => (
                  <div key={trader.address} className="bg-zinc-800/50 rounded-lg p-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-100 font-mono">
                          {trader.address.slice(0, 6)}...{trader.address.slice(-4)}
                        </span>
                        <a 
                          href={`https://etherscan.io/address/${trader.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-500 hover:text-zinc-400 flex-shrink-0"
                          title={trader.address}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <button
                        onClick={() => onAddAddress(trader.address)}
                        className="px-2 py-0.5 text-[11px] bg-blue-500/10 text-blue-400 
                                 rounded hover:bg-blue-500/20 flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Track
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-[11px]">
                      <div>
                        <div className="text-zinc-500">Volume</div>
                        <div className="text-zinc-300">{trader.totalVolume}</div>
                      </div>
                      <div>
                        <div className="text-zinc-500">P/L</div>
                        <div className="flex items-center gap-1">
                          {parseFloat(trader.profitLoss) > 0 ? (
                            <TrendingUp className="h-3 w-3 text-green-400" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-400" />
                          )}
                          <span className={parseFloat(trader.profitLoss) > 0 ? 'text-green-400' : 'text-red-400'}>
                            {trader.profitLoss}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-zinc-500">Win Rate</div>
                        <div className="flex items-center gap-1">
                          {parseFloat(trader.winRate) > 50 ? (
                            <TrendingUp className="h-3 w-3 text-green-400" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-400" />
                          )}
                          <span className={parseFloat(trader.winRate) > 50 ? 'text-green-400' : 'text-red-400'}>
                            {trader.winRate}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-zinc-500">Last Active</div>
                        <div className="text-zinc-300">{trader.lastActive}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AddressHunter; 