"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/dashboard');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: "注册成功",
          description: "请查收验证邮件",
        });
      }
    } catch (error: any) {
      toast({
        title: "错误",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto">
      {/* Logo */}
      <div className="pt-20 pb-10 text-center">
        <div className="h-20 w-20 bg-[#07C160] rounded-2xl flex items-center justify-center mx-auto">
          <span className="text-white text-[32px] font-bold">C</span>
        </div>
        <h1 className="text-[24px] font-medium text-[#191919] mt-6">ContractorPro</h1>
        <p className="text-[14px] text-[#B2B2B2] mt-2">装修承包商的智能助手</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-8 space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="邮箱"
            className="w-full h-[50px] border-b border-[#E5E5E5] text-[16px] focus:outline-none focus:border-[#07C160] placeholder:text-[#B2B2B2]"
            required
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="密码"
            className="w-full h-[50px] border-b border-[#E5E5E5] text-[16px] focus:outline-none focus:border-[#07C160] placeholder:text-[#B2B2B2]"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-[50px] bg-[#07C160] text-white rounded-lg text-[17px] font-medium mt-8 active:bg-[#06AE56] disabled:opacity-50"
        >
          {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
        </button>
      </form>

      {/* Switch */}
      <div className="text-center mt-6">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-[#576B95] text-[14px]"
        >
          {isLogin ? '没有账号？立即注册' : '已有账号？立即登录'}
        </button>
      </div>

      {/* Footer */}
      <div className="mt-auto pb-8 text-center">
        <p className="text-[12px] text-[#B2B2B2]">
          登录即表示同意 <span className="text-[#576B95]">服务条款</span> 和 <span className="text-[#576B95]">隐私政策</span>
        </p>
      </div>
    </div>
  );
};

export default Login;