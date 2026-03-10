"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, Heart, MessageCircle, Share2, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const moments = [
  {
    id: 1,
    user: '老王 (纽约专业装修)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    content: '今天完成了 Flushing 的厨房翻新项目。客户非常满意！',
    aiSummary: 'AI 总结: 采用现代简约风格，优化了动线布局，橱柜选用防潮环保材料，整体造价控制在预算内。',
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=400'
    ],
    time: '2小时前',
    likes: 12,
    comments: 3
  },
  {
    id: 2,
    user: '李工 (布鲁克林水电)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
    content: '全屋电路改造，安全第一。',
    aiSummary: 'AI 总结: 严格执行纽约市电工标准，更换了老旧线路，增加了智能家居控制模块。',
    images: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400'
    ],
    time: '昨天',
    likes: 8,
    comments: 1
  }
];

const Moments = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto shadow-2xl relative">
      {/* Header with Cover */}
      <div className="relative h-64">
        <img 
          src="https://images.unsplash.com/photo-1503387762-592dee58292b?auto=format&fit=crop&q=80&w=600" 
          className="w-full h-full object-cover"
          alt="Cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 left-4 text-white bg-black/20 backdrop-blur-md rounded-full"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="absolute -bottom-6 right-6 flex items-end">
          <span className="text-white font-bold text-lg mb-8 mr-4 drop-shadow-md">老王</span>
          <Avatar className="h-20 w-20 rounded-xl border-4 border-white shadow-lg">
            <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" />
            <AvatarFallback>我</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Moments List */}
      <div className="mt-12 px-4 space-y-10 pb-10">
        {moments.map((moment) => (
          <div key={moment.id} className="flex space-x-3">
            <Avatar className="h-10 w-10 rounded-md flex-shrink-0">
              <AvatarImage src={moment.avatar} />
              <AvatarFallback>{moment.user[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <div className="font-bold text-[#576b95] text-[15px]">{moment.user}</div>
              <p className="text-[15px] text-slate-900 leading-relaxed">{moment.content}</p>
              
              {/* AI Summary Box */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 relative overflow-hidden">
                <Sparkles className="absolute -right-2 -top-2 h-12 w-12 text-indigo-200/50 rotate-12" />
                <p className="text-[12px] text-indigo-700 font-medium leading-relaxed relative z-10">
                  {moment.aiSummary}
                </p>
              </div>

              {/* Images Grid */}
              <div className={cn(
                "grid gap-1",
                moment.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
              )}>
                {moment.images.map((img, idx) => (
                  <img 
                    key={idx} 
                    src={img} 
                    className="rounded-sm w-full aspect-square object-cover" 
                    alt="Project"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[12px] text-slate-400">{moment.time}</span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-slate-400">
                    <Heart className="h-4 w-4 mr-1" />
                    <span className="text-[11px]">{moment.likes}</span>
                  </div>
                  <div className="flex items-center text-slate-400">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    <span className="text-[11px]">{moment.comments}</span>
                  </div>
                  <Share2 className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <Button className="fixed bottom-20 right-6 h-14 w-14 rounded-full bg-indigo-600 shadow-xl">
        <Camera className="h-6 w-6" />
      </Button>
    </div>
  );
};

import { cn } from "@/lib/utils";
export default Moments;