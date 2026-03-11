"use client";

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Briefcase, MessageSquare, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

const activeProjects = [
  { 
    id: '2', 
    name: 'Flushing 厨房翻新', 
    client: 'John Smith',
    progress: 35,
  },
  { 
    id: '5', 
    name: 'Queens 屋顶维修', 
    client: 'Mike Wilson',
    progress: 80,
  },
];

const recentMessages = [
    { 
    id: '1', 
    name: 'John Smith', 
    avatar: 'JS',
    lastMsg: '好的，明天早上9点见。', 
    time: '14:30', 
  },
  { 
    id: '3', 
    name: 'Mike Wilson', 
    avatar: 'MW',
    lastMsg: '预算已经超支了，我们需要谈谈。', 
    time: '昨天', 
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const headerRight = (
    <>
      <Button variant="ghost" size="icon" className="hidden md:flex">
        <Search className="h-5 w-5" />
      </Button>
      <Button size="sm" onClick={() => navigate('/projects/new')} className="hidden md:flex">
        <Plus className="h-4 w-4 mr-2" />
        新项目
      </Button>
    </>
  );

  return (
    <AppLayout title="仪表盘" headerRight={headerRight}>
      <div className="p-4 md:p-6 space-y-6">
        {/* Welcome Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div>
            <p className="text-muted-foreground">早上好,</p>
            <h2 className="text-2xl font-bold text-foreground">老王</h2>
          </div>
          <div className="hidden md:flex md:space-x-2 md:mt-0 mt-4">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              搜索
            </Button>
            <Button size="sm" onClick={() => navigate('/projects/new')}>
              <Plus className="h-4 w-4 mr-2" />
              新项目
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">进行中项目</p>
              <p className="text-2xl font-bold">3</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">待处理消息</p>
              <p className="text-2xl font-bold">2</p>
            </CardContent>
          </Card>
          <Card className="hidden md:block">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">本月收入</p>
              <p className="text-2xl font-bold">$12.5K</p>
            </CardContent>
          </Card>
          <Card className="hidden md:block">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">客户评分</p>
              <p className="text-2xl font-bold">4.9</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">进行中项目</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary" onClick={() => navigate('/projects')}>
              查看全部
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeProjects.map((project) => (
                <div key={project.id} className="flex items-center cursor-pointer" onClick={() => navigate(`/project/${project.id}`)}>
                  <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{project.name}</p>
                    <p className="text-sm text-muted-foreground">{project.client}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">最近消息</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary" onClick={() => navigate('/messages')}>
              查看全部
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="flex items-center cursor-pointer" onClick={() => navigate(`/chat/${msg.id}`)}>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{msg.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-sm">{msg.name}</p>
                      <p className="text-xs text-muted-foreground">{msg.time}</p>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{msg.lastMsg}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Desktop Sections */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">项目进度</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Flushing 厨房翻新</span>
                  <span className="text-sm font-semibold">35%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{width: '35%'}}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">待办事项</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
                  <span>联系材料供应商</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="h-2 w-2 bg-amber-500 rounded-full mr-2"></div>
                  <span>确认客户付款</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;