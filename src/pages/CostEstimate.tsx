"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, Info, Calculator, Search, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const houseModules = [
  { id: 'roof', name: '屋顶 (Roof)', top: '15%', left: '30%', width: '40%', height: '20%' },
  { id: 'wall', name: '外墙 (Exterior Wall)', top: '35%', left: '25%', width: '50%', height: '40%' },
  { id: 'window', name: '窗户 (Windows)', top: '45%', left: '35%', width: '10%', height: '15%' },
  { id: 'door', name: '大门 (Main Door)', top: '60%', left: '55%', width: '10%', height: '20%' },
];

const CostEstimate = () => {
  const navigate = useNavigate();
  const [step, setStep] = React.useState<'capture' | 'segment' | 'result'>('capture');
  const [selectedModule, setSelectedModule] = React.useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [estimateType, setEstimateType] = React.useState<'manual' | 'ai'>('ai');
  const [area, setArea] = React.useState('');
  const [finalEstimate, setFinalEstimate] = React.useState<any>(null);

  const handleCapture = () => {
    setStep('segment');
  };

  const handleModuleClick = (mod: any) => {
    setSelectedModule(mod);
    setIsDialogOpen(true);
  };

  const runEstimate = () => {
    setIsDialogOpen(false);
    setStep('result');
    // Simulate AI calculation based on Nova Act search
    setFinalEstimate({
      module: selectedModule.name,
      area: estimateType === 'ai' ? '约 1,200 sq ft' : `${area} sq ft`,
      materialPrice: '$4.50 - $6.20 / sq ft',
      laborPrice: '$3.00 - $4.50 / sq ft',
      totalRange: '$9,000 - $12,800',
      stores: ['Home Depot', 'Lowe\'s', 'ABC Supply Co.']
    });
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col max-w-md mx-auto shadow-2xl relative">
      {/* Header */}
      <header className="h-12 bg-white flex items-center px-2 sticky top-0 z-50 border-b border-slate-200">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-6 w-6 text-slate-700" />
        </Button>
        <h1 className="flex-1 text-center text-[17px] font-semibold text-slate-900 mr-8">房屋造价估算</h1>
      </header>

      <div className="flex-1 p-4">
        {step === 'capture' && (
          <div className="h-full flex flex-col items-center justify-center space-y-6">
            <div className="w-full aspect-[3/4] bg-slate-200 rounded-3xl border-4 border-dashed border-slate-300 flex flex-col items-center justify-center p-8 text-center">
              <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <Camera className="h-10 w-10 text-indigo-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">拍摄房屋全景</h2>
              <p className="text-sm text-slate-500 mt-2">
                请确保照片包含完整的房屋外观，AI 将自动识别建筑模块。
              </p>
            </div>
            <Button onClick={handleCapture} className="w-full h-14 rounded-2xl bg-indigo-600 text-lg font-bold">
              立即拍摄
            </Button>
          </div>
        )}

        {step === 'segment' && (
          <div className="space-y-6">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
              <img 
                src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=600" 
                alt="House" 
                className="w-full h-full object-cover"
              />
              {/* AI Segmentation Overlays */}
              <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
              {houseModules.map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => handleModuleClick(mod)}
                  className={cn(
                    "absolute border-2 border-white/50 rounded-lg transition-all duration-300 flex items-center justify-center group",
                    "bg-indigo-500/30 hover:bg-indigo-500/60 hover:border-white hover:scale-105"
                  )}
                  style={{ top: mod.top, left: mod.left, width: mod.width, height: mod.height }}
                >
                  <div className="bg-white/90 px-2 py-1 rounded text-[10px] font-bold text-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    {mod.name}
                  </div>
                </button>
              ))}
              
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/20">
                <p className="text-white text-xs flex items-center">
                  <Info className="h-3 w-3 mr-2 text-indigo-300" />
                  AI 已识别 4 个模块。点击指定区域进行估价。
                </p>
              </div>
            </div>
            <p className="text-center text-slate-400 text-xs">提示：点击蓝色高亮区域开始估算</p>
          </div>
        )}

        {step === 'result' && finalEstimate && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute -right-4 -top-4 h-24 w-24 bg-white/10 rounded-full blur-2xl"></div>
              <h2 className="text-sm font-medium opacity-80 uppercase tracking-wider">预估总价范围</h2>
              <div className="text-4xl font-black mt-1">{finalEstimate.totalRange}</div>
              <div className="mt-4 flex items-center text-xs bg-white/20 w-fit px-3 py-1 rounded-full">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                基于 Nova Act AI 实时市场价
              </div>
            </div>

            <Card className="border-none shadow-sm rounded-2xl">
              <CardContent className="p-5 space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                  <span className="text-slate-500 text-sm">估算模块</span>
                  <span className="font-bold text-slate-900">{finalEstimate.module}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                  <span className="text-slate-500 text-sm">预估面积</span>
                  <span className="font-bold text-slate-900">{finalEstimate.area}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                  <span className="text-slate-500 text-sm">材料单价</span>
                  <span className="font-bold text-indigo-600">{finalEstimate.materialPrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm">人工单价 (建议)</span>
                  <span className="font-bold text-slate-900">{finalEstimate.laborPrice}</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 px-1">推荐采购渠道</h3>
              <div className="grid grid-cols-3 gap-2">
                {finalEstimate.stores.map((store: string) => (
                  <div key={store} className="bg-white p-3 rounded-xl text-center shadow-sm border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-800 truncate">{store}</div>
                    <div className="text-[8px] text-indigo-500 mt-1">有现货</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1 h-12 rounded-xl border-slate-200" onClick={() => setStep('segment')}>
                重新选择
              </Button>
              <Button className="flex-1 h-12 rounded-xl bg-indigo-600">
                保存到项目
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Estimate Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[90%] rounded-3xl">
          <DialogHeader>
            <DialogTitle>估算 {selectedModule?.name}</DialogTitle>
            <DialogDescription>
              请选择估算方式，AI 将结合当前地理位置的材料价格进行计算。
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-3 py-4">
            <button 
              onClick={() => setEstimateType('ai')}
              className={cn(
                "p-4 rounded-2xl border-2 text-left transition-all",
                estimateType === 'ai' ? "border-indigo-600 bg-indigo-50" : "border-slate-100 bg-slate-50"
              )}
            >
              <Calculator className={cn("h-6 w-6 mb-2", estimateType === 'ai' ? "text-indigo-600" : "text-slate-400")} />
              <div className="font-bold text-sm">AI 自动估算</div>
              <div className="text-[10px] text-slate-500 mt-1">基于照片透视识别面积</div>
            </button>
            <button 
              onClick={() => setEstimateType('manual')}
              className={cn(
                "p-4 rounded-2xl border-2 text-left transition-all",
                estimateType === 'manual' ? "border-indigo-600 bg-indigo-50" : "border-slate-100 bg-slate-50"
              )}
            >
              <Search className={cn("h-6 w-6 mb-2", estimateType === 'manual' ? "text-indigo-600" : "text-slate-400")} />
              <div className="font-bold text-sm">手动输入</div>
              <div className="text-[10px] text-slate-500 mt-1">输入精确的施工面积</div>
            </button>
          </div>

          {estimateType === 'manual' && (
            <div className="space-y-2">
              <Label htmlFor="area">施工面积 (sq ft)</Label>
              <Input 
                id="area" 
                placeholder="例如: 1500" 
                value={area} 
                onChange={(e) => setArea(e.target.value)}
                className="rounded-xl"
              />
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button onClick={runEstimate} className="w-full h-12 rounded-xl bg-indigo-600">
              开始计算
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CostEstimate;