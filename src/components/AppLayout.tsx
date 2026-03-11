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
    <div className="min-h-screen bg-background flex flex-col mx-auto relative md:shadow-2xl md:max-w-md">
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
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        {children}
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="h-16 bg-card border-t flex justify-around items-center fixed bottom-0 left-0 right-0 z-50 md:hidden">
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

      {/* Sidebar Navigation - Desktop Only */}
      <aside className="hidden md:flex md:w-64 md:fixed md:left-0 md:top-0 md:h-screen md:bg-card md:border-r md:flex-col md:pt-20">
        <div className="flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href === '/dashboard' && location.pathname === '/');
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-3 mx-2 my-1 rounded-lg transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Main Content Wrapper for Desktop */}
      <div className="hidden md:block md:ml-64 md:min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;