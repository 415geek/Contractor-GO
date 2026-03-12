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
      <div className="md:flex md:min-h-screen">
        {/* Profile Sidebar - Desktop Only */}
        <div className="hidden md:block md:w-80 md:bg-muted md:p-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-xl bg-[#07C160] flex items-center justify-center overflow-hidden">
                <span className="text-white text-2xl font-bold">王</span>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-medium text-foreground">老王</h2>
                <p className="text-sm text-muted-foreground">Builder+ ID: Pro_Wang_NY</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">128</div>
                <div className="text-xs text-muted-foreground">完工项目</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-foreground flex items-center justify-center">
                  4.9 <Star className="h-3 w-3 text-amber-500 fill-amber-500 ml-1" />
                </div>
                <div className="text-xs text-muted-foreground">客户评分</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">12年</div>
                <div className="text-xs text-muted-foreground">从业经验</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6">
          {/* Mobile Profile Header */}
          <div className="bg-white rounded-lg p-4 md:hidden">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-xl bg-[#07C160] flex items-center justify-center overflow-hidden">
                <span className="text-white text-xl font-bold">王</span>
              </div>
              <div className="ml-3 flex-1">
                <h2 className="text-base font-medium text-foreground">老王</h2>
                <p className="text-xs text-muted-foreground">Builder+ ID: Pro_Wang_NY</p>
              </div>
              <div className="flex items-center space-x-2">
                <QrCode className="h-5 w-5 text-muted-foreground" />
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            {/* Mobile Stats */}
            <div className="flex items-center mt-4 pt-4 border-t">
              <div className="flex-1 text-center">
                <div className="text-base font-medium text-foreground">128</div>
                <div className="text-xs text-muted-foreground">完工项目</div>
              </div>
              <div className="w-px h-6 bg-border"></div>
              <div className="flex-1 text-center">
                <div className="text-base font-medium text-foreground flex items-center justify-center">
                  4.9 <Star className="h-3 w-3 text-amber-500 fill-amber-500 ml-1" />
                </div>
                <div className="text-xs text-muted-foreground">客户评分</div>
              </div>
              <div className="w-px h-6 bg-border"></div>
              <div className="flex-1 text-center">
                <div className="text-base font-medium text-foreground">12年</div>
                <div className="text-xs text-muted-foreground">从业经验</div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-4 mt-4">
            {menuGroups.map((group, gIdx) => (
              <div key={gIdx} className="bg-white rounded-lg shadow-sm border">
                {group.items.map((item, idx) => (
                  <div 
                    key={item.id}
                    onClick={() => item.path && navigate(item.path)}
                    className={cn(
                      "flex items-center px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors",
                      idx !== group.items.length - 1 && "border-b"
                    )}
                  >
                    <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", item.color)}>
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="ml-3 flex-1 text-sm font-medium text-foreground">{item.name}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            ))}

            {/* Logout */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div 
                onClick={handleLogout}
                className="flex items-center justify-center py-3 hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <span className="text-sm font-medium text-destructive">退出登录</span>
              </div>
            </div>
          </div>

          {/* Desktop Additional Info */}
          <div className="hidden md:grid md:grid-cols-2 md:gap-6 mt-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
              <h3 className="font-semibold text-blue-600 mb-2">账户状态</h3>
              <p className="text-lg font-bold">专业版</p>
              <p className="text-sm text-blue-600/70">有效期至 2024-12-31</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
              <h3 className="font-semibold text-green-600 mb-2">存储空间</h3>
              <p className="text-lg font-bold">2.3GB/5GB</p>
              <p className="text-sm text-green-600/70">46% 已使用</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;