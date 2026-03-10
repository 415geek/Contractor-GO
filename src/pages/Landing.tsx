"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  MessageSquare, 
  Calculator, 
  Briefcase, 
  Users, 
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Globe,
  Shield,
  Zap,
  Star
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Camera,
    title: '材料拍照比价',
    description: 'AI 智能识别建材，实时比较多家供应商价格，帮您找到最优惠的采购渠道。',
    color: 'bg-orange-500',
  },
  {
    icon: MessageSquare,
    title: '智能翻译沟通',
    description: '中英文实时翻译，与客户无障碍沟通，AI 理解行业术语，精准传达意图。',
    color: 'bg-blue-500',
  },
  {
    icon: Calculator,
    title: '房屋造价估算',
    description: '拍摄房屋照片，AI 自动识别建筑模块，结合市场价格快速生成造价预估。',
    color: 'bg-indigo-500',
  },
  {
    icon: Briefcase,
    title: '项目全流程管理',
    description: '从报价到完工，一站式管理所有项目，AI 自动生成施工计划。',
    color: 'bg-emerald-500',
  },
  {
    icon: Users,
    title: '客户关系管理',
    description: '记录客户信息、沟通历史、项目档案，建立长期合作关系。',
    color: 'bg-purple-500',
  },
  {
    icon: Globe,
    title: '同行交流社区',
    description: '项目展示圈、同行交流群，分享经验、拓展人脉、获取商机。',
    color: 'bg-pink-500',
  },
];

const benefits = [
  { icon: Zap, text: '节省 50% 材料采购时间' },
  { icon: Shield, text: '避免语言沟通误解' },
  { icon: Star, text: '提升客户满意度' },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-9 w-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">ContractorPro</span>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={() => navigate('/login')} className="text-slate-600">
              登录
            </Button>
            <Button onClick={() => navigate('/login')} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl">
              免费试用
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              AI 驱动的装修承包商工具
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-6">
              让装修生意
              <span className="text-indigo-600">更简单</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
              专为美国华人装修承包商打造的一站式管理工具。
              <br className="hidden md:block" />
              AI 材料比价、智能翻译、项目管理，助您提升效率、降低成本。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/login')}
                className="bg-indigo-600 hover:bg-indigo-700 rounded-xl h-14 px-8 text-lg font-bold shadow-lg shadow-indigo-200"
              >
                立即开始使用 <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="rounded-xl h-14 px-8 text-lg border-slate-200"
              >
                观看演示视频
              </Button>
            </div>
          </div>

          {/* App Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none"></div>
            <div className="bg-slate-900 rounded-3xl p-2 md:p-4 shadow-2xl max-w-4xl mx-auto">
              <div className="bg-slate-800 rounded-2xl overflow-hidden">
                <div className="flex items-center space-x-2 px-4 py-3 border-b border-slate-700">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="ml-4 text-slate-400 text-sm">contractorpro.maxwelllai.com</span>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200" 
                  alt="App Preview" 
                  className="w-full aspect-video object-cover opacity-80"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="py-8 bg-indigo-600">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center text-white">
                <benefit.icon className="h-5 w-5 mr-2" />
                <span className="font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              强大功能，为您而生
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              从材料采购到项目交付，ContractorPro 覆盖装修承包商的全部工作场景
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Card 
                key={idx} 
                className="border-none shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center text-white mb-4", feature.color)}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Highlight Section */}
      <section className="py-24 px-4 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-indigo-500/20 text-indigo-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4 mr-2" />
                AI 核心功能
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                拍照即可比价
                <br />
                <span className="text-indigo-400">省时省钱</span>
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                只需拍摄材料照片，AI 自动识别品牌、型号、规格，
                实时搜索 Home Depot、Lowe's 等多家供应商价格，
                帮您找到最优惠的采购渠道。
              </p>
              <ul className="space-y-4">
                {[
                  '支持识别 1000+ 种建材',
                  '实时比较多家供应商价格',
                  '一键跳转购买页面',
                  '识别不准？手动修正再搜索',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-indigo-400 mr-3 flex-shrink-0" />
                    <span className="text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="bg-slate-800 rounded-3xl p-6 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=600" 
                  alt="Material Search Demo" 
                  className="rounded-2xl w-full"
                />
                <div className="absolute -bottom-4 -right-4 bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg">
                  <span className="font-bold">节省 30%+ 采购成本</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12">
            用户怎么说
          </h2>
          <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="flex justify-center mb-6">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="h-6 w-6 text-amber-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl md:text-2xl text-slate-700 leading-relaxed mb-8">
                "以前买材料要跑好几家店比价，现在拍个照就知道哪里最便宜。
                跟老外客户沟通也不用担心了，AI 翻译比我自己说的还专业！"
              </blockquote>
              <div className="flex items-center justify-center">
                <div className="h-12 w-12 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600 mr-4">
                  王
                </div>
                <div className="text-left">
                  <div className="font-bold text-slate-900">老王</div>
                  <div className="text-sm text-slate-500">纽约专业装修 · 12年从业经验</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-indigo-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            准备好提升您的装修生意了吗？
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            免费注册，立即体验 AI 驱动的装修管理工具
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/login')}
            className="bg-white text-indigo-600 hover:bg-indigo-50 rounded-xl h-14 px-8 text-lg font-bold shadow-lg"
          >
            免费开始使用 <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-slate-900 text-slate-400">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">ContractorPro</span>
            </div>
            <div className="text-sm">
              © 2024 ContractorPro. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;