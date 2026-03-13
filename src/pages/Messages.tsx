"use client";

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useNavigate } from 'react-router-dom';
import { 
  Search, MessageSquare, Plus, Filter, Phone, 
  MoreVertical, Globe, ChevronRight, Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// 模拟数据
const virtualNumber = {
  phoneNumber: '(415) 555-0123',
  unreadCount: 3,
  status: 'active',
};

const chats = [
  { 
    id: '1', 
    name: 'John Smith', 
    avatar: 'JS',
    lastMsg: '翻译: 价格可以，我们开始吧', 
    originalMsg: 'Price is good, let\'s start',
    time: '10:30 AM', 
    unread: 2, 
    languageFrom: '🇺🇸',
    languageTo: '🇨🇳',
    isClient: true,
    hasProject: true,
    projectName: 'Johnson厨房翻新',
  },
  { 
    id: '2', 
    name: 'Maria Garcia', 
    avatar: 'MG',
    lastMsg: '翻译: 请发一份详细报价', 
    originalMsg: 'Envíame un presupuesto detallado',
    time: '昨天', 
    unread: 0, 
    languageFrom: '🇪🇸',
    languageTo: '🇨🇳',
    isClient: true,
    hasProject: true,
    projectName: 'Garcia浴室改造',
  },
  { 
    id: '3', 
    name: 'Mike Wilson', 
    avatar: 'MW',
    lastMsg: '预算已经超支了，我们需要谈谈', 
    time: '昨天', 
    unread: 0, 
    languageFrom: '🇺🇸',
    languageTo: '🇨🇳',
    isClient: true,
    hasProject: false,
  },
  { 
    id: '4', 
    name: '材料供应商 - 老王', 
    avatar: '王',
    lastMsg: '水泥下午送到。', 
    time: '星期三', 
    unread: 0, 
    languageFrom: '🇨🇳',
    languageTo: '🇨🇳',
    isClient: false,
    hasProject: false,
  },
];

const Messages = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'unread' | 'client' | 'supplier'>('all');

  const filteredChats = chats.filter(chat => {
    if (filter === 'all') return true;
    if (filter === 'unread') return chat.unread > 0;
    if (filter === 'client') return chat.isClient;
    if (filter === 'supplier') return !chat.isClient;
    return true;
  });

  const headerRight = (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="hidden md:flex">
        <Search className="h-5 w-5" />
      </Button>
      <Button size="sm" onClick={() => navigate('/messages/new')} className="hidden md:flex">
        <Plus className="h-4 w-4 mr-2" />
        新对话
      </Button>
    </div>
  );

  return (
    <AppLayout title="消息" headerRight={headerRight}>
      <div className="p-4 md:p-6 space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="搜索消息或联系人..." 
              className="pl-10 h-12"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-12 w-12">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter('all')}>
                全部消息
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('unread')}>
                未读消息
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('client')}>
                客户
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('supplier')}>
                供应商
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Virtual Number Card */}
        <Card 
          className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 cursor-pointer hover:border-primary/40 transition-colors"
          onClick={() => navigate('/virtual-numbers')}
        >
          <div className="flex items-center p-4">
            <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base">虚拟号码消息</h3>
                <Badge className="bg-primary text-primary-foreground">
                  {virtualNumber.unreadCount} 新消息
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {virtualNumber.phoneNumber}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          </div>
        </Card>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Button
            variant={filter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
            className="flex-shrink-0"
          >
            全部
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('unread')}
            className="flex-shrink-0"
          >
            未读
          </Button>
          <Button
            variant={filter === 'client' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('client')}
            className="flex-shrink-0"
          >
            客户
          </Button>
          <Button
            variant={filter === 'supplier' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('supplier')}
            className="flex-shrink-0"
          >
            供应商
          </Button>
          <div className="flex-1"></div>
          <Button 
            size="sm" 
            onClick={() => navigate('/messages/new')}
            className="flex-shrink-0 md:hidden"
          >
            <Plus className="h-4 w-4 mr-2" />
            新对话
          </Button>
        </div>

        {/* Chats List */}
        <div className="space-y-2">
          {filteredChats.map((chat) => (
            <Card 
              key={chat.id} 
              className="hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => navigate(`/chat/${chat.id}`)}
            >
              <div className="flex items-center p-4">
                <div className="relative flex-shrink-0">
                  <Avatar className="h-12 w-12 md:h-14 md:w-14">
                    <AvatarFallback className="bg-primary/10 text-primary text-base">
                      {chat.avatar}
                    </AvatarFallback>
                  </Avatar>
                  {chat.isClient && (
                    <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                      <Globe className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="ml-4 flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-base truncate">{chat.name}</h3>
                    <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                      {chat.time}
                    </span>
                  </div>
                  
                  {/* Language Indicator */}
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs">{chat.languageFrom}</span>
                    <span className="text-xs text-muted-foreground">→</span>
                    <span className="text-xs">{chat.languageTo}</span>
                    {chat.hasProject && (
                      <Badge variant="outline" className="ml-2 text-xs h-5">
                        {chat.projectName}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground truncate mt-1">
                    {chat.lastMsg}
                  </p>
                </div>
                
                <div className="flex flex-col items-end gap-2 ml-2 flex-shrink-0">
                  {chat.unread > 0 && (
                    <Badge className="bg-primary text-primary-foreground">
                      {chat.unread}
                    </Badge>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        标记为已读
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        归档对话
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="text-destructive">
                        删除对话
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredChats.length === 0 && (
          <div className="text-center py-16">
            <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">没有找到消息</h3>
            <p className="text-muted-foreground mb-4">
              {filter === 'all' 
                ? '开始与客户或供应商沟通吧' 
                : `没有${filter === 'unread' ? '未读' : filter === 'client' ? '客户' : '供应商'}消息`}
            </p>
            <Button onClick={() => navigate('/messages/new')}>
              <Plus className="h-4 w-4 mr-2" />
              开始新对话
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Messages;