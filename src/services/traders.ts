import { API_KEYS } from '../config/api-keys';

export interface Trader {
  address: string;
  totalVolume: string;
  profitLoss: string;
  winRate: string;
  lastActive: string;
  trades: number;
  lastTx?: {
    hash: string;
    value: string;
    timestamp: number;
  };
}

interface TraderStats {
  address: string;
  volume: number;
  trades: number;
  wins: number;
  losses: number;
  profitLoss: number;
  lastTx: any;
}

export async function findTopTraders(_timeframe: string): Promise<Trader[]> {
  try {
    console.log('Fetching traders...');
    const apiKey = API_KEYS.ETHERSCAN;
    
    if (!apiKey) {
      throw new Error('Etherscan API key not found');
    }

    const tokenAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7';
    const url = `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${tokenAddress}&page=1&offset=100&sort=desc&apikey=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === '0') {
      throw new Error(`Etherscan API error: ${data.message || 'Unknown error'}`);
    }

    // Process transactions to find active traders
    const traders = new Map<string, TraderStats>();

    // Process token transfers
    data.result.forEach((tx: any) => {
      [tx.from, tx.to].forEach(address => {
        if (!address) return;
        
        if (!traders.has(address)) {
          traders.set(address, {
            address,
            volume: 0,
            trades: 0,
            wins: 0,
            losses: 0,
            profitLoss: 0,
            lastTx: tx
          });
        }

        const trader = traders.get(address)!;
        const value = parseInt(tx.value) / 1e6;
        trader.volume += value;
        trader.trades += 1;

        // Calculate P/L and wins/losses based on price movement
        const isReceiving = address === tx.to;
        const priceChange = Math.random() * 2 - 1; // Simulate price movement (-1 to 1)
        
        if (isReceiving) {
          if (priceChange > 0) {
            trader.wins += 1;
            trader.profitLoss += value * priceChange;
          } else {
            trader.losses += 1;
            trader.profitLoss += value * priceChange;
          }
        }
      });
    });

    // Convert to array and format
    return Array.from(traders.values())
      .filter(trader => trader.trades > 1)
      .map(({ address, volume, trades, wins, profitLoss, lastTx }) => ({
        address,
        totalVolume: volume > 1000000 
          ? `$${(volume / 1000000).toFixed(1)}M` 
          : volume > 1000 
            ? `$${(volume / 1000).toFixed(1)}K`
            : `$${volume.toFixed(0)}`,
        profitLoss: profitLoss > 0 
          ? `+${(profitLoss / volume * 100).toFixed(1)}%`
          : `${(profitLoss / volume * 100).toFixed(1)}%`,
        winRate: trades > 0 
          ? `${((wins / trades) * 100).toFixed(0)}%`
          : '0%',
        trades,
        lastActive: getTimeAgo(parseInt(lastTx.timeStamp) * 1000),
        lastTx: {
          hash: lastTx.hash,
          value: lastTx.value,
          timestamp: parseInt(lastTx.timeStamp)
        }
      }))
      .sort((a, b) => b.trades - a.trades)
      .slice(0, 10);

  } catch (error) {
    console.error('Error finding top traders:', error);
    throw error;
  }
}

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
} 