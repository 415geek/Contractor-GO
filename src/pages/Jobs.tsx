"use client";

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { Search, Filter, Plus, MapPin, Calendar, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const jobs = [
  { id: 'JOB-101', client: '张伟', service: '厨房管道维修', address: '朝阳区幸福大街12号', date: '2023-10-26', status: '进行中', priority: '高' },
  { id: 'JOB-102', client: '李娜', service: '全屋电路检查', address: '海淀区中关村南路5号', date: '2023-10-27', status: '待处理', priority: '中' },
  { id: 'JOB-103', client: '王强', service: '空调安装', address: '丰台区科技园路88号', date: '2023-10-25', status: '已完成', priority: '低' },
  { id: 'JOB-104', client: '赵敏', service: '浴室翻新', address: '西城区金融街2号', date: '2023-11-02', status: '进行中', priority: '高' },
  { id: 'JOB-105', client: '孙立', service: '地板打蜡', address: '东城区王府井大街1号', date: '2023-10-28', status: '待处理', priority: '低' },
];

const Jobs = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-900">项目管理</h1>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
            <Plus className="mr-2 h-4 w-4" /> 创建新项目
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="搜索项目编号、客户或地址..." className="pl-10 rounded-xl border-slate-200" />
          </div>
          <Button variant="outline" className="rounded-xl border-slate-200 text-slate-600">
            <Filter className="mr-2 h-4 w-4" /> 筛选
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="border-none shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{job.id}</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">{job.service}</h3>
                  </div>
                  <Badge 
                    className={cn(
                      "rounded-full px-3 py-1 text-[10px] font-bold uppercase border-none",
                      job.status === '进行中' ? "bg-blue-100 text-blue-700" : 
                      job.status === '待处理' ? "bg-amber-100 text-amber-700" : 
                      "bg-emerald-100 text-emerald-700"
                    )}
                  >
                    {job.status}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-slate-600">
                    <User className="h-4 w-4 mr-2 text-slate-400" />
                    <span className="font-medium text-slate-900 mr-2">{job.client}</span>
                    <span className="text-slate-400">|</span>
                    <Badge variant="secondary" className="ml-2 text-[10px] bg-slate-100 text-slate-500 border-none">
                      优先级: {job.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                    {job.address}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                    预约日期: {job.date}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-50 flex justify-end space-x-3">
                  <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">
                    查看详情
                  </Button>
                  <Button size="sm" className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-none shadow-none">
                    更新状态
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Jobs;