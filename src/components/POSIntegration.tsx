"use client";

import React, { useState } from 'react';
import { 
  CreditCard, 
  Wifi, 
  AlertCircle, 
  CheckCircle2,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface POSSystem {
  id: string;
  name: string;
  type: 'square' | 'clover' | 'restosuite' | 'menusifu' | 'custom';
  status: 'connected' | 'disconnected' | 'syncing';
  lastSync: Date;
  syncStatus: 'success' | 'warning' | 'error';
  transactions: number;
  revenue: number;
}

export const POSIntegration = () => {
  const [isSyncing, setIsSyncing] = useState(false);

  const posSystems: POSSystem[] = [
    {
      id: '1',
      name: 'Square POS',
      type: 'square',
      status: 'connected',
      lastSync: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      syncStatus: 'success',
      transactions: 89,
      revenue: 2845
    },
    {
      id: '2',
      name: 'Clover Station',
      type: 'clover',
      status: 'connected',
      lastSync: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      syncStatus: 'success',
      transactions: 45,
      revenue: 1560
    },
    {
      id: '3',
      name: 'Restosuite Cloud',
      type: 'restosuite',
      status: 'syncing',
      lastSync: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      syncStatus: 'warning',
      transactions: 32,
      revenue: 980
    },
    {
      id: '4',
      name: 'Menusifu Terminal',
      type: 'menusifu',
      status: 'disconnected',
      lastSync: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      syncStatus: 'error',
      transactions: 0,
      revenue: 0
    }
  ];

  const handleSyncAll = async () => {
    setIsSyncing(true);
    // Simulate sync process
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const getStatusIcon = (status: POSSystem['status']) => {
    switch (status) {
      case 'connected': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'disconnected': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'syncing': return <RefreshCw className="h-4 w-4 text-amber-600 animate-spin" />;
    }
  };

  const getSystemIcon = (type: POSSystem['type']) => {
    switch (type) {
      case 'square': return '🟦';
      case 'clover': return '🍀';
      case 'restosuite': return '☁️';
      case 'menusifu': return '📱';
      case 'custom': return '⚙️';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center text-lg">
          <CreditCard className="h-5 w-5 mr-2 text-purple-600" />
          POS Integrations
        </CardTitle>
        <Button 
          onClick={handleSyncAll} 
          disabled={isSyncing}
          size="sm"
          className="bg-purple-600 hover:bg-purple-700"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
          Sync All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posSystems.map((system) => (
            <div key={system.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{getSystemIcon(system.type)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{system.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{system.type}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {getStatusIcon(system.status)}
                  <Badge 
                    className={`ml-2 ${
                      system.status === 'connected' ? 'bg-green-100 text-green-700' :
                      system.status === 'disconnected' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {system.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Transactions</span>
                    <p className="font-semibold">{system.transactions}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Revenue</span>
                    <p className="font-semibold text-green-600">{formatCurrency(system.revenue)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Last sync: {system.lastSync.toLocaleTimeString()}</span>
                  {system.status !== 'disconnected' && (
                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  )}
                </div>

                {system.syncStatus === 'warning' && (
                  <div className="flex items-center text-xs text-amber-600 bg-amber-50 p-2 rounded">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Partial sync - check connection
                  </div>
                )}

                {system.syncStatus === 'error' && (
                  <div className="flex items-center text-xs text-red-600 bg-red-50 p-2 rounded">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Connection lost - reconnection required
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Connection Status */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Wifi className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <h4 className="font-semibold text-blue-600">Network Status</h4>
                <p className="text-sm text-blue-600/70">3 of 4 systems connected</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">75%</div>
              <div className="text-xs text-green-600/70">Connected</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};