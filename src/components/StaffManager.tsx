"use client";

import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  DollarSign, 
  TrendingUp,
  Plus,
  MoreVertical,
  Star,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  hourlyRate: number;
  hoursThisWeek: number;
  performance: number;
  status: 'active' | 'off' | 'on-break';
  nextShift: Date;
  skills: string[];
}

export const StaffManager = () => {
  const [view, setView] = useState<'list' | 'schedule'>('list');

  const staffMembers: StaffMember[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      role: 'Head Chef',
      email: 'sarah@restaurant.com',
      phone: '(555) 123-4567',
      hourlyRate: 35,
      hoursThisWeek: 42,
      performance: 95,
      status: 'active',
      nextShift: new Date(Date.now() + 2 * 60 * 60 * 1000),
      skills: ['Culinary', 'Management', 'Training']
    },
    {
      id: '2',
      name: 'Mike Rodriguez',
      role: 'Sous Chef',
      email: 'mike@restaurant.com',
      phone: '(555) 234-5678',
      hourlyRate: 28,
      hoursThisWeek: 38,
      performance: 88,
      status: 'on-break',
      nextShift: new Date(Date.now() + 1 * 60 * 60 * 1000),
      skills: ['Grill', 'Sauces', 'Prep']
    },
    {
      id: '3',
      name: 'Emily Watson',
      role: 'Server',
      email: 'emily@restaurant.com',
      phone: '(555) 345-6789',
      hourlyRate: 18,
      hoursThisWeek: 32,
      performance: 92,
      status: 'active',
      nextShift: new Date(Date.now() + 3 * 60 * 60 * 1000),
      skills: ['Customer Service', 'POS', 'Wine']
    },
    {
      id: '4',
      name: 'David Kim',
      role: 'Bartender',
      email: 'david@restaurant.com',
      phone: '(555) 456-7890',
      hourlyRate: 22,
      hoursThisWeek: 36,
      performance: 90,
      status: 'off',
      nextShift: new Date(Date.now() + 24 * 60 * 60 * 1000),
      skills: ['Mixology', 'Cocktails', 'Inventory']
    }
  ];

  const getStatusColor = (status: StaffMember['status']) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'on-break': return 'text-amber-600 bg-amber-100';
      case 'off': return 'text-gray-600 bg-gray-100';
    }
  };

  const totalLaborCost = staffMembers.reduce((sum, staff) => 
    sum + (staff.hoursThisWeek * staff.hourlyRate), 0
  );

  const activeStaff = staffMembers.filter(staff => staff.status === 'active').length;

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center text-lg">
          <Users className="h-5 w-5 mr-2 text-purple-600" />
          Staff Management
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button 
            variant={view === 'list' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setView('list')}
            className={view === 'list' ? 'bg-purple-600' : ''}
          >
            List
          </Button>
          <Button 
            variant={view === 'schedule' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setView('schedule')}
            className={view === 'schedule' ? 'bg-purple-600' : ''}
          >
            Schedule
          </Button>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Users className="h-5 w-5 text-blue-600" />
                <Badge className="bg-blue-100 text-blue-700">{staffMembers.length}</Badge>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-2">{staffMembers.length}</p>
              <p className="text-sm text-blue-600/70">Total Staff</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Clock className="h-5 w-5 text-green-600" />
                <Badge className="bg-green-100 text-green-700">{activeStaff}</Badge>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-2">{activeStaff}</p>
              <p className="text-sm text-green-600/70">Active Now</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <DollarSign className="h-5 w-5 text-purple-600" />
                <Badge className="bg-purple-100 text-purple-700">-5%</Badge>
              </div>
              <p className="text-2xl font-bold text-purple-600 mt-2">${totalLaborCost}</p>
              <p className="text-sm text-purple-600/70">Weekly Labor</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <TrendingUp className="h-5 w-5 text-amber-600" />
                <Badge className="bg-amber-100 text-amber-700">+8%</Badge>
              </div>
              <p className="text-2xl font-bold text-amber-600 mt-2">4.7</p>
              <p className="text-sm text-amber-600/70">Avg. Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Staff List */}
        {view === 'list' && (
          <div className="space-y-4">
            {staffMembers.map((staff) => (
              <div key={staff.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        {staff.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <h4 className="font-semibold text-gray-900">{staff.name}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{staff.role}</span>
                        <span>•</span>
                        <span>${staff.hourlyRate}/hr</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(staff.status)}>
                      {staff.status.toUpperCase()}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-600">Hours This Week</p>
                    <p className="font-semibold">{staff.hoursThisWeek}h</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Performance</p>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-amber-500 mr-1" />
                      <span className="font-semibold">{staff.performance}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Next Shift</p>
                    <p className="font-semibold">{staff.nextShift.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact</p>
                    <div className="flex space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                    {staff.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Schedule View */}
        {view === 'schedule' && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Schedule view coming soon...</p>
            <p className="text-sm">Interactive shift scheduling and calendar integration</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};