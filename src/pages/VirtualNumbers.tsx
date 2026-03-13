"use client";

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useNavigate } from 'react-router-dom';
import { 
  Smartphone, Plus, ArrowRight, CheckCircle, AlertCircle,
  MessageSquare, CreditCard, ChevronRight, Info, Settings,
  Shield, Globe, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { numberPlans, popularAreaCodes } from '@/lib/design-system';

// 模拟数据
const myNumbers = [
  {
    id: '1',
    phoneNumber: '(415) 555-0123',
    status: 'active',
    planType: 'professional',
    monthlyCost: 15,
    messagesThisMonth: 127,
    nextBillingDate: '2024-04-15',
    autoRenew: true,
  },
];

const VirtualNumbers = () => {
  const navigate = useNavigate();
  const [showPurchaseFlow, setShowPurchaseFlow] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('professional');

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
        {/* My Numbers Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">我的号码</h2>
          
          {myNumbers.length === 0 ? (
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
                          <h3 className="text-xl font-bold">{number.phoneNumber}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusBadge(number.status)}
                            <Badge variant="outline">{getPlanName(number.planType)}</Badge>
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
                        <p className="text-lg font-semibold">{number.messagesThisMonth} 条</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">下次续费</p>
                        <p className="text-lg font-semibold">{number.nextBillingDate}</p>
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
                  <div className="grid grid-cols-3 gap-2">
                    {popularAreaCodes.map((area) => (
                      <Button
                        key={area.code}
                        variant="outline"
                        className="h-16 flex flex-col items-center justify-center"
                      >
                        <span className="text-lg font-bold">{area.code}</span>
                        <span className="text-xs text-muted-foreground">{area.city}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Step 2: Select Plan */}
                <div>
                  <h3 className="font-semibold mb-3">选择套餐</h3>
                  <div className="space-y-3">
                    {numberPlans.map((plan) => (
                      <Card
                        key={plan.id}
                        className={`cursor-pointer transition-all ${
                          selectedPlan === plan.id
                            ? 'border-primary border-2 bg-primary/5'
                            : 'border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold">{plan.name}</h4>
                                {plan.recommended && (
                                  <Badge className="bg-primary text-primary-foreground text-xs">
                                    推荐
                                  </Badge>
                                )}
                              </div>
                              <p className="text-2xl font-bold text-primary mb-2">
                                ${plan.price}<span className="text-sm font-normal text-muted-foreground">/月</span>
                              </p>
                              <ul className="space-y-1">
                                {plan.features.map((feature, idx) => (
                                  <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {selectedPlan === plan.id && (
                              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 ml-2" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Summary */}
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">月费</span>
                    <span className="font-semibold">
                      ${numberPlans.find(p => p.id === selectedPlan)?.price}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">首次付款</span>
                    <span className="font-bold text-lg">
                      ${numberPlans.find(p => p.id === selectedPlan)?.price}
                    </span>
                  </div>
                </div>

                <Button 
                  className="w-full h-12 text-base"
                  onClick={() => {
                    // TODO: Implement purchase flow
                    alert('购买功能即将上线');
                  }}
                >
                  确认购买
                  <ArrowRight className="h-4 w-4 ml-2" />
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