"use client";

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { 
  Activity, 
  TrendingUp, 
  Users, 
  DollarSign, 
  ChefHat,
  ShoppingCart,
  Clock,
  Star,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RealTimeAnalytics } from '@/components/RealTimeAnalytics';
import { MultiAgentSystem } from '@/components/MultiAgentSystem';
import { POSIntegration } from '@/components/POSIntegration';
import { InventoryManager } from '@/components/InventoryManager';
import { StaffManager } from '@/components/StaffManager';
import { AIManager } from '@/components/AIManager';
import { useAuth } from '@/contexts/AuthContext';

const RestaurantDashboard = () => {
  const { user } = useAuth();

  const quickStats = [
    { label: 'Today Revenue', value: '$2,845', change: '+12%', icon: DollarSign, color: 'text-green-600' },
    { label: 'Active Orders', value: '12', change: '+2', icon: Activity, color: 'text-blue-600' },
    { label: 'Customer Satisfaction', value: '4.9', change: '+0.2', icon: Star, color: 'text-amber-600' },
    { label: 'Avg. Wait Time', value: '8 min', change: '-1 min', icon: Clock, color: 'text-purple-600' },
  ];

  const headerRight = (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="icon" className="text-muted-foreground">
        <Sparkles className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" className="text-muted-foreground">
        <Users className="h-5 w-5" />
      </Button>
    </div>
  );

  return (
    <AppLayout title="Restaurant OS" headerRight={headerRight}>
      <div className="p-4 md:p-6 space-y-6">
        {/* Welcome Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div>
            <p className="text-muted-foreground">Welcome back,</p>
            <h2 className="text-2xl font-bold text-foreground">Chef Michael</h2>
          </div>
          <div className="hidden md:flex md:space-x-2 md:mt-0 mt-4">
            <Button variant="outline" size="sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Reports
            </Button>
            <Button size="sm">
              <Activity className="h-4 w-4 mr-2" />
              New Order
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className={`h-8 w-8 ${stat.color} bg-opacity-20 rounded-full flex items-center justify-center`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                  <Badge variant="secondary" className={
                    stat.change.startsWith('+') ? 'bg-green-100 text-green-700' :
                    stat.change.startsWith('-') ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }>
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Real-time Analytics */}
        <RealTimeAnalytics />

        {/* Multi-Agent System */}
        <MultiAgentSystem />

        {/* POS Integration */}
        <POSIntegration />

        {/* Inventory Management */}
        <InventoryManager />

        {/* Staff Management */}
        <StaffManager />

        {/* AI Manager Floating Button */}
        <AIManager />
      </div>
    </AppLayout>
  );
};

export default RestaurantDashboard;