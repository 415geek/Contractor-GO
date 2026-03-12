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
  Users, 
  Star, 
  TrendingUp, 
  MessageSquare,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'vip' | 'regular' | 'new';
  lastVisit: Date;
  totalSpent: number;
  visits: number;
  rating: number;
}

const CustomerManager = () => {
  const customers: Customer[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      email: 'sarah@email.com',
      phone: '(555) 123-4567',
      status: 'vip',
      lastVisit: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      totalSpent: 2850,
      visits: 12,
      rating: 4.9
    },
    {
      id: '2',
      name: 'Mike Rodriguez',
      email: 'mike@email.com',
      phone: '(555) 234-5678',
      status: 'regular',
      lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      totalSpent: 1200,
      visits: 8,
      rating: 4.7
    },
    {
      id: '3',
      name: 'Emily Watson',
      email: 'emily@email.com',
      phone: '(555) 345-6789',
      status: 'new',
      lastVisit: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      totalSpent: 450,
      visits: 2,
      rating: 4.8
    }
  ];

  const vipCustomers = customers.filter(customer => customer.status === 'vip').length;
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
  const avgRating = customers.reduce((sum, customer) => sum + customer.rating, 0) / customers.length;

  const getStatusColor = (status: Customer['status']) => {
    switch (status) {
      case 'vip': return 'bg-purple-100 text-purple-700';
      case 'regular': return 'bg-blue-100 text-blue-700';
      case 'new': return 'bg-green-100 text-green-700';
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Users className="h-5 w-5 mr-2 text-purple-600" />
          Customer Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Star className="h-5 w-5 text-purple-600" />
                <Badge className="bg-purple-100 text-purple-700">{vipCustomers}</Badge>
              </div>
              <p className="text-2xl font-bold text-purple-600 mt-2">{vipCustomers}</p>
              <p className="text-sm text-purple-600/70">VIP Customers</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <Badge className="bg-blue-100 text-blue-700">+8%</Badge>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-2">${totalRevenue}</p>
              <p className="text-sm text-blue-600/70">Total Revenue</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Star className="h-5 w-5 text-green-600" />
                <Badge className="bg-green-100 text-green-700">+0.2</Badge>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-2">{avgRating.toFixed(1)}</p>
              <p className="text-sm text-green-600/70">Avg. Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Customers List */}
        <div className="space-y-4">
          {customers.map((customer) => (
            <div key={customer.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{customer.name}</h4>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(customer.status)}>
                  {customer.status.toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="font-semibold">{customer.phone}</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Spent</p>
                  <p className="font-semibold">${customer.totalSpent}</p>
                </div>
                <div>
                  <p className="text-gray-600">Visits</p>
                  <p className="font-semibold">{customer.visits}</p>
                </div>
                <div>
                  <p className="text-gray-600">Rating</p>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-amber-500 mr-1" />
                    <span className="font-semibold">{customer.rating}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Last visit: {customer.lastVisit.toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Calendar className="h-4 w-4" />
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

export default CustomerManager;