"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Package, 
  Clock, 
  AlertCircle,
  ChefHat,
  ShoppingCart,
  Star,
  Calendar,
  BarChart3,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from "@/lib/utils";
import AppLayout from '@/components/AppLayout';
import { AIManager } from '@/components/AIManager';
import { TestSetup } from '@/components/TestSetup';

const RestaurantDashboard = () => {
  const navigate = useNavigate();

  // Mock data for the dashboard
  const kpiData = {
    todaySales: { value: '$2,845', change: '+12%', trend: 'up' },
    orders: { value: '89', change: '+8%', trend: 'up' },
    averageTicket: { value: '$32.50', change: '+3%', trend: 'up' },
    laborCost: { value: '18.5%', change: '-2%', trend: 'down' },
    inventoryAlert: { value: '3 items', change: '2 critical', trend: 'alert' }
  };

  const topItems = [
    { name: 'Signature Burger', sales: 28, revenue: '$896', margin: '65%' },
    { name: 'Truffle Fries', sales: 24, revenue: '$432', margin: '72%' },
    { name: 'Craft Cocktail', sales: 19, revenue: '$342', margin: '78%' }
  ];

  const alerts = [
    { type: 'inventory', message: 'Beef patties running low - 2 days left', severity: 'high' },
    { type: 'labor', message: 'Evening shift overstaffed by 2 hours', severity: 'medium' },
    { type: 'quality', message: '3 customer complaints about service speed', severity: 'medium' }
  ];

  const headerRight = (
    <>
      <Button variant="ghost" size="icon" className="text-purple-600">
        <Settings className="h-5 w-5" />
      </Button>
      <Button 
        size="sm" 
        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
        onClick={() => navigate('/restaurant-dashboard/settings')}
      >
        <BarChart3 className="h-4 w-4 mr-2" />
        Analytics
      </Button>
    </>
  );

  return (
    <AppLayout title="Restaurant OS" headerRight={headerRight}>
      <div className="p-4 md:p-6 space-y-6">
        <TestSetup />
        {/* Welcome Header with Unicorn Theme */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 md:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Good morning, Chef! 👋
              </h1>
              <p className="text-purple-600/70 mt-2">Ready to create another amazing day?</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-purple-600/70">Today's forecast</p>
                <p className="font-semibold text-purple-600">$3,200 expected</p>
              </div>
              <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                <ChefHat className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Top KPI Cards - Unicorn Theme */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-100 to-indigo-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <DollarSign className="h-5 w-5 text-purple-600" />
                <Badge variant={kpiData.todaySales.trend === 'up' ? 'default' : 'destructive'} className="bg-purple-100 text-purple-700">
                  {kpiData.todaySales.change}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-purple-600 mt-2">{kpiData.todaySales.value}</p>
              <p className="text-sm text-purple-600/70">Today's Sales</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-100 to-cyan-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Users className="h-5 w-5 text-blue-600" />
                <Badge variant={kpiData.orders.trend === 'up' ? 'default' : 'destructive'} className="bg-blue-100 text-blue-700">
                  {kpiData.orders.change}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-2">{kpiData.orders.value}</p>
              <p className="text-sm text-blue-600/70">Orders</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-100 to-emerald-100 hidden md:block">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <Badge variant={kpiData.averageTicket.trend === 'up' ? 'default' : 'destructive'} className="bg-green-100 text-green-700">
                  {kpiData.averageTicket.change}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-2">{kpiData.averageTicket.value}</p>
              <p className="text-sm text-green-600/70">Avg. Ticket</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-100 to-orange-100 hidden md:block">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Clock className="h-5 w-5 text-amber-600" />
                <Badge variant={kpiData.laborCost.trend === 'down' ? 'default' : 'destructive'} className="bg-amber-100 text-amber-700">
                  {kpiData.laborCost.change}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-amber-600 mt-2">{kpiData.laborCost.value}</p>
              <p className="text-sm text-amber-600/70">Labor Cost</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-100 to-rose-100 hidden md:block">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <Badge variant="destructive" className="bg-red-100 text-red-700">
                  {kpiData.inventoryAlert.change}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-red-600 mt-2">{kpiData.inventoryAlert.value}</p>
              <p className="text-sm text-red-600/70">Inventory Alert</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Top Performing Items */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Star className="h-5 w-5 text-amber-500 mr-2" />
                Top Performing Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                        <ChefHat className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-purple-600">{item.name}</p>
                        <p className="text-sm text-purple-600/70">{item.sales} sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{item.revenue}</p>
                      <p className="text-sm text-green-600/70">{item.margin} margin</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alerts & Notifications */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                Priority Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "p-3 rounded-lg border-l-4",
                      alert.severity === 'high' 
                        ? "bg-red-50 border-l-red-500" 
                        : "bg-amber-50 border-l-amber-500"
                    )}
                  >
                    <div className="flex items-start">
                      <AlertCircle className={cn(
                        "h-4 w-4 mt-0.5 mr-2 flex-shrink-0",
                        alert.severity === 'high' ? "text-red-500" : "text-amber-500"
                      )} />
                      <p className="text-sm text-gray-700">{alert.message}</p>
                    </div>
                    <Button variant="link" size="sm" className="text-purple-600 p-0 h-auto mt-2">
                      View details →
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="bg-white text-purple-600 hover:bg-purple-100 border border-purple-200">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Inventory
              </Button>
              <Button className="bg-white text-purple-600 hover:bg-purple-100 border border-purple-200">
                <Users className="h-4 w-4 mr-2" />
                Staff
              </Button>
              <Button className="bg-white text-purple-600 hover:bg-purple-100 border border-purple-200">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
              <Button className="bg-white text-purple-600 hover:bg-purple-100 border border-purple-200">
                <BarChart3 className="h-4 w-4 mr-2" />
                Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <AIManager />
    </AppLayout>
  );
};

export default RestaurantDashboard;