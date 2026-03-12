"use client";

import React, { useState } from 'react';
import { 
  Users, 
  Star, 
  TrendingUp, 
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  Award,
  CreditCard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  loyaltyLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
  totalSpent: number;
  visits: number;
  lastVisit: Date;
  favoriteItems: string[];
  satisfactionScore: number;
}

export const CustomerManager = () => {
  const [view, setView] = useState<'overview' | 'details'>('overview');

  const customers: Customer[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@email.com',
      phone: '(555) 123-4567',
      loyaltyLevel: 'platinum',
      totalSpent: 2840,
      visits: 42,
      lastVisit: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      favoriteItems: ['Signature Burger', 'Truffle Fries', 'Craft Cocktail'],
      satisfactionScore: 95
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike@email.com',
      phone: '(555) 234-5678',
      loyaltyLevel: 'gold',
      totalSpent: 1560,
      visits: 28,
      lastVisit: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      favoriteItems: ['Premium Burger', 'Sweet Potato Fries'],
      satisfactionScore: 92
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily@email.com',
      phone: '(555) 345-6789',
      loyaltyLevel: 'silver',
      totalSpent: 890,
      visits: 15,
      lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      favoriteItems: ['Vegetarian Burger', 'Salad'],
      satisfactionScore: 88
    }
  ];

  const getLoyaltyColor = (level: Customer['loyaltyLevel']) => {
    switch (level) {
      case 'platinum': return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800';
      case 'gold': return 'bg-gradient-to-r from-amber-300 to-amber-400 text-amber-800';
      case 'silver': return 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700';
      case 'bronze': return 'bg-gradient-to-r from-orange-200 to-orange-300 text-orange-700';
    }
  };

  const totalCustomers = customers.length;
  const vipCustomers = customers.filter(c => c.loyaltyLevel === 'platinum' || c.loyaltyLevel === 'gold').length;
  const avgSatisfaction = customers.reduce((sum, c) => sum + c.satisfactionScore, 0) / totalCustomers;

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center text-lg">
          <Users className="h-5 w-5 mr-2 text-purple-600" />
          Customer Management
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button 
            variant={view === 'overview' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setView('overview')}
            className={view === 'overview' ? 'bg-purple-600' : ''}
          >
            Overview
          </Button>
          <Button 
            variant={view === 'details' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setView('details')}
            className={view === 'details' ? 'bg-purple-600' : ''}
          >
            Details
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Overview Stats */}
        {view === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Users className="h-5 w-5 text-blue-600" />
                  <Badge className="bg-blue-100 text-blue-700">{totalCustomers}</Badge>
                </div>
                <p className="text-2xl font-bold text-blue-600 mt-2">{totalCustomers}</p>
                <p className="text-sm text-blue-600/70">Total Customers</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Award className="h-5 w-5 text-amber-600" />
                  <Badge className="bg-amber-100 text-amber-700">{vipCustomers}</Badge>
                </div>
                <p className="text-2xl font-bold text-amber-600 mt-2">{vipCustomers}</p>
                <p className="text-sm text-amber-600/70">VIP Customers</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Star className="h-5 w-5 text-green-600" />
                  <Badge className="bg-green-100 text-green-700">+5%</Badge>
                </div>
                <p className="text-2xl font-bold text-green-600 mt-2">{avgSatisfaction.toFixed(1)}</p>
                <p className="text-sm text-green-600/70">Avg. Satisfaction</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Customer Details */}
        {view === 'details' && (
          <div className="space-y-4">
            {customers.map((customer) => (
              <div key={customer.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <h4 className="font-semibold text-gray-900">{customer.name}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{customer.email}</span>
                        <span>•</span>
                        <span>{customer.phone}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getLoyaltyColor(customer.loyaltyLevel)}>
                    {customer.loyaltyLevel.toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-600">Total Spent</p>
                    <p className="font-semibold">${customer.totalSpent}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Visits</p>
                    <p className="font-semibold">{customer.visits}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Satisfaction</p>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-amber-500 mr-1" />
                      <span className="font-semibold">{customer.satisfactionScore}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Visit</p>
                    <p className="font-semibold">{customer.lastVisit.toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Favorite Items:</p>
                    <div className="flex space-x-1">
                      {customer.favoriteItems.slice(0, 2).map((item, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                      {customer.favoriteItems.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{customer.favoriteItems.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Customer Growth */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
          <h4 className="font-semibold text-purple-600 mb-2">Customer Growth</h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600/70">New customers this month</p>
              <p className="text-2xl font-bold text-purple-600">24</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-purple-600/70">Growth rate</p>
              <p className="text-lg font-bold text-green-600">+15%</p>
            </div>
          </div>
          <Progress value={75} className="mt-2 h-2 bg-purple-200" />
          <div className="flex justify-between text-xs text-purple-600 mt-1">
            <span>Retention Rate</span>
            <span>75%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};