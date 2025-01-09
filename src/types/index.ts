export interface Trade {
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