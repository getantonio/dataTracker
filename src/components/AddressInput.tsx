import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Plus, AlertTriangle } from 'lucide-react';

interface Address {
  address: string;
  label: string;
  alerts: {
    priceThreshold?: number;
    volumeThreshold?: number;
    gasPriceAlert?: number;
  };
}

const AddressInput = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [error, setError] = useState('');

  const validateAddress = (address: string) => {
    return address.match(/^0x[a-fA-F0-9]{40}$/);
  };

  const handleAddAddress = () => {
    if (!validateAddress(newAddress)) {
      setError('Invalid Ethereum address format');
      return;
    }

    setAddresses([...addresses, {
      address: newAddress,
      label: newLabel || `Address ${addresses.length + 1}`,
      alerts: {}
    }]);
    setNewAddress('');
    setNewLabel('');
    setError('');
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-6 w-6 text-blue-600" />
          Add Address to Monitor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ethereum Address
            </label>
            <input
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="0x..."
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Label (optional)
            </label>
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="e.g., Main Trading Wallet"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        {error && (
          <div className="flex items-center gap-2 text-red-600 mb-4">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <button
          onClick={handleAddAddress}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Address
        </button>

        {/* Address List */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Monitored Addresses</h3>
          <div className="space-y-3">
            {addresses.map((addr, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{addr.label}</div>
                  <div className="text-sm text-gray-500">{addr.address}</div>
                </div>
                <button
                  onClick={() => setAddresses(addresses.filter((_, i) => i !== index))}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressInput; 