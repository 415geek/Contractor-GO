"use client";

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Briefcase, User, AlertCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

      await login({
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        password: formData.password,
      });

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || '登录失败，请检查您的凭据');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-4">
            <Briefcase className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">ContractorLink</h1>
          <p className="text-muted-foreground mt-2">跨越语言，连接信任</p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader>
            <CardTitle>登录</CardTitle>
            <CardDescription>使用您的手机号或邮箱登录</CardDescription>
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
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full h-12 bg-contractor-gradient hover:opacity-90 transition-opacity"
                disabled={loading}
              >
                {loading ? '登录中...' : '登录'}
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">还没有账号？</span>
                <Link to="/register" className="text-primary hover:underline ml-1">
                  立即注册
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Role Selection */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Link to="/register?role=contractor">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <Briefcase className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm">我是承包商</h3>
                <p className="text-xs text-muted-foreground mt-1">管理项目、发送账单</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/register?role=client">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <User className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm">我是客户</h3>
                <p className="text-xs text-muted-foreground mt-1">寻找承包商、跟踪进度</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;