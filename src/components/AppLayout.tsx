"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutGrid,
  MessageSquare, 
  Briefcase, 
  Compass, 
  User,
  Plus,
  Search
} from 'lucide-react';
import { cn } from "@/lib/utils";

const navItems = [
  { name: '首页', href: '/', icon: LayoutGrid },
  { name: '消息', href: '/messages', icon: MessageSquare },
  { name: '项目', href: '/projects', icon: Briefcase },
  { name: '发现', href: '/discover', icon: Compass },
  { name: '我', href: '/profile', icon: User },
];

const AppLayout = ({ children, title }: { children: React.ReactNode, title?: string }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#ededed] flex flex-col max-w-md mx-auto shadow-2xl relative overflow-hidden">
      {/* Header - WeChat Style */}
      <header className="h-12 bg-[#ededed] flex items-center justify-between px-4 sticky top-0 z-50 border-b border-slate-200/50">
        <h1 className="text-[17px] font-semibold text-slate-900">{title || 'ProConnect'}</h1>
        <div className="flex items-center space-x-4">
          <Search className="h-5 w-5 text-slate-700" />
          <Plus className="h-5 w-5 text-slate-700" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-16">
        {children}
      </main>

      {/* Bottom Navigation - WeChat Style */}
      <nav className="h-14 bg-[#f7f7f7] border-t border-slate-200 flex justify-around items-center fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-0.5 transition-colors w-full h-full",
                isActive ? "text-[#07c160]" : "text-slate-500"
              )}
            >
              <item.icon className={cn("h-6 w-6", isActive && item.name !== '首页' ? "fill-[#07c160]" : "")} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AppLayout;