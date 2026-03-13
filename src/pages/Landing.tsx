"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  MessageSquare, 
  Calculator, 
  Briefcase, 
  CheckCircle2,
  ArrowRight,
  Globe,
  Shield,
  Zap,
  Smartphone,
  Sparkles,
  Users,
  TrendingUp,
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Globe,
    title: '智能翻译沟通',
    description: 'AI 实时翻译，支持中英西等多语言，与客户无障碍沟通',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    icon: Camera,
    title: '材料拍照比价',
    description: 'AI 智能识别建材，实时比较多家供应商价格，节省采购成本',
    gradient: 'from-green-500 to-green-600',
  },
  {
    icon: Calculator,
    title: '房屋造价估算',
    description: '拍摄房屋照片，AI 快速生成专业造价预估，提升报价效率',
    gradient: 'from-purple-500 to-purple-600',
  },
  {
    icon: Briefcase,
    title: '项目全流程管理',
    description: '从报价到完工，一站式管理所有项目，进度一目了然',
    gradient: 'from-orange-500 to-orange-600',
  },
];

const benefits = [
  {
    icon: Smartphone,
    title: '虚拟号码',
    description: '保护隐私，客户短信自动翻译',
  },
  {
    icon: Shield,
    title: '安全可靠',
    description: '数据加密，保护客户信息',
  },
  {
    icon: Zap,
    title: '高效便捷',
    description: '工地友好设计，单手操作',
  },
];

const stats = [
  { value: '10,000+', label: '活跃承包商' },
  { value: '50,000+', label: '完成项目' },
  { value: '98%', label: '客户满意度' },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* Hero Section */}
      <div className="pt-12 pb-8 px-6 text-center bg-gradient-to-b from-primary/5 to-background">
        <div className="mb-6">
          <div className="h-16 w-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <Briefcase className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          ContractorLink
        </h1>
        <p className="text-lg text-muted-foreground mb-2">
          跨越语言，连接信任
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
          专为非英语母语承包商打造的智能通讯与业务管理平台
        </p>
      </div>

      {/* Stats */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <p className="text-xl md:text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="px-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">核心功能</h2>
        </div>
        
        {features.map((feature, idx) => (
          <Card key={idx} className="border-2 hover:border-primary/50 transition-all card-hover">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br",
                  feature.gradient
                )}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Benefits */}
      <div className="px-6 mt-8">
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <CardContent className="p-6">
            <h3 className="font-semibold text-base mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              为什么选择 ContractorLink？
            </h3>
            <div className="space-y-4">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Testimonial */}
      <div className="px-6 mt-8">
        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-foreground italic mb-2">
                  "ContractorLink 帮我解决了语言沟通的最大难题，现在我可以轻松与各种客户交流，生意越来越好！"
                </p>
                <p className="text-xs text-muted-foreground">— 张师傅，旧金山装修承包商</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <div className="px-6 mt-auto pb-8 pt-8 space-y-3">
        <Button
          onClick={() => navigate('/login')}
          className="w-full h-14 text-base font-semibold bg-contractor-gradient hover:opacity-90 transition-opacity"
          size="lg"
        >
          立即开始使用
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <Button
          onClick={() => navigate('/login')}
          variant="outline"
          className="w-full h-14 text-base font-semibold"
          size="lg"
        >
          已有账号？登录
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center pb-6">
        <p className="text-xs text-muted-foreground">
          © 2024 ContractorLink. All rights reserved.
        </p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#" className="text-xs text-muted-foreground hover:text-primary">隐私政策</a>
          <a href="#" className="text-xs text-muted-foreground hover:text-primary">服务条款</a>
          <a href="#" className="text-xs text-muted-foreground hover:text-primary">联系我们</a>
        </div>
      </div>
    </div>
  );
};

export default Landing;