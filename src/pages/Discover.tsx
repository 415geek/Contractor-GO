"use client";

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { 
  Camera, 
  Scan, 
  Image as ImageIcon, 
  ChevronRight,
  Store,
  Calculator,
  Users,
  Wallet,
  ShoppingBag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";

const Discover = () => {
  const navigate = useNavigate();

  const menuGroups = [
    {
      items: [
        { 
          id: 'moments', 
          name: '项目圈', 
          icon: ImageIcon, 
          color: 'bg-[#576B95]', 
          path: '/moments',
          badge: '3条新动态'
        },
      ]
    },
    {
      items: [
        { 
          id: 'scan', 
          name: '扫一扫', 
          subtitle: '材料识别比价',
          icon: Scan, 
          color: 'bg-[#3E82F7]', 
          path: '/material-search' 
        },
        { 
          id: 'cost-estimate', 
          name: '拍房估价', 
          subtitle: 'AI 智能估算',
          icon: Calculator, 
          color: 'bg-[#FA9D3B]', 
          path: '/cost-estimate' 
        },
      ]
    },
    {
      items: [
        { 
          id: 'shopping', 
          name: '材料商城', 
          icon: ShoppingBag, 
          color: 'bg-[#E75A5A]', 
          path: '/shopping' 
        },
        { 
          id: 'nearby', 
          name: '附近建材城', 
          icon: Store, 
          color: 'bg-[#07C160]', 
          path: '/nearby' 
        },
      ]
    },
    {
      items: [
        { 
          id: 'accounting', 
          name: '记账本', 
          icon: Wallet, 
          color: 'bg-[#F7C644]', 
          path: '/accounting' 
        },
        { 
          id: 'network', 
          name: '同行交流', 
          icon: Users, 
          color: 'bg-[#8B5CF6]', 
          path: '/network' 
        },
      ]
    }
  ];

  return (
    <AppLayout title="发现">
      <div className="p-4 md:p-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx} className="bg-white rounded-lg shadow-sm border">
              {group.items.map((item, idx) => (
                <div 
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex items-center px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors",
                    idx !== group.items.length - 1 && "border-b"
                  )}
                >
                  <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", item.color)}>
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="text-sm font-medium text-foreground">{item.name}</div>
                    {item.subtitle && (
                      <div className="text-xs text-muted-foreground">{item.subtitle}</div>
                    )}
                  </div>
                  <div className="flex items-center">
                    {item.badge && (
                      <span className="text-xs text-muted-foreground mr-2">{item.badge}</span>
                    )}
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Desktop Stats */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-6 mt-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
            <h3 className="font-semibold text-blue-600 mb-2">今日活动</h3>
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm text-blue-600/70">新动态</p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
            <h3 className="font-semibold text-green-600 mb-2">材料搜索</h3>
            <p className="text-2xl font-bold">8</p>
            <p className="text-sm text-green-600/70">今日搜索</p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
            <h3 className="font-semibold text-purple-600 mb-2">同行互动</h3>
            <p className="text-2xl font-bold">5</p>
            <p className="text-sm text-purple-600/70">新消息</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Discover;