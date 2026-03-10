"use client";

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowUpCircle, 
  CalendarCheck2, 
  MessageSquare, 
  PlusCircle, 
  Users, 
  Wrench,
  Camera,
  Calculator
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const quickActions = [
  { name: '新项目', icon: PlusCircle, path: '/projects' },
  { name: '新客户', icon: Users, path: '/clients' },
  { name: '记一笔', icon: ArrowUpCircle, path: '/accounting' },
  { name: '拍照比价', icon: Camera, path: '/material-search' },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <AppLayout title="今日概览">
      <div className="p-4 space-y-6">
        {/* Welcome Card */}
        <Card className="border-none shadow-sm rounded-2xl bg-indigo-600 text-white overflow-hidden">
          <CardContent className="p-5 relative">
            <div className="absolute -right-4 -top-4 h-24 w-24 bg-white/10 rounded-full"></div>
            <h2 className="text-2xl font-bold">早上好, 老王!</h2>
            <p className="text-sm opacity-80 mt-1">今天有 2 个任务待处理。</p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3 text-center">
          {quickActions.map(action => (
            <div key={action.name} onClick={() => navigate(action.path)} className="cursor-pointer active:scale-95 transition-transform">
              <div className="bg-white rounded-2xl h-16 flex items-center justify-center shadow-sm border border-slate-100">
                <action.icon className="h-7 w-7 text-indigo-600" />
              </div>
              <p className="text-[11px] font-medium text-slate-600 mt-2">{action.name}</p>
            </div>
          ))}
        </div>

        {/* Today's Agenda */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 px-1">今日日程</h3>
          <Card className="border-none shadow-sm rounded-2xl">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <Wrench className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900">水电管路重新布局</p>
                  <p className="text-xs text-slate-400">Flushing 厨房翻新</p>
                </div>
                <Badge variant="outline" className="ml-auto border-blue-200 text-blue-600">进行中</Badge>
              </div>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                  <CalendarCheck2 className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900">与客户确认屋顶材料</p>
                  <p className="text-xs text-slate-400">Queens 屋顶维修</p>
                </div>
                <Badge variant="outline" className="ml-auto border-amber-200 text-amber-600">待开始</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Messages */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 px-1">未读消息</h3>
          <Card className="border-none shadow-sm rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center" onClick={() => navigate('/chat/1')}>
                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 mr-3">JS</div>
                <div>
                  <p className="font-bold text-sm text-slate-900">John Smith (客户)</p>
                  <p className="text-xs text-slate-500 truncate">AI翻译: 好的，明天早上9点见。</p>
                </div>
                <Badge className="ml-auto bg-red-500 text-white border-none h-5 w-5 flex items-center justify-center p-0">2</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;