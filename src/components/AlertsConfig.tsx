import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Bell, DollarSign, Activity, Fuel } from 'lucide-react';

interface Alert {
  type: 'price' | 'volume' | 'gas';
  threshold: number;
  enabled: boolean;
}

const AlertsConfig = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    { type: 'price', threshold: 2000, enabled: false },
    { type: 'volume', threshold: 10, enabled: false },
    { type: 'gas', threshold: 50, enabled: false },
  ]);

  const toggleAlert = (index: number) => {
    setAlerts(alerts.map((alert, i) => 
      i === index ? { ...alert, enabled: !alert.enabled } : alert
    ));
  };

  const updateThreshold = (index: number, value: number) => {
    setAlerts(alerts.map((alert, i) => 
      i === index ? { ...alert, threshold: value } : alert
    ));
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-6 w-6 text-blue-600" />
          Alert Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Price Alert */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="font-medium">Price Alert</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={alerts[0].enabled}
                  onChange={() => toggleAlert(0)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <input
              type="number"
              value={alerts[0].threshold}
              onChange={(e) => updateThreshold(0, Number(e.target.value))}
              className="w-full p-2 border rounded-md"
              placeholder="Enter price threshold"
            />
          </div>

          {/* Volume Alert */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Volume Alert</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={alerts[1].enabled}
                  onChange={() => toggleAlert(1)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <input
              type="number"
              value={alerts[1].threshold}
              onChange={(e) => updateThreshold(1, Number(e.target.value))}
              className="w-full p-2 border rounded-md"
              placeholder="Enter volume threshold (ETH)"
            />
          </div>

          {/* Gas Alert */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Fuel className="h-5 w-5 text-orange-600" />
                <span className="font-medium">Gas Price Alert</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={alerts[2].enabled}
                  onChange={() => toggleAlert(2)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <input
              type="number"
              value={alerts[2].threshold}
              onChange={(e) => updateThreshold(2, Number(e.target.value))}
              className="w-full p-2 border rounded-md"
              placeholder="Enter gas price threshold (gwei)"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsConfig; 