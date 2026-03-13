"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Briefcase, User, AlertCircle, ArrowLeft } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useAuth();
  const [role, setRole] = useState<'contractor' | 'client'>('contractor');
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    display_name: '',
    primary_language: 'zh-CN',
    interface_language: 'zh-CN',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'contractor' || roleParam === 'client') {
      setRole(roleParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.phone && !formData.email) {
        setError('请输入手机号或邮箱');
        setLoading(false);
        return;
      }

      if (!formData.password) {
        setError('请输入密码');
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('两次输入的密码不一致');
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError('密码长度至少为6位');
        setLoading(false);
        return;
      }

      await register({
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        password: formData.password,
        role,
        display_name: formData.display_name || formData.phone || formData.email,
        primary_language: formData.primary_language,
        interface_language: formData.interface_language,
      });

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || '注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link to="/login">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回登录
          </Button>
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-4">
            {role === 'contractor' ? (
              <Briefcase className="h-8 w-8 text-white" />
            ) : (
              <User className="h-8 w-8 text-white" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-foreground">ContractorLink</h1>
          <p className="text-muted-foreground mt-2">
            {role === 'contractor' ? '承包商注册' : '客户注册'}
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card 
            className={`cursor-pointer transition-all ${
              role === 'contractor' 
                ? 'border-primary bg-primary/5' 
                : 'hover:border-primary/50'
            }`}
            onClick={() => setRole('contractor')}
          >
            <CardContent className="p-4 text-center">
              <Briefcase className={`h-8 w-8 mx-auto mb-2 ${
                role === 'contractor' ? 'text-primary' : 'text-muted-foreground'
              }`} />
              <h3 className="font-semibold text-sm">承包商</h3>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${
              role === 'client' 
                ? 'border-primary bg-primary/5' 
                : 'hover:border-primary/50'
            }`}
            onClick={() => setRole('client')}
          >
            <CardContent className="p-4 text-center">
              <User className={`h-8 w-8 mx-auto mb-2 ${
                role === 'client' ? 'text-primary' : 'text-muted-foreground'
              }`} />
              <h3 className="font-semibold text-sm">客户</h3>
            </CardContent>
          </Card>
        </div>

        {/* Register Card */}
        <Card>
          <CardHeader>
            <CardTitle>创建账号</CardTitle>
            <CardDescription>填写信息以开始使用</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="display_name">显示名称</Label>
                <Input
                  id="display_name"
                  type="text"
                  placeholder="您的名称"
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">手机号</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 415 555 0123"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="text-center text-sm text-muted-foreground">
                或
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="至少6位"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">确认密码</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="再次输入密码"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="primary_language">主要语言</Label>
                <select
                  id="primary_language"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={formData.primary_language}
                  onChange={(e) => setFormData({ ...formData, primary_language: e.target.value })}
                >
                  <option value="zh-CN">中文 (简体)</option>
                  <option value="en-US">English</option>
                  <option value="es-ES">Español</option>
                  <option value="fr-FR">Français</option>
                  <option value="de-DE">Deutsch</option>
                  <option value="ja-JP">日本語</option>
                  <option value="ko-KR">한국어</option>
                  <option value="pt-BR">Português</option>
                  <option value="ru-RU">Русский</option>
                  <option value="ar-SA">العربية</option>
                  <option value="hi-IN">हिन्दी</option>
                  <option value="vi-VN">Tiếng Việt</option>
                </select>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full h-12 bg-contractor-gradient hover:opacity-90 transition-opacity"
                disabled={loading}
              >
                {loading ? '注册中...' : '注册'}
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">已有账号？</span>
                <Link to="/login" className="text-primary hover:underline ml-1">
                  立即登录
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;