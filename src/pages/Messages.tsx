"use client";

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useNavigate } from 'react-router-dom';
import { Search, MessageSquare, Plus } from 'lucide-react';
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
    <Button variant="ghost" size="icon">
      <Plus className="h-5 w-5" />
    </Button>
  );

  return (
    <AppLayout title="消息" headerRight={headerRight}>
      <div className="p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="搜索消息..." className="pl-10" />
        </div>

        {/* Chats List */}
        <div className="bg-card rounded-lg border">
          {chats.map((chat) => (
            <div 
              key={chat.id} 
              onClick={() => navigate(`/chat/${chat.id}`)}
              className="flex items-center p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b last:border-b-0"
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
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">还没有消息</p>
            <p className="text-sm text-muted-foreground mt-1">开始与客户或供应商沟通吧</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Messages;