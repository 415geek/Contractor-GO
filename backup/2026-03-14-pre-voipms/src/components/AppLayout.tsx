import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  Folder,
  Wrench,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { name: "首页", href: "/dashboard", icon: LayoutDashboard },
  { name: "消息", href: "/messages", icon: MessageSquare, badge: 2 },
  { name: "项目", href: "/projects", icon: Folder },
  { name: "工具", href: "/tools", icon: Wrench },
  { name: "我的", href: "/profile", icon: User },
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
    <div className="min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-72 md:flex-col md:border-r md:bg-white">
        <div className="px-6 pt-6 pb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary text-primary-foreground grid place-items-center font-bold">
              CL
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-slate-900">ContractorLink</div>
              <div className="text-xs text-slate-500">跨越语言，连接信任</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 pb-6">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || (item.href === "/dashboard" && location.pathname === "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                  {item.badge ? (
                    <Badge className={cn(
                      "absolute -top-1 -right-2 h-4 w-4 items-center justify-center p-0 text-[10px]",
                      isActive ? "bg-white text-primary" : "bg-primary text-primary-foreground"
                    )}>
                      {item.badge}
                    </Badge>
                  ) : null}
                </div>
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-6 pb-6">
          <div className="rounded-2xl border bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-900">提示</div>
            <div className="mt-1 text-xs leading-relaxed text-slate-600">
              桌面端支持多列布局与更大画布，功能与移动端一致。
            </div>
          </div>
        </div>
      </aside>

      {/* Content */}
      <div className="md:pl-72">
        {showHeader ? (
          <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
            <div className="mx-auto max-w-6xl px-4 md:px-8 h-14 md:h-16 flex items-center justify-between">
              <h1 className="text-base md:text-lg font-bold tracking-tight text-slate-900">
                {title || "ContractorLink"}
              </h1>
              {headerRight ? <div className="flex items-center gap-2">{headerRight}</div> : null}
            </div>
          </header>
        ) : null}

        <main className="pb-20 md:pb-10">
          <div className="mx-auto max-w-6xl px-4 md:px-8 py-5 md:py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom Navigation - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-white">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || (item.href === "/dashboard" && location.pathname === "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
                  isActive ? "text-primary" : "text-slate-500"
                )}
              >
                <div className="relative">
                  <Icon className={cn("h-6 w-6", isActive ? "text-primary" : "")} strokeWidth={isActive ? 2.5 : 2} />
                  {item.badge ? (
                    <Badge className="absolute -top-1 -right-2 h-4 w-4 items-center justify-center p-0 bg-primary text-primary-foreground text-[10px]">
                      {item.badge}
                    </Badge>
                  ) : null}
                </div>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;
