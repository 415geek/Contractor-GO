"use client";

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { 
  Camera, 
  Scan, 
  Search, 
  Image as ImageIcon, 
  ChevronRight,
  Store,
  Calculator,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Discover = () => {
  const navigate = useNavigate();

  const menuGroups = [
    {
      items: [
        { id: 'moments', name: '项目展示圈', icon: ImageIcon, color: 'bg-blue-500', path: '/moments' },
      ]
    },
    {
      items: [
        { id: 'price-compare', name: '材料拍照比价', icon: Camera, color: 'bg-orange-500', path: '/material-search', subtitle: 'Nova Act AI 实时搜索' },
        { id: 'cost-estimate', name: '房屋造价估算', icon: Scan, color: 'bg-indigo-500', path: '/cost-estimate', subtitle: '视觉模块化估价' },
      ]
    },
    {
      items: [
        { id: 'nearby-stores', name: '附近建材城', icon: Store, color: 'bg-green-500', path: '/nearby' },
        { id: 'contractor-network', name: '同行交流群', icon: Users, color: 'bg-yellow-500', path: '/network' },
      ]
    }
  ];

  return (
    <AppLayout title="发现">
      <div className="space-y-4 py-4">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="bg-white border-y border-slate-200 divide-y divide-slate-100">
            {group.items.map((item) => (
              <div 
                key={item.id}
                onClick={() => navigate(item.path)}
                className="flex items-center px-4 py-3 active:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className={cn("h-8 w-8 rounded-md flex items-center justify-center text-white", item.color)}>
                  <item.icon className="h-5 w-5" />
                </div>
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

import { cn } from "@/lib/utils";
export default Discover;