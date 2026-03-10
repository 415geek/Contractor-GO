"use client";

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { cn } from "@/lib/utils";

const conversations = [
  { 
    id: '1', 
    name: 'John Smith', 
    avatar: 'JS',
    lastMsg: '[AI翻译] 好的，明天早上9点见。', 
    time: '14:30', 
    unread: 2,
    isPinned: true,
  },
  { 
    id: '2', 
    name: 'Flushing 厨房翻新', 
    avatar: '🏠',
    lastMsg: '水电管路重新布局已完成', 
    time: '昨天', 
    unread: 0,
    isProject: true,
  },
  { 
    id: '3', 
    name: 'Mike Wilson', 
    avatar: 'MW',
    lastMsg: '[AI翻译] 预算已经超支了，我们需要谈谈。', 
    time: '昨天', 
    unread: 0,
  },
  { 
    id: '4', 
    name: '材料供应商群', 
    avatar: '👥',
    lastMsg: '老王: 水泥下午送到', 
    time: '星期三', 
    unread: 0,
    isGroup: true,
  },
  { 
    id: '5', 
    name: 'Queens 屋顶维修', 
    avatar: '🏠',
    lastMsg: '与客户确认屋顶材料', 
    time: '星期二', 
    unread: 0,
    isProject: true,
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const headerRight = (
    <>
      <Search className="h-[22px] w-[22px] text-[#191919]" />
      <Plus className="h-[24px] w-[24px] text-[#191919]" />
    </>
  );

  return (
    <AppLayout title="消息" headerRight={headerRight}>
      {/* Search Bar */}
      <div className="px-3 py-2 bg-[#EDEDED]">
        <div 
          className="h-[32px] bg-white rounded-md flex items-center px-3 cursor-pointer"
          onClick={() => {}}
        >
          <Search className="h-4 w-4 text-[#B2B2B2] mr-2" />
          <span className="text-[14px] text-[#B2B2B2]">搜索</span>
        </div>
      </div>

      {/* Conversation List */}
      <div className="bg-white">
        {conversations.map((chat, idx) => (
          <div 
            key={chat.id}
            onClick={() => chat.isProject ? navigate(`/project/${chat.id}`) : navigate(`/chat/${chat.id}`)}
            className={cn(
              "flex items-center px-4 py-3 active:bg-[#ECECEC] transition-colors cursor-pointer",
              idx !== conversations.length - 1 && "border-b border-[#F0F0F0]"
            )}
          >
            {/* Avatar */}
            <div className={cn(
              "h-[48px] w-[48px] rounded-md flex items-center justify-center text-[18px] font-medium flex-shrink-0",
              chat.isProject ? "bg-[#FA9D3B] text-white" : 
              chat.isGroup ? "bg-[#07C160] text-white" :
              "bg-[#C4C4C4] text-white"
            )}>
              {chat.avatar.length <= 2 ? chat.avatar : <span>{chat.avatar}</span>}
            </div>

            {/* Content */}
            <div className="ml-3 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-[16px] text-[#191919] font-normal truncate">{chat.name}</h3>
                <span className="text-[12px] text-[#B2B2B2] flex-shrink-0 ml-2">{chat.time}</span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <p className="text-[14px] text-[#B2B2B2] truncate">{chat.lastMsg}</p>
                {chat.unread > 0 && (
                  <span className="wechat-badge ml-2 flex-shrink-0">{chat.unread}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
};

export default Dashboard;