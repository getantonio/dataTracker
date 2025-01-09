const BASE_URL = 'https://api.coingecko.com/api/v3';

export const coingecko = {
  async getEthPrice() {
    const response = await fetch(
      `${BASE_URL}/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true`
    );
    return response.json();
  },

  async getMarketData() {
    const response = await fetch(
      `${BASE_URL}/coins/ethereum/market_chart?vs_currency=usd&days=1&interval=hourly`
    );
    return response.json();
  },

  async getTopTokens() {
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false`
    );
    return response.json();
  }
}; 