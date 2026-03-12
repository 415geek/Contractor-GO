"use client";

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock, 
  ChefHat,
  ShoppingCart,
  Package,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const RestaurantDashboard = () => {
  const stats = [
    { label: 'Today\'s Revenue', value: '$2,845', change: '+12%', icon: DollarSign, color: 'text-green-600' },
    { label: 'Active Orders', value: '12', change: '+2', icon: Clock, color: 'text-blue-600' },
    { label: 'Customer Satisfaction', value: '94%', change: '+3%', icon: Users, color: 'text-amber-600' },
    { label: 'Kitchen Efficiency', value: '85%', change: '+5%', icon: ChefHat, color: 'text-purple-600' },
  ];

  const quickActions = [
    { label: 'View Menu', icon: BarChart3, color: 'bg-blue-500' },
    { label: 'Manage Staff', icon: Users, color: 'bg-green-500' },
    { label: 'Check Inventory', icon: Package, color: 'bg-amber-500' },
    { label: 'Order Supplies', icon: ShoppingCart, color: 'bg-purple-500' },
  ];

  return (
    <AppLayout title="Restaurant Dashboard">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Restaurant Dashboard</h1>
            <p className="text-muted-foreground">AI-powered restaurant management</p>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Assistant
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`h-10 w-10 rounded-lg ${stat.color.replace('text-', 'bg-')} bg-opacity-20 flex items-center justify-center`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
                <div className="flex items-center mt-3">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">{stat.change}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center p-4 hover:shadow-md transition-shadow"
                >
                  <div className={`h-12 w-12 ${action.color} rounded-lg flex items-center justify-center mb-2`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Sales Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Today</span>
                    <span className="font-semibold">$2,845</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>This Week</span>
                    <span className="font-semibold">$18,240</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>This Month</span>
                    <span className="font-semibold">$62,500</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Top Menu Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Signature Burger', orders: 128, revenue: '$3,840' },
                  { name: 'Truffle Fries', orders: 96, revenue: '$2,880' },
                  { name: 'Craft Cocktails', orders: 84, revenue: '$4,200' },
                  { name: 'Premium Steak', orders: 52, revenue: '$4,160' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 hover:bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.orders} orders</p>
                    </div>
                    <Badge variant="secondary">{item.revenue}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Promote truffle fries during dinner rush</p>
                  <p className="text-sm text-muted-foreground">Expected impact: +15% margin on evening sales</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <Package className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Order beef patties today</p>
                  <p className="text-sm text-muted-foreground">Stock will run out in 2 days at current usage rate</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default RestaurantDashboard;