"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { 
  Settings, 
  Wallet, 
  Bookmark, 
  ShieldCheck, 
  ChevronRight,
  Star,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const Profile = () => {
  const navigate = useNavigate();

  const menuGroups = [
    {
      items: [
        { id: 'wallet', name: '支付与钱包', icon: Wallet, color: 'text-blue-500', path: '/accounting' },
        { id: 'favorites', name: '收藏夹', icon: Bookmark, color: 'text-orange-500' },
      ]
    },
    {
      items: [
        { id: 'verification', name: '资质认证', icon: ShieldCheck, color: 'text-green-500', subtitle: '已认证专业承包商' },
      ]
    },
    {
      items: [
        { id: 'settings', name: '设置', icon: Settings, color: 'text-slate-400' },
      ]
    }
  ];

  return (
    <AppLayout title="">
      <div className="bg-white pb-6">
        {/* User Info Header */}
        <div className="px-6 pt-8 pb-6 flex items-center">
          <Avatar className="h-16 w-16 rounded-lg border-2 border-slate-100">
            <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" />
            <AvatarFallback>我</AvatarFallback>
          </Avatar>
          <div className="ml-4 flex-1">
            <h2 className="text-xl font-bold text-slate-900">老王 (纽约专业装修)</h2>
            <p className="text-sm text-slate-500 mt-1">微信号: Pro_Wang_NY</p>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-300" />
        </div>

        {/* Professional Stats */}
        <div className="px-4">
          <div className="bg-slate-50 rounded-2xl p-4 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center text-amber-500 mb-1">
                <Star className="h-4 w-4 fill-current" />
                <span className="ml-1 text-sm font-bold">4.9</span>
              </div>
              <div className="text-[10px] text-slate-400">客户评分</div>
            </div>
            <div className="text-center border-x border-slate-200">
              <div className="flex items-center justify-center text-indigo-600 mb-1">
                <CheckCircle2 className="h-4 w-4" />
                <span className="ml-1 text-sm font-bold">128</span>
              </div>
              <div className="text-[10px] text-slate-400">完工项目</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center text-emerald-600 mb-1">
                <Clock className="h-4 w-4" />
                <span className="ml-1 text-sm font-bold">12年</span>
              </div>
              <div className="text-[10px] text-slate-400">从业经验</div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-3 py-3">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="bg-white border-y border-slate-200 divide-y divide-slate-100">
            {group.items.map((item) => (
              <div 
                key={item.id}
                onClick={() => item.path && navigate(item.path)}
                className="flex items-center px-4 py-3 active:bg-slate-100 transition-colors cursor-pointer"
              >
                <item.icon className={cn("h-6 w-6", item.color)} />
                <div className="ml-3 flex-1">
                  <div className="text-[16px] text-slate-900">{item.name}</div>
                  {item.subtitle && <div className="text-[11px] text-slate-400">{item.subtitle}</div>}
                </div>
                <ChevronRight className="h-5 w-5 text-slate-300" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </AppLayout>
  );
};

export default Profile;