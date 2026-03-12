"use client";

import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  ShoppingCart,
  Calendar,
  BarChart3
} from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  unit: string;
  costPerUnit: number;
  supplier: string;
  lastOrdered: Date;
  status: 'adequate' | 'low' | 'critical';
}

const InventoryManager = () => {
  const inventoryItems: InventoryItem[] = [
    {
      id: '1',
      name: 'Beef Patties',
      category: 'Protein',
      currentStock: 120,
      minStock: 200,
      unit: 'pieces',
      costPerUnit: 2.50,
      supplier: 'Prime Meats Co.',
      lastOrdered: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'critical'
    },
    {
      id: '2',
      name: 'Lettuce',
      category: 'Produce',
      currentStock: 15,
      minStock: 20,
      unit: 'heads',
      costPerUnit: 1.20,
      supplier: 'Fresh Farms',
      lastOrdered: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: 'low'
    },
    {
      id: '3',
      name: 'Brioche Buns',
      category: 'Bakery',
      currentStock: 80,
      minStock: 50,
      unit: 'packs',
      costPerUnit: 3.80,
      supplier: 'Golden Bakery',
      lastOrdered: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: 'adequate'
    }
  ];

  const criticalItems = inventoryItems.filter(item => item.status === 'critical').length;
  const totalInventoryValue = inventoryItems.reduce((sum, item) => 
    sum + (item.currentStock * item.costPerUnit), 0
  );

  const getStatusColor = (status: InventoryItem['status']) => {
    switch (status) {
      case 'adequate': return 'text-green-600 bg-green-100';
      case 'low': return 'text-amber-600 bg-amber-100';
      case 'critical': return 'text-red-600 bg-red-100';
    }
  };

  const getStockPercentage = (item: InventoryItem) => {
    const bufferStock = item.minStock * 1.5;
    return Math.min((item.currentStock / bufferStock) * 100, 100);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Package className="h-5 w-5 mr-2 text-purple-600" />
          Inventory Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Package className="h-5 w-5 text-blue-600" />
                <Badge className="bg-blue-100 text-blue-700">{inventoryItems.length}</Badge>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-2">${totalInventoryValue.toFixed(2)}</p>
              <p className="text-sm text-blue-600/70">Total Inventory Value</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-rose-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <Badge className="bg-red-100 text-red-700">{criticalItems}</Badge>
              </div>
              <p className="text-2xl font-bold text-red-600 mt-2">{criticalItems}</p>
              <p className="text-sm text-red-600/70">Critical Items</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <TrendingDown className="h-5 w-5 text-green-600" />
                <Badge className="bg-green-100 text-green-700">-15%</Badge>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-2">$1,240</p>
              <p className="text-sm text-green-600/70">Monthly Usage</p>
            </CardContent>
          </Card>
        </div>

        {/* Inventory List */}
        <div className="space-y-4">
          {inventoryItems.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <Package className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{item.category}</span>
                      <span>•</span>
                      <span>{item.supplier}</span>
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(item.status)}>
                  {item.status.toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div>
                  <p className="text-sm text-gray-600">Current Stock</p>
                  <p className="font-semibold">{item.currentStock} {item.unit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Min. Required</p>
                  <p className="font-semibold">{item.minStock} {item.unit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cost</p>
                  <p className="font-semibold">${item.costPerUnit}/{item.unit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Value</p>
                  <p className="font-semibold">${(item.currentStock * item.costPerUnit).toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Stock Level</span>
                  <span>{Math.round(getStockPercentage(item))}%</span>
                </div>
                <Progress 
                  value={getStockPercentage(item)} 
                  className={`h-2 ${
                    item.status === 'critical' ? 'bg-red-200' :
                    item.status === 'low' ? 'bg-amber-200' : 'bg-green-200'
                  }`}
                />
              </div>

              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-gray-500">
                  Last ordered: {item.lastOrdered.toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Order
                  </Button>
                  <Button variant="ghost" size="sm">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryManager;