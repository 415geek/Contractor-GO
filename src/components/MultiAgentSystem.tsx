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
  Brain, 
  Users, 
  TrendingUp, 
  ChefHat, 
  ShoppingCart,
  Clock,
  DollarSign
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'offline' | 'busy';
  performance: number;
  lastAction: string;
  icon: React.ReactNode;
}

const MultiAgentSystem = () => {
  const agents: Agent[] = [
    {
      id: '1',
      name: 'Inventory Manager',
      role: 'Stock monitoring & ordering',
      status: 'online',
      performance: 92,
      lastAction: 'Ordered beef patties - 2 mins ago',
      icon: <ShoppingCart className="h-5 w-5" />
    },
    {
      id: '2',
      name: 'Menu Optimizer',
      role: 'Pricing & menu analysis',
      status: 'online',
      performance: 88,
      lastAction: 'Adjusted truffle fries price - 5 mins ago',
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      id: '3',
      name: 'Staff Scheduler',
      role: 'Labor optimization',
      status: 'busy',
      performance: 95,
      lastAction: 'Optimizing evening shift - Now',
      icon: <Users className="h-5 w-5" />
    },
    {
      id: '4',
      name: 'Quality Control',
      role: 'Customer feedback analysis',
      status: 'online',
      performance: 85,
      lastAction: 'Resolved 3 complaints - 10 mins ago',
      icon: <ChefHat className="h-5 w-5" />
    }
  ];

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'offline': return 'text-gray-600 bg-gray-100';
      case 'busy': return 'text-amber-600 bg-amber-100';
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Brain className="h-5 w-5 mr-2 text-purple-600" />
          AI Agent System
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agents.map((agent) => (
            <div key={agent.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    {agent.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                    <p className="text-sm text-gray-500">{agent.role}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(agent.status)}>
                  {agent.status.toUpperCase()}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Performance</span>
                  <span className="text-sm font-semibold text-purple-600">{agent.performance}%</span>
                </div>
                <Progress value={agent.performance} className="h-2" />
                
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {agent.lastAction}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* System Overview */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-purple-600">System Health</h4>
              <p className="text-sm text-purple-600/70">All agents operational</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">100%</div>
              <div className="text-xs text-green-600/70">Uptime</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MultiAgentSystem;