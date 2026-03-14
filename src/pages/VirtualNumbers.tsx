"use client";

import React, { useEffect, useMemo, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useNavigate } from 'react-router-dom';
import {
  Smartphone, Plus, CheckCircle, AlertCircle,
  MessageSquare, CreditCard, ChevronRight, Info, Settings,
  Shield, Globe, Zap, Loader2, Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { numberPlans, popularAreaCodes } from '@/lib/design-system';
import { numbersAPI } from '@/lib/api';
import { useUser, useAuth } from '@clerk/clerk-react';

const VirtualNumbers = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();

  const [showPurchaseFlow, setShowPurchaseFlow] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('professional');
  const [myNumbers, setMyNumbers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState('');

  const [areaCode, setAreaCode] = useState('415');
  const [availableNumbers, setAvailableNumbers] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedDid, setSelectedDid] = useState<string | null>(null);

  const planTypeForPurchase = useMemo(() => {
    if (selectedPlan === 'basic') return 'BASIC' as const;
    // Map professional -> PRO (business not exposed in current UI)
    return 'PRO' as const;
  }, [selectedPlan]);

  // Load virtual numbers
  useEffect(() => {
    loadNumbers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadNumbers = async () => {
    try {
      setLoading(true);
      setError('');

      const token = await getToken();
      if (!token) {
        setMyNumbers([]);
        return;
      }

      const result = await numbersAPI.list(token);
      setMyNumbers(result.data?.virtual_numbers || []);
    } catch (err: any) {
      console.error('Failed to load numbers:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchNumbers = async () => {
    try {
      setSearching(true);
      setError('');
      setAvailableNumbers([]);
      setSelectedDid(null);

      const token = await getToken();
      if (!token) {
        setError('请先登录');
        return;
      }

      const res = await numbersAPI.search({ areaCode }, token);
      setAvailableNumbers(res.data?.numbers || []);
    } catch (err: any) {
      setError(err.message || '搜索失败，请稍后重试');
    } finally {
      setSearching(false);
    }
  };

  const handlePurchase = async () => {
    try {
      if (!selectedDid) {
        setError('请选择一个号码');
        return;
      }

      setPurchasing(true);
      setError('');

      const token = await getToken();
      if (!token) {
        setError('请先登录');
        return;
      }

      const email = user?.primaryEmailAddress?.emailAddress;

      await numbersAPI.purchase(
        {
          did: selectedDid,
          planType: planTypeForPurchase,
          email: email || undefined,
        },
        token,
      );

      setShowPurchaseFlow(false);
      setAvailableNumbers([]);
      setSelectedDid(null);
      await loadNumbers();
    } catch (err: any) {
      setError(err.message || '购买失败，请稍后重试');
    } finally {
      setPurchasing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 text-white"><CheckCircle className="h-3 w-3 mr-1" />活跃</Badge>;
      case 'suspended':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />暂停</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPlanName = (planType: string) => {
    const plan = numberPlans.find(p => p.id === planType);
    return plan?.name || planType;
  };

  return (
    <AppLayout title="虚拟号码">
      <div className="p-4 md:p-6 space-y-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* My Numbers Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">我的号码</h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : myNumbers.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="p-8 text-center">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">还没有虚拟号码</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  购买虚拟号码，保护隐私，自动翻译客户短信
                </p>
                <Button onClick={() => setShowPurchaseFlow(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  购买号码
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {myNumbers.map((number) => (
                <Card key={number.id} className="border-2 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center">
                          <Smartphone className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{number.phone_number}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusBadge(number.status)}
                            <Badge variant="outline">{getPlanName(number.plan_type)}</Badge>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Settings className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">本月消息</p>
                        <p className="text-lg font-semibold">
                          {(number.messages_sent_this_month || 0) + (number.messages_received_this_month || 0)} 条
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">下次续费</p>
                        <p className="text-lg font-semibold">{number.next_billing_date || '—'}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate('/messages')}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        查看消息
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        管理订阅
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Purchase New Number Card */}
        <Card
          className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20 cursor-pointer hover:border-primary/40 transition-colors"
          onClick={() => setShowPurchaseFlow(true)}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">购买新号码</h3>
                  <p className="text-sm text-muted-foreground">从 $5/月起</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              为什么需要虚拟号码？
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">保护隐私</h4>
                  <p className="text-sm text-muted-foreground">不暴露真实手机号，分离工作与生活</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">自动翻译</h4>
                  <p className="text-sm text-muted-foreground">客户短信自动翻译成你的语言</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">专业形象</h4>
                  <p className="text-sm text-muted-foreground">建立专业品牌，提升客户信任</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Purchase Flow Modal */}
        {showPurchaseFlow && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
            <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>购买虚拟号码</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPurchaseFlow(false)}
                >
                  ✕
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Select Area Code */}
                <div>
                  <h3 className="font-semibold mb-3">选择区号</h3>
                  <div className="flex flex-wrap gap-2">
                    {popularAreaCodes.map((code) => (
                      <Button
                        key={code.code}
                        variant={areaCode === code.code ? 'default' : 'outline'}
                        size="sm"
                        className="rounded-full"
                        onClick={() => setAreaCode(code.code)}
                      >
                        {code.code} · {code.city}
                      </Button>
                    ))}
                  </div>

                  <div className="mt-4">
                    <Button className="w-full" onClick={searchNumbers} disabled={searching}>
                      {searching ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          搜索中...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          搜索可用号码
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Step 2: Pick a number */}
                <div>
                  <h3 className="font-semibold mb-3">选择号码</h3>
                  {availableNumbers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">点击上方"搜索可用号码"获取列表</p>
                  ) : (
                    <div className="grid gap-2">
                      {availableNumbers.map((n) => (
                        <button
                          key={n.did}
                          className={
                            selectedDid === n.did
                              ? 'w-full text-left rounded-xl border-2 border-primary bg-primary/5 p-3'
                              : 'w-full text-left rounded-xl border p-3 hover:bg-muted/40'
                          }
                          onClick={() => setSelectedDid(n.did)}
                          type="button"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-foreground">{n.did}</div>
                              <div className="text-xs text-muted-foreground">
                                {n.ratecenter || n.city || '—'} · {n.province || n.state || 'US'}
                              </div>
                            </div>
                            <Badge variant="outline">SMS</Badge>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Step 3: Plan */}
                <div>
                  <h3 className="font-semibold mb-3">选择套餐</h3>
                  <div className="grid gap-3">
                    {numberPlans.map((plan) => (
                      <button
                        key={plan.id}
                        type="button"
                        className={
                          selectedPlan === plan.id
                            ? 'rounded-2xl border-2 border-primary bg-primary/5 p-4 text-left'
                            : 'rounded-2xl border p-4 text-left hover:bg-muted/40'
                        }
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">{plan.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {(plan.features || []).slice(0, 2).join(" · ")}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">{plan.price}</div>
                            <div className="text-xs text-muted-foreground">/月</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <Button className="w-full h-12" onClick={handlePurchase} disabled={purchasing || !selectedDid}>
                  {purchasing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      购买中...
                    </>
                  ) : (
                    '确认购买'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default VirtualNumbers;