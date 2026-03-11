"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutGrid,
  Users, 
  Compass, 
  User
} from 'lucide-react';
import { cn } from "@/lib/utils";

const navItems = [
  { name: '仪表盘', href: '/dashboard', icon: LayoutGrid },
  { name: '客户', href: '/clients', icon: Users },
  { name: '发现', href: '/discover', icon: Compass },
  { name: '我的', href: '/profile', icon: User },
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
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative shadow-2xl">
      {/* Header */}
      {showHeader && (
        <header className="h-14 bg-background flex items-center justify-between px-4 sticky top-0 z-50 border-b">
          <h1 className="text-lg font-bold text-foreground">{title || 'Builder+'}</h1>
          {headerRight && (
            <div className="flex items-center space-x-2">
              {headerRight}
            </div>
          )}
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-16">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="h-16 bg-card border-t flex justify-around items-center fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href === '/dashboard' && location.pathname === '/');
          return (
            <Link
              key={item.name}
              to={item.href}
              className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-primary transition-colors"
            >
              <item.icon 
                className={cn(
                  "h-6 w-6 mb-1",
                  isActive ? "text-primary" : ""
                )} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={cn(
                "text-xs font-medium",
                isActive ? "text-primary" : ""
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