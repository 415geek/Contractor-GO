"use client";

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  ArrowUpRight,
  MoreHorizontal
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const stats = [
  { name: '进行中项目', value: '12', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
  { name: '本月收入', value: '¥45,200', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { name: '已完成', value: '28', icon: CheckCircle2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { name: '待报价', value: '5', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
];

const recentJobs = [
  { id: '1', client: '张伟', service: '厨房管道维修', date: '今天 14:30', status: '进行中', amount: '¥1,200' },
  { id: '2', client: '李娜', service: '全屋电路检查', date: '明天 09:00', status: '待处理', amount: '¥800' },
  { id: '3', client: '王强', service: '空调安装', date: '2023-10-25', status: '已完成', amount: '¥3,500' },
  { id: '4', client: '赵敏', service: '浴室翻新', date: '2023-10-24', status: '进行中', amount: '¥12,000' },
];

const Index = () => {
  return (
    <AppLayout>
      <div className="flex flex-col space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">早安, 杰克</h1>
            <p className="text-slate-500">这是您今天的业务概览。</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 shadow-lg shadow-indigo-100">
            <Plus className="mr-2 h-4 w-4" /> 新建项目
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.name} className="border-none shadow-sm hover:shadow-md transition-shadow duration-200 rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={cn("p-3 rounded-xl", stat.bg)}>
                    <stat.icon className={cn("h-6 w-6", stat.color)} />
                  </div>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none">
                    +12% <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Badge>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Jobs Table */}
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 px-6 py-5">
            <CardTitle className="text-lg font-semibold text-slate-900">最近项目</CardTitle>
            <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
              查看全部
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">客户</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">服务内容</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">预约时间</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">金额</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">状态</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600 mr-3">
                            {job.client[0]}
                          </div>
                          <span className="font-medium text-slate-900">{job.client}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{job.service}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{job.date}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">{job.amount}</td>
                      <td className="px-6 py-4">
                        <Badge 
                          className={cn(
                            "rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider border-none",
                            job.status === '进行中' ? "bg-blue-100 text-blue-700" : 
                            job.status === '待处理' ? "bg-amber-100 text-amber-700" : 
                            "bg-emerald-100 text-emerald-700"
                          )}
                        >
                          {job.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4 text-slate-400" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Index;