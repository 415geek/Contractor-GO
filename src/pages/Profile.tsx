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
  LogOut,
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { useAuth, useUser } from '@clerk/clerk-react';

const Profile = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { user } = useUser();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const displayName = user?.fullName || user?.firstName || user?.primaryEmailAddress?.emailAddress || '用户';
  const initial = (displayName || '用')[0];

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
                <span className="text-white text-2xl font-bold">{initial}</span>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-medium text-foreground">{displayName}</h2>
                <p className="text-sm text-muted-foreground">Clerk ID: {user?.id?.slice(0, 8) || '—'}</p>
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

            <div className="mt-6">
              <Button variant="outline" className="w-full rounded-xl" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                退出登录
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6">
          {/* Mobile Profile Header */}
          <div className="bg-white rounded-lg p-4 md:hidden">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-xl bg-[#07C160] flex items-center justify-center overflow-hidden">
                <span className="text-white text-xl font-bold">{initial}</span>
              </div>
              <div className="ml-3 flex-1">
                <h2 className="text-base font-medium text-foreground">{displayName}</h2>
                <p className="text-xs text-muted-foreground">Clerk ID: {user?.id?.slice(0, 8) || '—'}</p>
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

            <div className="mt-4">
              <Button variant="outline" className="w-full rounded-xl" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                退出登录
              </Button>
            </div>
          </div>

          {/* Menu Groups */}
          <div className="space-y-4 mt-4 md:mt-0">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="bg-white rounded-lg overflow-hidden">
                {group.items.map((item, itemIndex) => (
                  <button
                    key={item.id}
                    className={cn(
                      "w-full flex items-center p-4 hover:bg-muted/30 transition-colors",
                      itemIndex !== group.items.length - 1 && "border-b"
                    )}
                    onClick={() => item.path && navigate(item.path)}
                  >
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", item.color)}>
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-3 flex-1 text-left">
                      <div className="text-sm font-medium text-foreground">{item.name}</div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;