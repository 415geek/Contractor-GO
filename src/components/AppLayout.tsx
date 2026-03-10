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
  X,
  Bell,
  Search
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { name: '仪表盘', href: '/', icon: LayoutDashboard },
  { name: '项目管理', href: '/jobs', icon: Briefcase },
  { name: '客户管理', href: '/clients', icon: Users },
  { name: '日程安排', href: '/schedule', icon: Calendar },
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
    <div className="min-h-screen bg-slate-50 flex">
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

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
          <div className="flex items-center md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6 text-slate-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-6">
                <div className="flex items-center mb-10">
                  <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Briefcase className="text-white h-5 w-5" />
                  </div>
                  <span className="ml-2 text-lg font-bold">ProContract</span>
                </div>
                <NavLinks onClick={() => setIsMobileMenuOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="搜索项目、客户..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
            </Button>
            <div className="h-9 w-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-semibold text-sm">
              JD
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;