"use client";

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";

const chats = [
  { 
    id: '1', 
    name: 'John Smith (客户)', 
    lastMsg: 'AI翻译: 好的，明天早上9点见。', 
    time: '14:30', 
    unread: 2, 
    avatar: 'JS',
    isClient: true 
  },
  { 
    id: '2', 
    name: 'Mike Wilson (屋顶项目)', 
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

  return (
    <AppLayout title="微信 (3)">
      <div className="bg-white divide-y divide-slate-100">
        {chats.map((chat) => (
          <div 
            key={chat.id} 
            onClick={() => navigate(`/chat/${chat.id}`)}
            className="flex items-center px-4 py-3 active:bg-slate-100 transition-colors cursor-pointer"
          >
            <div className="relative">
              <div className="h-12 w-12 rounded-md bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-lg">
                {chat.avatar}
              </div>
              {chat.unread > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 bg-[#fa5151] text-white border-none flex items-center justify-center text-[10px] rounded-full">
                  {chat.unread}
                </Badge>
              )}
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="text-[16px] font-medium text-slate-900 truncate">{chat.name}</h3>
                <span className="text-[11px] text-slate-400">{chat.time}</span>
              </div>
              <p className="text-[13px] text-slate-500 truncate mt-0.5">
                {chat.lastMsg}
              </p>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
};

export default Messages;