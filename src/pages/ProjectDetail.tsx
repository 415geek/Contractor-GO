"use client";

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, MapPin, CheckCircle2, Clock, Sparkles, Plus, MoreHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [tasks, setTasks] = React.useState<any[]>([]);

  const generateTasks = () => {
    setIsGenerating(true);
    // 模拟 AI 生成施工计划
    setTimeout(() => {
      setTasks([
        { id: 1, title: '拆除旧橱柜与台面', status: 'completed', date: '10-20' },
        { id: 2, title: '水电管路重新布局', status: 'in-progress', date: '10-22' },
        { id: 3, title: '墙面找平与防水处理', status: 'pending', date: '10-25' },
        { id: 4, title: '安装新橱柜与吊柜', status: 'pending', date: '10-28' },
        { id: 5, title: '台面安装与水槽连接', status: 'pending', date: '11-01' },
      ]);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col max-w-md mx-auto shadow-2xl relative">
      {/* Header */}
      <header className="h-12 bg-white flex items-center px-2 sticky top-0 z-50 border-b border-slate-200">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-6 w-6 text-slate-700" />
        </Button>
        <h1 className="flex-1 text-center text-[17px] font-semibold text-slate-900 mr-8">项目详情</h1>
      </header>

      <div className="flex-1 p-4 space-y-6 pb-10">
        {/* Project Overview */}
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-slate-900">Flushing 厨房翻新</h2>
            <Badge className="bg-blue-100 text-blue-700 border-none">进行中</Badge>
          </div>
          <div className="flex items-center text-sm text-slate-500">
            <MapPin className="h-4 w-4 mr-1.5" /> 123 Main St, Flushing, NY
          </div>
        </div>

        {/* Progress Card */}
        <Card className="border-none shadow-sm rounded-2xl bg-indigo-600 text-white">
          <CardContent className="p-5">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-xs opacity-80">总体进度</p>
                <h3 className="text-2xl font-bold">35%</h3>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-80">预计完工</p>
                <p className="font-bold">2023-11-15</p>
              </div>
            </div>
            <Progress value={35} className="h-2 bg-white/20" />
          </CardContent>
        </Card>

        {/* AI Task Generator Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900">施工计划</h3>
            {tasks.length === 0 && !isGenerating && (
              <Button 
                onClick={generateTasks}
                size="sm" 
                className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-none shadow-none h-8 rounded-lg"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5" /> AI 生成计划
              </Button>
            )}
          </div>

          {isGenerating ? (
            <div className="bg-white rounded-2xl p-8 text-center space-y-4 border border-indigo-50">
              <div className="flex justify-center">
                <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-sm text-slate-500 animate-pulse">AI 正在根据项目类型规划最优工序...</p>
            </div>
          ) : tasks.length > 0 ? (
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
              {tasks.map((task, idx) => (
                <div key={task.id} className={cn(
                  "p-4 flex items-center justify-between",
                  idx !== tasks.length - 1 && "border-b border-slate-50"
                )}>
                  <div className="flex items-center">
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-3" />
                    ) : task.status === 'in-progress' ? (
                      <Clock className="h-5 w-5 text-blue-500 mr-3" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-slate-200 mr-3"></div>
                    )}
                    <div>
                      <p className={cn("text-sm font-medium", task.status === 'completed' ? "text-slate-400 line-through" : "text-slate-900")}>
                        {task.title}
                      </p>
                      <p className="text-[10px] text-slate-400">预计日期: {task.date}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-100 rounded-2xl p-8 text-center border-2 border-dashed border-slate-200">
              <p className="text-sm text-slate-400">暂无施工计划，点击上方按钮使用 AI 快速生成</p>
            </div>
          )}
        </div>

        {/* Photos Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900">现场照片</h3>
            <Button variant="ghost" size="sm" className="text-indigo-600 text-xs font-bold">
              上传 <Plus className="ml-1 h-3 w-3" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=200" className="rounded-xl aspect-square object-cover" alt="Site" />
            <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=200" className="rounded-xl aspect-square object-cover" alt="Site" />
            <div className="bg-slate-200 rounded-xl aspect-square flex items-center justify-center">
              <Plus className="h-6 w-6 text-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;