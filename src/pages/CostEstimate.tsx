"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Camera, 
  Upload, 
  Calculator, 
  CheckCircle2, 
  Sparkles,
  RefreshCw,
  X,
  Home,
  Layers,
  Loader2,
  Info,
  TrendingUp
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { toolsAPI } from '@/lib/api';
import { useToast } from "@/hooks/use-toast";
import AppLayout from '@/components/AppLayout';

const CostEstimate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<'capture' | 'analyzing' | 'result'>('capture');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [estimateResult, setEstimateResult] = useState<any>(null);
  const [quality, setQuality] = useState<'economy' | 'standard' | 'premium'>('standard');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEstimate = async () => {
    if (!image) return;

    try {
      setLoading(true);
      setError('');

      const result = await toolsAPI.houseEstimate({
        image,
        quality,
        property_type: 'residential',
      });

      setEstimateResult(result.result);
      setStep('result');
    } catch (err: any) {
      setError(err.message || '估价失败，请重试');
      toast({
        title: "估价失败",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetEstimate = () => {
    setImage(null);
    setEstimateResult(null);
    setError('');
    setStep('capture');
  };

  return (
    <AppLayout title="房屋估价">
      <div className="p-4 md:p-6 space-y-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step 1: Capture */}
        {step === 'capture' && (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center relative">
                  {!image ? (
                    <div className="text-center space-y-4">
                      <Home className="h-16 w-16 text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground">拍摄或上传房屋照片</p>
                    </div>
                  ) : (
                    <>
                      <img src={image} alt="House" className="w-full h-full object-cover" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
                        onClick={() => setImage(null)}
                      >
                        <X className="h-4 w-4 text-white" />
                      </Button>
                    </>
                  )}
                </div>

                <div className="flex justify-center gap-4 mt-4">
                  <label className="flex flex-col items-center cursor-pointer">
                    <div className="h-14 w-14 bg-primary rounded-full flex items-center justify-center">
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm mt-2">拍照</span>
                    <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageUpload} />
                  </label>
                  <label className="flex flex-col items-center cursor-pointer">
                    <div className="h-14 w-14 bg-primary rounded-full flex items-center justify-center">
                      <Upload className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm mt-2">相册</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>

                {image && (
                  <>
                    <div className="mt-4">
                      <label className="text-sm font-medium mb-2 block">装修档次</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: 'economy', label: '经济' },
                          { value: 'standard', label: '标准' },
                          { value: 'premium', label: '高端' },
                        ].map((option) => (
                          <Button
                            key={option.value}
                            variant={quality === option.value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setQuality(option.value as any)}
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Button
                      className="w-full h-12 mt-4"
                      onClick={handleEstimate}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          分析中...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          开始 AI 估价
                        </>
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium mb-1">AI 智能估价</p>
                    <p>
                      基于房屋照片自动识别建筑模块，结合美国当前市场价格提供专业估价。
                      估价结果仅供参考，实际费用可能因具体情况而异。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Analyzing */}
        {step === 'analyzing' && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="relative">
              <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center">
                <Home className="h-12 w-12 text-primary" />
              </div>
              <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-primary rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg font-semibold">AI 正在分析房屋结构...</p>
            <p className="text-sm text-muted-foreground">识别建筑模块并计算造价</p>
          </div>
        )}

        {/* Step 3: Result */}
        {step === 'result' && estimateResult && (
          <div className="space-y-4">
            {/* Total Estimate */}
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">预估总造价</p>
                    <p className="text-3xl font-bold text-primary">
                      ${estimateResult.renovation_estimate.total_min.toLocaleString()} - ${estimateResult.renovation_estimate.total_max.toLocaleString()}
                    </p>
                  </div>
                  <div className="h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Calculator className="h-7 w-7 text-primary" />
                  </div>
                </div>
                <div className="flex items-center text-xs bg-primary/10 w-fit px-3 py-1.5 rounded-full">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  置信度: {Math.round(estimateResult.confidence * 100)}%
                </div>
              </CardContent>
            </Card>

            {/* Property Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">房屋信息</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">类型</p>
                    <p className="font-semibold">{estimateResult.property_info.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">面积</p>
                    <p className="font-semibold">{estimateResult.property_info.square_footage} sqft</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">卧室</p>
                    <p className="font-semibold">{estimateResult.property_info.bedrooms}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">浴室</p>
                    <p className="font-semibold">{estimateResult.property_info.bathrooms}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Layers className="h-4 w-4 mr-2" />
                  费用明细
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {estimateResult.renovation_estimate.breakdown.map((item: any, idx: number) => (
                    <div key={idx} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">{item.category}</h4>
                        <p className="font-bold text-primary">
                          ${item.min.toLocaleString()} - ${item.max.toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-1">
                        {item.items.map((subItem: any, subIdx: number) => (
                          <div key={subIdx} className="flex justify-between text-sm text-muted-foreground">
                            <span>{subItem.name}</span>
                            <span>${subItem.cost.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">预计工期</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="font-semibold">{estimateResult.timeline.estimated_weeks} 周</span>
                </div>
                <div className="space-y-2">
                  {estimateResult.timeline.phases.map((phase: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-semibold text-primary">
                        {idx + 1}
                      </div>
                      <span>{phase.name}</span>
                      <span className="text-muted-foreground ml-auto">{phase.duration}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI 建议
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {estimateResult.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="flex items-start text-sm">
                      <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-primary" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                {estimateResult.disclaimer}
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={resetEstimate}>
                <RefreshCw className="h-4 w-4 mr-2" />
                重新估价
              </Button>
              <Button className="flex-1">
                保存到项目
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default CostEstimate;