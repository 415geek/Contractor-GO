"use client";

import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Clock,
  DollarSign,
  ChefHat,
  Sparkles
} from 'lucide-react';

interface RealTimeMetric {
  id: string;
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
}

interface LiveOrder {
  id: string;
  items: string[];
  status: 'preparing' | 'ready' | 'served';
  time: number;
  value: number;
}

const RealTimeAnalytics = () => {
  const metrics: RealTimeMetric[] = [
    {
      id: '1',
      label: 'Current Orders',
      value: 12,
      change: +2,
      trend: 'up',
      icon: <Activity className="h-4 w-4" />,
      color: 'text-blue-600'
    },
    {
      id: '2',
      label: 'Avg. Wait Time',
      value: 8,
      change: -1,
      trend: 'down',
      icon: <Clock className="h-4 w-4" />,
      color: 'text-green-600'
    },
    {
      id: '3',
      label: 'Hourly Revenue',
      value: 450,
      change: +15,
      trend: 'up',
      icon: <DollarSign className="h-4 w-4" />,
      color: 'text-purple-600'
    },
    {
      id: '4',
      label: 'Customer Satisfaction',
      value: 94,
      change: +3,
      trend: 'up',
      icon: <Users className="h-4 w-4" />,
      color: 'text-amber-600'
    }
  ];

  const liveOrders: LiveOrder[] = [
    {
      id: '1001',
      items: ['Signature Burger', 'Truffle Fries'],
      status: 'preparing',
      time: 5,
      value: 32
    },
    {
      id: '1002',
      items: ['Craft Cocktail', 'Sweet Potato Fries'],
      status: 'ready',
      time: 2,
      value: 28
    },
    {
      id: '1003',
      items: ['Premium Burger', 'Craft Beer'],
      status: 'served',
      time: 0,
      value: 42
    }
  ];

  const getTrendIcon = (trend: RealTimeMetric['trend']) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'down': return <TrendingUp className="h-3 w-3 text-red-600 transform rotate-180" />;
      case 'stable': return <div className="h-3 w-3 text-gray-400">→</div>;
    }
  };

  const getStatusColor = (status: LiveOrder['status']) => {
    switch (status) {
      case 'preparing': return 'text-amber-600 bg-amber-100';
      case 'ready': return 'text-blue-600 bg-blue-100';
      case 'served': return 'text-green-600 bg-green-100';
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
          Real-Time Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {metrics.map((metric) => (
            <div key={metric.id} className="border rounded-lg p-4 text-center">
              <div className={`h-8 w-8 ${metric.color} bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2`}>
                {metric.icon}
              </div>
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              <div className="text-sm text-gray-600 mb-1">{metric.label}</div>
              <div className="flex items-center justify-center text-xs">
                {getTrendIcon(metric.trend)}
                <span className={metric.change >= 0 ? 'text-green-600 ml-1' : 'text-red-600 ml-1'}>
                  {metric.change >= 0 ? '+' : ''}{metric.change}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Live Orders */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <ChefHat className="h-4 w-4 mr-2 text-amber-600" />
            Live Kitchen Orders
          </h3>
          <div className="space-y-3">
            {liveOrders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">Order #{order.id}</h4>
                    <p className="text-sm text-gray-500">${order.value}</p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-1">Items:</p>
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {order.status === 'preparing' && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Time remaining:</span>
                    <span className="font-semibold text-amber-600">{order.time} min</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-green-600">Kitchen Performance</h4>
              <p className="text-sm text-green-600/70">Orders processed this hour</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">24</div>
              <div className="text-xs text-green-600/70">orders</div>
            </div>
          </div>
          <Progress value={85} className="mt-2 h-2 bg-green-200" />
          <div className="flex justify-between text-xs text-green-600 mt-1">
            <span>Efficiency</span>
            <span>85%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeAnalytics;