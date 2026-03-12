"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Camera, 
  Upload, 
  Info, 
  Calculator, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  RefreshCw,
  ImagePlus,
  X,
  ChevronDown,
  ChevronUp,
  Home,
  Layers
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import AppLayout from '@/components/AppLayout';

interface ModuleEstimate {
  id: string;
  name: string;
  nameEn: string;
  area: string;
  materialPriceRange: string;
  laborPriceRange: string;
  totalRange: string;
  confidence: number;
  details: string;
}

interface HouseAnalysis {
  houseType: string;
  houseTypeEn: string;
  estimatedTotalArea: string;
  overallCondition: string;
  modules: ModuleEstimate[];
  totalEstimate: string;
  recommendations: string[];
}

const CostEstimate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = React.useState<'capture' | 'analyzing' | 'result'>('capture');
  const [image, setImage] = React.useState<string | null>(null);
  const [analysis, setAnalysis] = React.useState<HouseAnalysis | null>(null);
  const [materialSuggestions, setMaterialSuggestions] = React.useState<any[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [expandedModule, setExpandedModule] = React.useState<string | null>(null);
  const [analyzeStatus, setAnalyzeStatus] = React.useState<string>('');

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

  const runAnalysis = async (selectedModule?: string) => {
    if (!image) return;
    
    setStep('analyzing');
    setError(null);
    setAnalyzeStatus('AI 正在分析房屋结构...');

    try {
      const { data, error } = await supabase.functions.invoke('house-cost-estimate', {
        body: { 
          imageBase64: image,
          selectedModule,
          location: 'United States'
        },
      });

      if (error) throw error;

      if (data.error) {
        setError(data.error);
        toast({
          title: "分析出错",
          description: data.error,
          variant: "destructive",
        });
        setStep('capture');
        return;
      }

      setAnalysis(data.analysis);
      setMaterialSuggestions(data.materialSuggestions || []);
      setStep('result');
      
      toast({
        title: "分析完成",
        description: `已识别 ${data.analysis.modules.length} 个建筑模块`,
      });

    } catch (error: any) {
      console.error('Error analyzing house:', error);
      setError(error.message);
      toast({
        title: "分析失败",
        description: error.message,
        variant: "destructive",
      });
      setStep('capture');
    }
  };

  const resetAnalysis = () => {
    setStep('capture');
    setImage(null);
    setAnalysis(null);
    setMaterialSuggestions([]);
    setError(null);
    setExpandedModule(null);
  };

  const getModuleIcon = (moduleId: string) => {
    const icons: Record<string, string> = {
      'roof': '🏠',
      'wall': '🧱',
      'window': '🪟',
      'door': '🚪',
      'foundation': '🏗️',
      'deck': '🪵',
      'driveway': '🛣️',
      'garage': '🚗',
      'fence': '🏡',
    };
    return icons[moduleId.toLowerCase()] || '📦';
  };

  return (
    <AppLayout title="房屋造价估算">
      <div className="min-h-screen bg-[#f7f7f7] flex flex-col max-w-md mx-auto shadow-2xl relative md:max-w-2xl md:shadow-lg">
        {/* Header */}
        <header className="h-12 bg-white flex items-center px-2 sticky top-0 z-50 border-b border-slate-200">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-6 w-6 text-slate-700" />
          </Button>
          <h1 className="flex-1 text-center text-[17px] font-semibold text-slate-900 mr-8">房屋造价估算</h1>
        </header>

        <div className="flex-1 p-4 pb-8">
          {/* Capture Step */}
          {step === 'capture' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Image Upload Area */}
              <div className="relative aspect-[4/3] bg-slate-100 rounded-3xl overflow-hidden flex items-center justify-center border-2 border-dashed border-slate-200">
                {!image ? (
                  <div className="text-center text-slate-500 space-y-4 p-6">
                    <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mx-auto">
                      <Home className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-base font-medium text-slate-700">拍摄房屋全景照片</p>
                      <p className="text-sm text-slate-400 mt-1">AI 将自动识别建筑模块并估算造价</p>
                    </div>
                    <div className="flex justify-center gap-3 pt-2">
                      <Button variant="outline" className="bg-white rounded-xl">
                        <Camera className="h-4 w-4 mr-2" /> 拍照
                      </Button>
                      <Button asChild variant="outline" className="bg-white rounded-xl">
                        <label htmlFor="house-upload" className="cursor-pointer flex items-center">
                          <Upload className="h-4 w-4 mr-2" /> 上传
                          <input 
                            id="house-upload" 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleImageUpload} 
                          />
                        </label>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <img src={image} alt="House Preview" className="w-full h-full object-cover" />
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-3 right-3 h-8 w-8 rounded-full shadow-lg" 
                      onClick={() => setImage(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                  <p className="font-bold mb-1">分析出错</p>
                  <p>{error}</p>
                </div>
              )}

              {/* Info Card */}
              <Card className="border-none shadow-sm rounded-2xl bg-indigo-50">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-indigo-700">
                      <p className="font-medium mb-1">AI 智能估价</p>
                      <p className="text-indigo-600/80">
                        基于 GPT-4 Vision 技术，自动识别屋顶、外墙、窗户、门等模块，
                        结合美国当前市场价格提供专业估价。
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Analyze Button */}
              <Button 
                onClick={() => runAnalysis()} 
                disabled={!image} 
                className="w-full h-14 rounded-2xl bg-indigo-600 text-lg font-bold shadow-lg shadow-indigo-200"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                开始 AI 分析
              </Button>
            </div>
          )}

          {/* Analyzing Step */}
          {step === 'analyzing' && (
            <div className="h-full flex flex-col items-center justify-center space-y-6 py-20">
              <div className="relative">
                <div className="h-24 w-24 bg-indigo-100 rounded-3xl flex items-center justify-center">
                  <Home className="h-12 w-12 text-indigo-600" />
                </div>
                <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center animate-pulse">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-lg font-bold text-slate-900">{analyzeStatus}</p>
                <p className="text-sm text-slate-500">正在识别建筑模块并计算造价...</p>
                </div>
            </div>
          )}

          {/* Result Step */}
          {step === 'result' && analysis && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Total Estimate Card */}
              <Card className="border-none shadow-lg rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white overflow-hidden">
                <CardContent className="p-6 relative">
                  <div className="absolute -right-8 -top-8 h-32 w-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-indigo-200 text-sm">预估总造价</p>
                        <p className="text-3xl font-black mt-1">{analysis.totalEstimate}</p>
                      </div>
                      <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center">
                        <Calculator className="h-7 w-7" />
                      </div>
                    </div>
                    <div className="flex items-center text-xs bg-white/20 w-fit px-3 py-1.5 rounded-full">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                      基于 AI 视觉分析 + 实时市场价格
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* House Info */}
              <Card className="border-none shadow-sm rounded-2xl">
                <CardContent className="p-5">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center mr-3">
                      <Home className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{analysis.houseType}</h3>
                      <p className="text-xs text-slate-500">{analysis.houseTypeEn}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">预估面积</p>
                      <p className="font-bold text-slate-900">{analysis.estimatedTotalArea}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">整体状况</p>
                      <p className="font-bold text-slate-900">{analysis.overallCondition}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Modules List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="font-bold text-slate-900 flex items-center">
                    <Layers className="h-4 w-4 mr-2 text-indigo-600" />
                    建筑模块分析
                  </h3>
                  <Badge variant="secondary" className="bg-slate-100">
                    {analysis.modules.length} 个模块
                  </Badge>
                </div>

                {analysis.modules.map((module) => (
                  <Collapsible 
                    key={module.id}
                    open={expandedModule === module.id}
                    onOpenChange={(open) => setExpandedModule(open ? module.id : null)}
                  >
                    <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                      <CollapsibleTrigger asChild>
                        <CardContent className="p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-2xl mr-3">{getModuleIcon(module.id)}</span>
                              <div>
                                <h4 className="font-bold text-slate-900">{module.name}</h4>
                                <p className="text-xs text-slate-500">{module.nameEn} · {module.area}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="text-right mr-3">
                                <p className="font-bold text-indigo-600">{module.totalRange}</p>
                                <div className="flex items-center justify-end">
                                  <Progress value={module.confidence * 100} className="w-12 h-1.5" />
                                  <span className="text-[10px] text-slate-400 ml-1">{Math.round(module.confidence * 100)}%</span>
                                </div>
                              </div>
                              {expandedModule === module.id ? (
                                <ChevronUp className="h-5 w-5 text-slate-400" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-slate-400" />
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="px-4 pb-4 pt-0 border-t border-slate-50">
                          <div className="grid grid-cols-2 gap-3 py-3 text-sm">
                            <div className="bg-slate-50 rounded-xl p-3">
                              <p className="text-slate-500 text-xs">材料单价</p>
                              <p className="font-bold text-slate-900">{module.materialPriceRange}</p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3">
                              <p className="text-slate-500 text-xs">人工单价</p>
                              <p className="font-bold text-slate-900">{module.laborPriceRange}</p>
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed">{module.details}</p>
                        </div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                ))}
              </div>

              {/* Recommendations */}
              {analysis.recommendations && analysis.recommendations.length > 0 && (
                <Card className="border-none shadow-sm rounded-2xl bg-amber-50">
                  <CardContent className="p-4">
                    <h4 className="font-bold text-amber-800 mb-3 flex items-center">
                      <Sparkles className="h-4 w-4 mr-2" />
                      AI 建议
                    </h4>
                    <ul className="space-y-2">
                      {analysis.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start text-sm text-amber-700">
                          <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Material Suggestions */}
              {materialSuggestions.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-900 px-1">推荐材料</h3>
                  {materialSuggestions.map((item, idx) => (
                    <Card 
                      key={idx} 
                      className="border-none shadow-sm rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => item.link && window.open(item.link, '_blank')}
                    >
                      <CardContent className="p-3 flex items-center">
                        {item.thumbnail && (
                          <img src={item.thumbnail} alt={item.name} className="h-14 w-14 rounded-lg object-cover mr-3" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 line-clamp-1">{item.name}</p>
                          <p className="text-xs text-slate-500">{item.store}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-indigo-600">{item.price}</p>
                          <ExternalLink className="h-3 w-3 text-slate-400 ml-auto" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1 h-12 rounded-xl border-slate-200" 
                  onClick={resetAnalysis}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  重新分析
                </Button>
                <Button className="flex-1 h-12 rounded-xl bg-indigo-600">
                  保存到项目
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default CostEstimate;