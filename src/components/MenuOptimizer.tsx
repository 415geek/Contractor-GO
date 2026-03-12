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
  Utensils, 
  TrendingUp, 
  TrendingDown, 
  Star,
  DollarSign,
  Clock,
  Edit
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  margin: number;
  popularity: number;
  preparationTime: number;
  rating: number;
  status: 'best-seller' | 'trending' | 'underperforming';
}

const MenuOptimizer = () => {
  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Signature Burger',
      category: 'Main Course',
      price: 18.99,
      cost: 6.50,
      margin: 65.8,
      popularity: 92,
      preparationTime: 12,
      rating: 4.8,
      status: 'best-seller'
    },
    {
      id: '2',
      name: 'Truffle Fries',
      category: 'Sides',
      price: 9.99,
      cost: 2.80,
      margin: 72.0,
      popularity: 88,
      preparationTime: 8,
      rating: 4.6,
      status: 'trending'
    },
    {
      id: '3',
      name: 'Craft Cocktail',
      category: 'Beverages',
      price: 14.99,
      cost: 3.20,
      margin: 78.7,
      popularity: 85,
      preparationTime: 5,
      rating: 4.7,
      status: 'best-seller'
    },
    {
      id: '4',
      name: 'Vegetarian Burger',
      category: 'Main Course',
      price: 16.99,
      cost: 5.80,
      margin: 65.9,
      popularity: 75,
      preparationTime: 10,
      rating: 4.3,
      status: 'underperforming'
    }
  ];

  const bestSellers = menuItems.filter(item => item.status === 'best-seller').length;
  const totalRevenue = menuItems.reduce((sum, item) => sum + (item.popularity * item.price), 0);
  const avgMargin = menuItems.reduce((sum, item) => sum + item.margin, 0) / menuItems.length;

  const getStatusColor = (status: MenuItem['status']) => {
    switch (status) {
      case 'best-seller': return 'text-green-600 bg-green-100';
      case 'trending': return 'text-blue-600 bg-blue-100';
      case 'underperforming': return 'text-amber-600 bg-amber-100';
    }
  };

  const getStatusIcon = (status: MenuItem['status']) => {
    switch (status) {
      case 'best-seller': return <TrendingUp className="h-3 w-3" />;
      case 'trending': return <Star className="h-3 w-3" />;
      case 'underperforming': return <TrendingDown className="h-3 w-3" />;
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Utensils className="h-5 w-5 mr-2 text-purple-600" />
          Menu Optimizer
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <DollarSign className="h-5 w-5 text-green-600" />
                <Badge className="bg-green-100 text-green-700">+12%</Badge>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-2">${totalRevenue.toFixed(0)}</p>
              <p className="text-sm text-green-600/70">Projected Revenue</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <Badge className="bg-blue-100 text-blue-700">{avgMargin.toFixed(1)}%</Badge>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-2">{avgMargin.toFixed(1)}%</p>
              <p className="text-sm text-blue-600/70">Avg. Margin</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Star className="h-5 w-5 text-amber-600" />
                <Badge className="bg-amber-100 text-amber-700">{bestSellers}</Badge>
              </div>
              <p className="text-2xl font-bold text-amber-600 mt-2">{bestSellers}</p>
              <p className="text-sm text-amber-600/70">Best Sellers</p>
            </CardContent>
          </Card>
        </div>

        {/* Menu Items List */}
        <div className="space-y-4">
          {menuItems.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <Utensils className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{item.category}</span>
                      <span>•</span>
                      <span>${item.price}</span>
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(item.status)}>
                  <div className="flex items-center">
                    {getStatusIcon(item.status)}
                    <span className="ml-1">{item.status.replace('-', ' ').toUpperCase()}</span>
                  </div>
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div>
                  <p className="text-sm text-gray-600">Margin</p>
                  <p className="font-semibold text-green-600">{item.margin}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Popularity</p>
                  <p className="font-semibold">{item.popularity}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Prep Time</p>
                  <p className="font-semibold">{item.preparationTime} min</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rating</p>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-amber-500 mr-1" />
                    <span className="font-semibold">{item.rating}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Profit Potential</span>
                  <span>{Math.round((item.price - item.cost) * item.popularity / 10)}$</span>
                </div>
                <Progress value={item.popularity} className="h-2 bg-gray-200" />
              </div>

              <div className="flex justify-between items-center mt-3">
                <div className="text-xs text-gray-500">
                  Cost: ${item.cost} | Profit: ${(item.price - item.cost).toFixed(2)}
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Optimize
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuOptimizer;