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
} from 'lucide-react';
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Camera,
    title: '材料拍照比价',
    description: 'AI 智能识别建材，实时比较多家供应商价格',
  },
  {
    icon: MessageSquare,
    title: '智能翻译沟通',
    description: '中英文实时翻译，与客户无障碍沟通',
  },
  {
    icon: Calculator,
    title: '房屋造价估算',
    description: '拍摄房屋照片，AI 快速生成造价预估',
  },
  {
    icon: Briefcase,
    title: '项目全流程管理',
    description: '从报价到完工，一站式管理所有项目',
  },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto">
      {/* Hero */}
      <div className="pt-16 pb-12 px-6 text-center">
        <div className="h-20 w-20 bg-[#07C160] rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-[#07C160]/30">
          <span className="text-white text-[32px] font-bold">C</span>
        </div>
        <h1 className="text-[28px] font-bold text-[#191919] mt-6">ContractorPro</h1>
        <p className="text-[16px] text-[#888888] mt-3 leading-relaxed">
          专为美国华人装修承包商打造<br/>AI 驱动的一站式管理工具
        </p>
      </div>

      {/* Features */}
      <div className="px-6 space-y-4">
        {features.map((feature, idx) => (
          <div 
            key={idx}
            className="flex items-start p-4 bg-[#F7F7F7] rounded-xl"
          >
            <div className="h-10 w-10 bg-[#07C160] rounded-lg flex items-center justify-center flex-shrink-0">
              <feature.icon className="h-5 w-5 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-[16px] font-medium text-[#191919]">{feature.title}</h3>
              <p className="text-[14px] text-[#888888] mt-1">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Benefits */}
      <div className="px-6 mt-8">
        <div className="bg-[#E8F8EE] rounded-xl p-4">
          <h3 className="text-[14px] font-medium text-[#07C160] mb-3">为什么选择我们</h3>
          <div className="space-y-2">
            {[
              '节省 50% 材料采购时间',
              '避免语言沟通误解',
              '提升客户满意度',
            ].map((item, idx) => (
              <div key={idx} className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-[#07C160] mr-2" />
                <span className="text-[14px] text-[#191919]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 mt-auto pb-8 pt-8 space-y-3">
        <button
          onClick={() => navigate('/login')}
          className="w-full h-[50px] bg-[#07C160] text-white rounded-lg text-[17px] font-medium flex items-center justify-center active:bg-[#06AE56]"
        >
          立即开始使用 <ArrowRight className="ml-2 h-5 w-5" />
        </button>
        <button
          onClick={() => navigate('/login')}
          className="w-full h-[50px] bg-white text-[#07C160] border border-[#07C160] rounded-lg text-[17px] font-medium active:bg-[#E8F8EE]"
        >
          已有账号？登录
        </button>
      </div>

      {/* Footer */}
      <div className="text-center pb-6">
        <p className="text-[12px] text-[#B2B2B2]">© 2024 ContractorPro</p>
      </div>
    </div>
  );
};

export default Landing;