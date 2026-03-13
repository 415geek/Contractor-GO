"use client";

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Plus, Briefcase, MessageSquare, ChevronRight, 
  TrendingUp, DollarSign, Clock, CheckCircle, FileText,
  Camera, Calculator, ArrowUpRight, Bell, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';

// 模拟数据
const stats = [
  {
    id: 'active',
    label: '进行中项目',
    value: '3',
    change: '+2 新增',
    changeType: 'positive',
    icon: Briefcase,
    gradient: 'stat-card-blue',
  },
  {
    id: 'revenue',
    label: '本月收入',
    value: '$12,450',
    change: '+15%',
    changeType: 'positive',
    icon: DollarSign,
    gradient: 'stat-card-green',
  },
  {
    id: 'pending',
    label: '待收款',
    value: '$3,200',
    change: '2张发票',
    changeType: 'neutral',
    icon: Clock,
    gradient: 'stat-card-orange',
  },
  {
    id: 'completed',
    label: '已完成',
    value: '12',
    change: '本月',
    changeType: 'neutral',
    icon: CheckCircle,
    gradient: 'stat-card-gray',
  },
];

const quickActions = [
  { id: 'new_project', label: '新项目', icon: Briefcase, route: '/projects/new', color: 'bg-blue-500' },
  { id: 'new_message', label: '发消息', icon: MessageSquare, route: '/messages/new', color: 'bg-green-500' },
  { id: 'invoice', label: '发票', icon: FileText, route: '/accounting', color: 'bg-orange-500' },
  { id: 'compare', label: '比价', icon: Camera, route: '/material-search', color: 'bg-purple-500' },
];

const activeProjects = [
  { 
    id: '1', 
    name: 'Johnson 厨房翻新', 
    client: 'John Smith',
    progress: 80,
    estimatedDays: 3,
    status: '进行中',
  },
  { 
    id: '2', 
    name: 'Flushing 浴室改造', 
    client: 'Maria Garcia',
    progress: 35,
    estimatedDays: 7,
    status: '进行中',
  },
  { 
    id: '3', 
    name: 'Queens 屋顶维修', 
    client: 'Mike Wilson',
    progress: 60,
    estimatedDays: 5,
    status: '进行中',
  },
];

const recentMessages = [
  { 
    id: '1', 
    name: 'John Smith', 
    avatar: 'JS',
    lastMsg: '翻译: 价格可以，我们开始吧', 
    originalMsg: 'Price is good, let\'s start',
    time: '10:30 AM', 
    unread: 2,
    languageFrom: '🇺🇸',
    languageTo: '🇨🇳',
  },
  { 
    id: '2', 
    name: 'Maria Garcia', 
    avatar: 'MG',
    lastMsg: '翻译: 请发一份详细报价', 
    originalMsg: 'Envíame un presupuesto detallado',
    time: '昨天', 
    unread: 0,
    languageFrom: '🇪🇸',
    languageTo: '🇨🇳',
  },
  { 
    id: '3', 
    name: 'Mike Wilson', 
    avatar: 'MW',
    lastMsg: '预算已经超支了，我们需要谈谈', 
    time: '昨天', 
    unread: 0,
    languageFrom: '🇺🇸',
    languageTo: '🇨🇳',
  },
];

const pendingInvoices = [
  {
    id: 'INV-2024-0042',
    amount: '$2,500',
    client: 'Smith浴室改造',
    sentDays: 7,
    status: '待付款',
  },
  {
    id: 'INV-2024-0043',
    amount: '$1,800',
    client: 'Garcia厨房翻新',
    sentDays: 3,
    status: '待付款',
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '早上好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  const headerRight = (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="hidden md:flex">
        <Search className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary">
          3
        </Badge>
      </Button>
      <Button variant="ghost" size="icon" className="hidden md:flex">
        <Settings className="h-5 w-5" />
      </Button>
    </div>
  );

  return (
    <AppLayout title="首页" headerRight={headerRight}>
      <div className="p-4 md:p-6 space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm md:text-base">{getGreeting()}，</p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {user?.user_metadata?.display_name || '张师傅'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              今天是个好日子，继续加油！
            </p>
          </div>
          <Avatar className="h-12 w-12 md:h-14 md:w-14">
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {(user?.user_metadata?.display_name || '张')[0]}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Data Overview Cards - Horizontal Scroll on Mobile */}
        <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:overflow-visible">
          {stats.map((stat) => (
            <Card 
              key={stat.id} 
              className={`${stat.gradient} text-white min-w-[160px] md:min-w-0 flex-shrink-0 card-hover`}
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-white/80 text-xs md:text-sm mb-1">{stat.label}</p>
                    <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                    <div className="flex items-center mt-2 text-xs md:text-sm">
                      {stat.changeType === 'positive' && (
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                      )}
                      <span className="text-white/90">{stat.change}</span>
                    </div>
                  </div>
                  <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3 md:gap-4">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              className="flex flex-col items-center justify-center h-24 md:h-28 gap-2 border-2 hover:border-primary transition-colors button-press"
              onClick={() => navigate(action.route)}
            >
              <div className={`h-10 w-10 ${action.color} rounded-lg flex items-center justify-center`}>
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs md:text-sm font-medium">{action.label}</span>
            </Button>
          ))}
        </div>

        {/* Recent Messages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base md:text-lg font-semibold">最近消息</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary hover:text-primary/80"
              onClick={() => navigate('/messages')}
            >
              查看全部
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className="flex items-center p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/chat/${msg.id}`)}
                >
                  <Avatar className="h-10 w-10 md:h-12 md:w-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {msg.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold text-sm md:text-base truncate">{msg.name}</h3>
                      <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{msg.time}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs">{msg.languageFrom}</span>
                      <span className="text-xs text-muted-foreground">→</span>
                      <span className="text-xs">{msg.languageTo}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {msg.lastMsg}
                    </p>
                  </div>
                  {msg.unread > 0 && (
                    <Badge className="ml-2 bg-primary text-primary-foreground flex-shrink-0">
                      {msg.unread}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base md:text-lg font-semibold">进行中的项目</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary hover:text-primary/80"
              onClick={() => navigate('/projects')}
            >
              查看全部
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="flex items-center p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <div className="h-10 w-10 md:h-12 md:w-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold text-sm md:text-base truncate">{project.name}</h3>
                      <Badge variant="outline" className="flex-shrink-0 ml-2 text-xs">
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{project.client}</p>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">进度</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2 progress-animated" />
                      <p className="text-xs text-muted-foreground mt-1">
                        预计完成: {project.estimatedDays}天后
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground ml-2 flex-shrink-0" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Invoices */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base md:text-lg font-semibold">待处理发票</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary hover:text-primary/80"
              onClick={() => navigate('/accounting')}
            >
              查看全部
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingInvoices.map((invoice) => (
                <div 
                  key={invoice.id} 
                  className="flex items-center justify-between p-3 rounded-lg border hover:border-primary/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-sm">{invoice.id}</span>
                      <span className="text-lg font-bold text-primary ml-2">{invoice.amount}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {invoice.client} · 已发送{invoice.sentDays}天
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="flex-shrink-0 ml-2">
                    发送提醒
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Dashboard;