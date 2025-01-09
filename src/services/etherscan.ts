import { API_KEYS } from '../config/api-keys';

const BASE_URL = 'https://api.etherscan.io/api';

export const etherscan = {
  async getAddressTransactions(address: string) {
    const response = await fetch(
      `${BASE_URL}?module=account&action=txlist&address=${address}&apikey=${API_KEYS.ETHERSCAN}`
    );
    return response.json();
  },

  async getTokenTransfers(address: string) {
    const response = await fetch(
      `${BASE_URL}?module=account&action=tokentx&address=${address}&apikey=${API_KEYS.ETHERSCAN}`
    );
    return response.json();
  },

  async getAddressBalance(address: string) {
    const response = await fetch(
      `${BASE_URL}?module=account&action=balance&address=${address}&tag=latest&apikey=${API_KEYS.ETHERSCAN}`
    );
    return response.json();
  }
}; 