"use client";

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, Users, Tag, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const quickActions = [
  { id: 'new-client', name: '新的客户', icon: UserPlus, color: 'text-blue-500', bgColor: 'bg-blue-50' },
  { id: 'groups', name: '项目群聊', icon: Users, color: 'text-green-500', bgColor: 'bg-green-50' },
  { id: 'tags', name: '标签', icon: Tag, color: 'text-purple-500', bgColor: 'bg-purple-50' },
];

const clients = [
  { id: 1, name: '张伟', pinyin: 'Z', phone: '138-0000-1111', projects: 3 },
  { id: 2, name: '李娜', pinyin: 'L', phone: '139-1111-2222', projects: 1 },
  { id: 3, name: '王强', pinyin: 'W', phone: '137-2222-3333', projects: 5 },
  { id: 4, name: '赵敏', pinyin: 'Z', phone: '136-3333-4444', projects: 2 },
  { id: 5, name: 'John Smith', pinyin: 'J', phone: '135-4444-5555', projects: 2 },
  { id: 6, name: 'Mike Wilson', pinyin: 'M', phone: '134-5555-6666', projects: 1 },
];

// Group clients by first letter
const groupedClients = clients.reduce((acc, client) => {
  const letter = client.pinyin;
  if (!acc[letter]) acc[letter] = [];
  acc[letter].push(client);
  return acc;
}, {} as Record<string, typeof clients>);

const sortedLetters = Object.keys(groupedClients).sort();

const Clients = () => {
  const navigate = useNavigate();

  const headerRight = (
    <Button size="sm" className="hidden md:flex">
      <UserPlus className="h-4 w-4 mr-2" />
      新客户
    </Button>
  );

  return (
    <AppLayout title="客户" headerRight={headerRight}>
      <div className="p-4 md:p-6 space-y-4">
        {/* Search and Filter Bar */}
        <div className="flex gap-2 md:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="搜索客户..." className="pl-10" />
          </div>
          <Button variant="outline" className="md:hidden">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Desktop Filter Bar */}
        <div className="hidden md:flex md:items-center md:space-x-4 md:pb-4">
          <span className="text-sm text-muted-foreground">筛选:</span>
          <Button variant="ghost" size="sm" className="text-primary">全部</Button>
          <Button variant="ghost" size="sm">有项目</Button>
          <Button variant="ghost" size="sm">新客户</Button>
          <div className="flex-1"></div>
          <Button onClick={() => navigate('/clients/new')}>
            <UserPlus className="h-4 w-4 mr-2" />
            新客户
          </Button>
        </div>

        {/* Quick Actions - Mobile Only */}
        <Card className="md:hidden">
          <CardContent className="p-2">
            {quickActions.map((action) => (
              <div 
                key={action.id}
                className="flex items-center p-2 rounded-lg active:bg-secondary cursor-pointer"
              >
                <div className={`h-8 w-8 rounded-md flex items-center justify-center ${action.bgColor}`}>
                  <action.icon className={`h-4 w-4 ${action.color}`} />
                </div>
                <span className="ml-3 font-medium text-foreground">{action.name}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Desktop Stats */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">12</div>
              <div className="text-sm text-muted-foreground">总客户数</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">8</div>
              <div className="text-sm text-muted-foreground">活跃客户</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-amber-600">4.9</div>
              <div className="text-sm text-muted-foreground">平均评分</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Clients List */}
      <div className="relative">
        {sortedLetters.map((letter) => (
          <div key={letter}>
            <div className="px-4 md:px-6 py-1.5 bg-secondary">
              <span className="text-sm font-semibold text-muted-foreground">{letter}</span>
            </div>
            <div className="bg-card">
              {groupedClients[letter].map((client) => (
                <div 
                  key={client.id}
                  onClick={() => navigate(`/client/${client.id}`)}
                  className="flex items-center px-4 md:px-6 py-3 active:bg-secondary cursor-pointer border-b hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{client.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center">
                      <span className="font-medium text-foreground">{client.name}</span>
                      {client.projects > 0 && (
                        <span className="text-xs text-muted-foreground ml-2">{client.projects}个项目</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{client.phone}</p>
                  </div>
                  <div className="hidden md:block">
                    <Button variant="ghost" size="sm">
                      查看详情
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {/* Letter Index - Right Side */}
        <div className="fixed right-1 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-1 z-40 bg-background/50 backdrop-blur-sm p-1 rounded-full md:right-4">
          {sortedLetters.map((letter) => (
            <a href={`#${letter}`} key={letter} className="text-xs font-bold text-primary px-1">
              {letter}
            </a>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Clients;