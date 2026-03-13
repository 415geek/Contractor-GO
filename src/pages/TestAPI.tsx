"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { register, login, logout, getCurrentUser } from '@/lib/supabaseAuth';

const TestAPI = () => {
  const [phone, setPhone] = useState('+14155550123');
  const [password, setPassword] = useState('password123');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const testRegister = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      console.log('[TestAPI] Testing registration...');
      const data = await register({
        phone,
        password,
        role: 'contractor',
        display_name: 'Test User',
      });
      console.log('[TestAPI] Success:', data);
      setResult(data);
    } catch (err: any) {
      console.error('[TestAPI] Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      console.log('[TestAPI] Testing login...');
      const data = await login({
        phone,
        password,
      });
      console.log('[TestAPI] Success:', data);
      setResult(data);
    } catch (err: any) {
      console.error('[TestAPI] Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testGetCurrentUser = () => {
    const user = getCurrentUser();
    setResult({ currentUser: user });
  };

  const testLogout = () => {
    logout();
    setResult({ message: 'Logged out successfully' });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>认证测试页面 (使用 Supabase 客户端)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">手机号</label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+14155550123"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">密码</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password123"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={testRegister} disabled={loading}>
              {loading ? '测试中...' : '测试注册'}
            </Button>
            <Button onClick={testLogin} disabled={loading} variant="outline">
              {loading ? '测试中...' : '测试登录'}
            </Button>
            <Button onClick={testGetCurrentUser} variant="outline">
              获取当前用户
            </Button>
            <Button onClick={testLogout} variant="destructive">
              登出
            </Button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium">错误:</p>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {result && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-medium">结果:</p>
              <pre className="text-green-600 text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestAPI;