"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MessageSquare, 
  Users, 
  Compass, 
  User
} from 'lucide-react';
import { cn } from "@/lib/utils";

const navItems = [
  { name: '消息', href: '/dashboard', icon: MessageSquare },
  { name: '通讯录', href: '/clients', icon: Users },
  { name: '发现', href: '/discover', icon: Compass },
  { name: '我', href: '/profile', icon: User },
];

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  showHeader?: boolean;
  headerRight?: React.ReactNode;
}

const AppLayout = ({ children, title, showHeader = true, headerRight }: AppLayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#EDEDED] flex flex-col max-w-md mx-auto relative">
      {/* Header - WeChat Style */}
      {showHeader && (
        <header className="h-[44px] bg-[#EDEDED] flex items-center justify-between px-4 sticky top-0 z-50">
          <h1 className="text-[17px] font-semibold text-[#191919]">{title || '微信'}</h1>
          {headerRight && (
            <div className="flex items-center space-x-5">
              {headerRight}
            </div>
          )}
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-[50px]">
        {children}
      </main>

      {/* Bottom Navigation - WeChat Style */}
      <nav className="h-[50px] bg-[#F7F7F7] border-t border-[#E5E5E5] flex justify-around items-center fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 safe-area-bottom">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href === '/dashboard' && location.pathname === '/');
          return (
            <Link
              key={item.name}
              to={item.href}
              className="flex flex-col items-center justify-center w-full h-full"
            >
              <item.icon 
                className={cn(
                  "h-[24px] w-[24px] mb-0.5",
                  isActive ? "text-[#07C160]" : "text-[#191919]"
                )} 
                strokeWidth={isActive ? 2 : 1.5}
              />
              <span className={cn(
                "text-[10px]",
                isActive ? "text-[#07C160]" : "text-[#191919]"
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AppLayout;