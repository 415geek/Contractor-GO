"use client";

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, ChevronRight, Scan, Users, Tag } from 'lucide-react';
import { cn } from "@/lib/utils";

const quickActions = [
  { id: 'new-client', name: '新的客户', icon: UserPlus, color: 'bg-[#FA9D3B]' },
  { id: 'groups', name: '项目群聊', icon: Users, color: 'bg-[#07C160]' },
  { id: 'tags', name: '标签', icon: Tag, color: 'bg-[#576B95]' },
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
    <UserPlus className="h-[22px] w-[22px] text-[#191919]" />
  );

  return (
    <AppLayout title="通讯录" headerRight={headerRight}>
      {/* Search Bar */}
      <div className="px-3 py-2 bg-[#EDEDED]">
        <div className="h-[32px] bg-white rounded-md flex items-center px-3">
          <Search className="h-4 w-4 text-[#B2B2B2] mr-2" />
          <span className="text-[14px] text-[#B2B2B2]">搜索</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white mb-2">
        {quickActions.map((action, idx) => (
          <div 
            key={action.id}
            className={cn(
              "flex items-center px-4 py-3 active:bg-[#ECECEC] cursor-pointer",
              idx !== quickActions.length - 1 && "border-b border-[#F0F0F0]"
            )}
          >
            <div className={cn("h-[40px] w-[40px] rounded-md flex items-center justify-center", action.color)}>
              <action.icon className="h-5 w-5 text-white" />
            </div>
            <span className="ml-3 text-[16px] text-[#191919]">{action.name}</span>
          </div>
        ))}
      </div>

      {/* Clients List */}
      {sortedLetters.map((letter) => (
        <div key={letter}>
          <div className="px-4 py-1.5 bg-[#EDEDED]">
            <span className="text-[13px] text-[#888888]">{letter}</span>
          </div>
          <div className="bg-white">
            {groupedClients[letter].map((client, idx) => (
              <div 
                key={client.id}
                onClick={() => navigate(`/client/${client.id}`)}
                className={cn(
                  "flex items-center px-4 py-3 active:bg-[#ECECEC] cursor-pointer",
                  idx !== groupedClients[letter].length - 1 && "border-b border-[#F0F0F0] ml-[56px]"
                )}
              >
                <div className="h-[40px] w-[40px] rounded-md bg-[#C4C4C4] flex items-center justify-center text-white font-medium">
                  {client.name[0]}
                </div>
                <div className="ml-3 flex-1">
                  <span className="text-[16px] text-[#191919]">{client.name}</span>
                  {client.projects > 0 && (
                    <span className="text-[12px] text-[#B2B2B2] ml-2">{client.projects}个项目</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Letter Index - Right Side */}
      <div className="fixed right-1 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-0.5 z-40">
        {sortedLetters.map((letter) => (
          <span key={letter} className="text-[10px] text-[#07C160] font-medium px-1">
            {letter}
          </span>
        ))}
      </div>
    </AppLayout>
  );
};

export default Clients;