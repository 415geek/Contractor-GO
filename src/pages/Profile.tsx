"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { 
  Settings, 
  Wallet, 
  Bookmark, 
  ChevronRight,
  Star,
  QrCode,
  CreditCard,
  FileText,
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const menuGroups = [
    {
      items: [
        { id: 'wallet', name: '钱包', icon: Wallet, color: 'bg-[#3E82F7]', path: '/accounting' },
      ]
    },
    {
      items: [
        { id: 'favorites', name: '收藏', icon: Bookmark, color: 'bg-[#FA9D3B]' },
        { id: 'files', name: '我的项目', icon: FileText, color: 'bg-[#07C160]', path: '/projects' },
        { id: 'cards', name: '卡包', icon: CreditCard, color: 'bg-[#3E82F7]' },
      ]
    },
    {
      items: [
        { id: 'settings', name: '设置', icon: Settings, color: 'bg-[#3E82F7]', path: '/settings' },
      ]
    }
  ];

  return (
    <AppLayout title="" showHeader={false}>
      {/* Profile Header */}
      <div className="bg-white px-4 pt-12 pb-5">
        <div className="flex items-center">
          {/* Builder+ styled avatar */}
          <div className="h-[64px] w-[64px] rounded-xl bg-[#07C160] flex items-center justify-center overflow-hidden">
            <svg 
              viewBox="0 0 100 80" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10"
            >
              <rect x="5" y="25" width="25" height="35" rx="5" stroke="white" strokeWidth="4" fill="none"/>
              <rect x="10" y="30" width="15" height="25" rx="3" stroke="white" strokeWidth="2" fill="none"/>
              <rect x="30" y="35" width="60" height="12" fill="white"/>
              <path d="M90 47 L85 60 L80 47 L75 60 L70 47 L65 60 L60 47 L55 60 L50 47 L45 60 L40 47 L35 60 L30 47" fill="white"/>
            </svg>
          </div>
          <div className="ml-4 flex-1">
            <h2 className="text-[18px] font-medium text-[#191919]">老王</h2>
            <p className="text-[14px] text-[#B2B2B2] mt-0.5">Builder+ ID: Pro_Wang_NY</p>
          </div>
          <div className="flex items-center space-x-4">
            <QrCode className="h-5 w-5 text-[#B2B2B2]" />
            <ChevronRight className="h-5 w-5 text-[#C4C4C4]" />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center mt-5 pt-4 border-t border-[#F0F0F0]">
          <div className="flex-1 text-center">
            <div className="text-[18px] font-medium text-[#191919]">128</div>
            <div className="text-[12px] text-[#B2B2B2] mt-0.5">完工项目</div>
          </div>
          <div className="w-px h-8 bg-[#F0F0F0]"></div>
          <div className="flex-1 text-center">
            <div className="text-[18px] font-medium text-[#191919] flex items-center justify-center">
              4.9 <Star className="h-3 w-3 text-[#FA9D3B] fill-[#FA9D3B] ml-1" />
            </div>
            <div className="text-[12px] text-[#B2B2B2] mt-0.5">客户评分</div>
          </div>
          <div className="w-px h-8 bg-[#F0F0F0]"></div>
          <div className="flex-1 text-center">
            <div className="text-[18px] font-medium text-[#191919]">12年</div>
            <div className="text-[12px] text-[#B2B2B2] mt-0.5">从业经验</div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-2 pt-2">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="bg-white">
            {group.items.map((item, idx) => (
              <div 
                key={item.id}
                onClick={() => item.path && navigate(item.path)}
                className={cn(
                  "flex items-center px-4 py-3 active:bg-[#ECECEC] transition-colors cursor-pointer",
                  idx !== group.items.length - 1 && "border-b border-[#F0F0F0] ml-[52px]"
                )}
              >
                <div className={cn("h-[40px] w-[40px] rounded-lg flex items-center justify-center", item.color)}>
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <span className="ml-3 flex-1 text-[16px] text-[#191919]">{item.name}</span>
                <ChevronRight className="h-5 w-5 text-[#C4C4C4]" />
              </div>
            ))}
          </div>
        ))}

        {/* Logout */}
        <div className="bg-white mt-2">
          <div 
            onClick={handleLogout}
            className="flex items-center justify-center py-3 active:bg-[#ECECEC] cursor-pointer"
          >
            <span className="text-[16px] text-[#FA5151]">退出登录</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;