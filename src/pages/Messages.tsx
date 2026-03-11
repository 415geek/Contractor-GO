"use client";

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useNavigate } from 'react-router-dom';
import { Search, MessageSquare, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const chats = [
  { 
    id: '1', 
    name: 'John Smith', 
    lastMsg: 'AI翻译: 好的，明天早上9点见。', 
    time: '14:30', 
    unread: 2, 
    avatar: 'JS',
    isClient: true 
  },
  { 
    id: '2', 
    name: 'Mike Wilson', 
    lastMsg: 'AI翻译: 预算已经超支了，我们需要谈谈。', 
    time: '昨天', 
    unread: 0, 
    avatar: 'MW',
    isClient: true 
  },
  { 
    id: '3', 
    name: '材料供应商 - 老王', 
    lastMsg: '水泥下午送到。', 
    time: '星期三', 
    unread: 0, 
    avatar: '王',
    isClient: false 
  },
];

const Messages = () => {
  const navigate = useNavigate();

  const headerRight = (
    <Button variant="ghost" size="icon" className="hidden md:flex">
      <Plus className="h-5 w-5" />
    </Button>
  );

  return (
    <AppLayout title="消息" headerRight={headerRight}>
      <div className="p-4 md:p-6 space-y-4">
        {/* Search and Filter Bar */}
        <div className="flex gap-2 md:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="搜索消息..." className="pl-10" />
          </div>
          <Button variant="outline" className="md:hidden">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Desktop Filter Bar */}
        <div className="hidden md:flex md:items-center md:space-x-4 md:pb-4">
          <span className="text-sm text-muted-foreground">筛选:</span>
          <Button variant="ghost" size="sm" className="text-primary">全部</Button>
          <Button variant="ghost" size="sm">未读</Button>
          <Button variant="ghost" size="sm">客户</Button>
          <Button variant="ghost" size="sm">供应商</Button>
          <div className="flex-1"></div>
          <Button onClick={() => navigate('/messages/new')}>
            <Plus className="h-4 w-4 mr-2" />
            新对话
          </Button>
        </div>

        {/* Chats List */}
        <div className="bg-card rounded-lg border md:shadow-sm">
          {chats.map((chat) => (
            <div 
              key={chat.id} 
              onClick={() => navigate(`/chat/${chat.id}`)}
              className="flex items-center p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b last:border-b-0 md:px-6"
            >
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {chat.avatar}
                </AvatarFallback>
              </Avatar>
              
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-foreground truncate">{chat.name}</h3>
                  <span className="text-xs text-muted-foreground">{chat.time}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate mt-1">
                  {chat.lastMsg}
                </p>
              </div>
              
              {chat.unread > 0 && (
                <Badge className="ml-2 bg-primary text-primary-foreground">
                  {chat.unread}
                </Badge>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {chats.length === 0 && (
          <div className="text-center py-12 md:py-24">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">还没有消息</p>
            <p className="text-sm text-muted-foreground mt-1">开始与客户或供应商沟通吧</p>
            <Button className="mt-4" onClick={() => navigate('/messages/new')}>
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