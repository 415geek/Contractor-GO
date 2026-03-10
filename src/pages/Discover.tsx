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
      <div className="space-y-2 pt-2">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="bg-white">
            {group.items.map((item, idx) => (
              <div 
                key={item.id}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex items-center px-4 py-3 active:bg-[#ECECEC] transition-colors cursor-pointer",
                  idx !== group.items.length - 1 && "border-b border-[#F0F0F0] ml-[52px]"
                )}
              >
                <div className={cn("h-[40px] w-[40px] rounded-lg flex items-center justify-center", item.color)}>
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <div className="ml-3 flex-1">
                  <div className="text-[16px] text-[#191919]">{item.name}</div>
                  {item.subtitle && (
                    <div className="text-[12px] text-[#B2B2B2]">{item.subtitle}</div>
                  )}
                </div>
                <div className="flex items-center">
                  {item.badge && (
                    <span className="text-[12px] text-[#B2B2B2] mr-2">{item.badge}</span>
                  )}
                  <ChevronRight className="h-5 w-5 text-[#C4C4C4]" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </AppLayout>
  );
};

export default Discover;