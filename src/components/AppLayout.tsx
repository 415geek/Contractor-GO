"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Calendar, 
  Settings, 
  Menu,
  Bell,
  Search,
  Plus
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { name: '仪表盘', href: '/', icon: LayoutDashboard },
  { name: '项目', href: '/jobs', icon: Briefcase },
  { name: '客户', href: '/clients', icon: Users },
  { name: '日程', href: '/schedule', icon: Calendar },
];

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const NavLinks = ({ className, onClick }: { className?: string, onClick?: () => void }) => (
    <nav className={cn("space-y-1", className)}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={onClick}
            className={cn(
              "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
              isActive 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
                : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
            )}
          >
            <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-white" : "text-slate-400")} />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 bg-white border-r border-slate-200 p-6">
        <div className="flex items-center mb-10 px-2">
          <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-indigo-200 shadow-lg">
            <Briefcase className="text-white h-6 w-6" />
          </div>
          <span className="ml-3 text-xl font-bold text-slate-900 tracking-tight">ProContract</span>
        </div>
        <NavLinks />
        <div className="mt-auto pt-6 border-t border-slate-100">
          <Link to="/settings" className="flex items-center px-4 py-3 text-sm font-medium text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
            <Settings className="mr-3 h-5 w-5 text-slate-400" />
            设置
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen pb-20 md:pb-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="flex items-center">
            <div className="md:hidden h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <Briefcase className="text-white h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-slate-900 md:hidden">ProContract</span>
            
            <div className="hidden md:block flex-1 max-w-md ml-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="搜索项目、客户..." 
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <Button variant="ghost" size="icon" className="relative text-slate-600">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
            </Button>
            <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-semibold text-xs md:text-sm">
              JD
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8 flex-1">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex flex-col items-center space-y-1 transition-colors",
                isActive ? "text-indigo-600" : "text-slate-400"
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
        <Button size="icon" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full h-12 w-12 -mt-10 shadow-lg shadow-indigo-200 border-4 border-white">
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default AppLayout;