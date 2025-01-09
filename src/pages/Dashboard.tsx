import { useState } from 'react';
import { Search } from 'lucide-react';
import AddressHunter from '../components/AddressHunter';

console.log('Dashboard module loaded');

export const Dashboard = () => {
  console.log('Dashboard rendering');
  const [searchQuery, setSearchQuery] = useState('');
  const [watchlist, setWatchlist] = useState<string[]>([]);

  const handleAddToWatchlist = (address: string) => {
    console.log('Adding to watchlist:', address);
    if (!watchlist.includes(address)) {
      setWatchlist([...watchlist, address]);
    }
  };

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
            <h2 className="text-sm font-medium text-zinc-100 mb-3">Watchlist</h2>
            {watchlist.length === 0 ? (
              <div className="text-center py-4 text-zinc-500 text-xs">
                No addresses in watchlist
              </div>
            ) : (
              <div className="space-y-2">
                {watchlist.map((address) => (
                  <div 
                    key={address}
                    className="bg-zinc-800/50 rounded-lg p-2"
                  >
                    <div className="text-xs text-zinc-100">{address}</div>
                  </div>
                ))}
              </div>
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