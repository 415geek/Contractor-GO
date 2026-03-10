"use client";

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { Plus, Calendar, MapPin, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const projects = [
  { id: 1, name: 'Flushing 厨房翻新', client: 'John Smith', status: '进行中', date: '2023-10-20', address: '123 Main St, Flushing' },
  { id: 2, name: 'Queens 屋顶维修', client: 'Mike Wilson', status: '待开始', date: '2023-11-05', address: '456 Broadway, Queens' },
  { id: 3, name: 'Brooklyn 地板打蜡', client: 'Sarah Chen', status: '已完成', date: '2023-09-15', address: '789 Atlantic Ave, Brooklyn' },
];

const Projects = () => {
  return (
    <AppLayout title="项目管理">
      <div className="p-4 space-y-4">
        <Button className="w-full h-12 rounded-xl bg-indigo-600 shadow-md">
          <Plus className="mr-2 h-5 w-5" /> 新建项目
        </Button>

        <div className="space-y-3">
          {projects.map((project) => (
            <Card key={project.id} className="border-none shadow-sm rounded-2xl overflow-hidden active:scale-[0.98] transition-transform">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900">{project.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">客户: {project.client}</p>
                  </div>
                  <Badge className={cn(
                    "border-none rounded-full px-2 py-0.5 text-[10px]",
                    project.status === '进行中' ? "bg-blue-100 text-blue-700" : 
                    project.status === '待开始' ? "bg-amber-100 text-amber-700" : 
                    "bg-emerald-100 text-emerald-700"
                  )}>
                    {project.status}
                  </Badge>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center text-[11px] text-slate-500">
                    <MapPin className="h-3 w-3 mr-1.5" />
                    {project.address}
                  </div>
                  <div className="flex items-center text-[11px] text-slate-500">
                    <Calendar className="h-3 w-3 mr-1.5" />
                    创建日期: {project.date}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-50 flex justify-end">
                  <Button variant="ghost" size="sm" className="text-indigo-600 text-xs font-bold">
                    查看详情 <ChevronRight className="ml-1 h-3 w-3" />
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

export default Projects;