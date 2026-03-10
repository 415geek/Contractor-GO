"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, MapPin, Upload, ImagePlus, X, Edit, ExternalLink, Star, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

const MaterialSearch = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isScanning, setIsScanning] = React.useState(false);
  const [results, setResults] = React.useState<any[] | null>(null);
  const [image, setImage] = React.useState<string | null>(null);
  const [description, setDescription] = React.useState('');
  const [isCorrectionDialogOpen, setIsCorrectionDialogOpen] = React.useState(false);
  const [correctionDescription, setCorrectionDescription] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [identifiedProduct, setIdentifiedProduct] = React.useState<string | null>(null);
  const [scanStatus, setScanStatus] = React.useState<string>('');

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

  const runSearch = async (searchText?: string, useImageRecognition: boolean = true) => {
    setIsScanning(true);
    setResults(null);
    setError(null);
    setIdentifiedProduct(null);

    try {
      // If no search text and we have an image, let AI identify it
      if (!searchText && image && useImageRecognition) {
        setScanStatus('AI 正在识别材料...');
      } else {
        setScanStatus('正在搜索最佳价格...');
      }

      const { data, error } = await supabase.functions.invoke('nova-act-search', {
        body: { 
          searchText: searchText || '',
          location: 'San Francisco, California, United States',
          imageBase64: (!searchText && useImageRecognition) ? image : null // Send image for AI recognition
        },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        setError(data.error);
        toast({
          title: "搜索出错",
          description: data.error,
          variant: "destructive",
        });
      }

      // Show what AI identified
      if (data.identifiedProduct) {
        setIdentifiedProduct(data.identifiedProduct);
        toast({
          title: "AI 识别成功",
          description: `识别为: ${data.identifiedProduct}`,
        });
      }

      setResults(data.results || []);
    } catch (error: any) {
      console.error('Error invoking Supabase function:', error);
      setError(error.message);
      toast({
        title: "搜索失败",
        description: error.message,
        variant: "destructive",
      });
      setResults([]);
    } finally {
      setIsScanning(false);
      setScanStatus('');
    }
  };

  const handleInitialScan = () => {
    // If user provided description, use it directly; otherwise let AI identify from image
    runSearch(description || undefined, !description);
  };

  const handleCorrectionScan = () => {
    setIsCorrectionDialogOpen(false);
    // Use the correction description directly, no image recognition
    runSearch(correctionDescription, false);
  };

  const resetSearch = () => {
    setResults(null);
    setImage(null);
    setDescription('');
    setCorrectionDescription('');
    setError(null);
    setIdentifiedProduct(null);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col max-w-md mx-auto shadow-2xl relative">
      {/* Header */}
      <header className="h-12 bg-white flex items-center px-2 sticky top-0 z-50 border-b border-slate-200">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-6 w-6 text-slate-700" />
        </Button>
        <h1 className="flex-1 text-center text-[17px] font-semibold text-slate-900 mr-8">材料拍照比价</h1>
      </header>

      <div className="flex-1 p-4 space-y-6">
        {/* Image Upload & Preview */}
        <div className="relative aspect-video bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-dashed border-slate-200">
          {!image && !isScanning && (
            <div className="text-center text-slate-500 space-y-4 p-4">
              <ImagePlus className="h-12 w-12 mx-auto text-slate-400" />
              <p className="text-sm font-medium">请拍摄或上传材料照片</p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" className="bg-white">
                  <Camera className="h-4 w-4 mr-2" /> 拍照
                </Button>
                <Button asChild variant="outline" className="bg-white">
                  <label htmlFor="upload-input" className="cursor-pointer flex items-center">
                    <Upload className="h-4 w-4 mr-2" /> 上传
                    <input id="upload-input" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </Button>
              </div>
            </div>
          )}

          {image && !isScanning && (
            <>
              <img src={image} alt="Material Preview" className="w-full h-full object-contain bg-black" />
              <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8 rounded-full" onClick={() => setImage(null)}>
                <X className="h-4 w-4" />
              </Button>
            </>
          )}

          {isScanning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
              <div className="w-48 h-48 border-2 border-indigo-400 rounded-lg relative overflow-hidden">
                <div className="absolute inset-x-0 h-1 bg-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.8)] animate-scan-move"></div>
              </div>
              <p className="mt-6 text-indigo-300 font-bold animate-pulse">{scanStatus || '处理中...'}</p>
            </div>
          )}
        </div>

        {/* Description & Scan Button */}
        {!results && !isScanning && (
          <div className="space-y-4 animate-in fade-in">
            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-700">物品描述 (选填)</Label>
              <Textarea 
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="留空则由 AI 自动识别图片中的材料"
                className="bg-white rounded-xl"
              />
              <p className="text-xs text-slate-400 flex items-center">
                <Sparkles className="h-3 w-3 mr-1 text-indigo-500" />
                AI 会自动识别品牌、型号和规格
              </p>
            </div>
            <Button onClick={handleInitialScan} disabled={!image} className="w-full h-12 rounded-xl bg-indigo-600 text-base font-bold">
              <Sparkles className="h-4 w-4 mr-2" />
              AI 识别并比价
            </Button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            <p className="font-bold mb-1">搜索出错</p>
            <p>{error}</p>
            {error.includes('OPENAI_API_KEY') && (
              <p className="mt-2 text-xs">
                图片识别需要 OpenAI API Key。请在 Supabase 控制台 Edge Function Secrets 中添加 <code className="bg-red-100 px-1 rounded">OPENAI_API_KEY</code>
              </p>
            )}
            {error.includes('SERPAPI_KEY') && (
              <p className="mt-2 text-xs">
                请在 Supabase 控制台中添加 SERPAPI_KEY 密钥。
              </p>
            )}
          </div>
        )}

        {/* AI Identified Product */}
        {identifiedProduct && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
            <div className="flex items-center text-indigo-700 mb-1">
              <Sparkles className="h-4 w-4 mr-2" />
              <span className="font-bold text-sm">AI 识别结果</span>
            </div>
            <p className="text-indigo-900 font-medium">{identifiedProduct}</p>
          </div>
        )}

        {/* Results List */}
        {results && results.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-bold text-slate-900">比价结果</h2>
              <span className="text-xs text-slate-400">实时价格</span>
            </div>
            
            {results.map((item) => (
              <Card key={item.id} className="border-none shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    {item.thumbnail && (
                      <img 
                        src={item.thumbnail} 
                        alt={item.name} 
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-sm">{item.store}</span>
                        {item.rating && (
                          <div className="flex items-center text-amber-500">
                            <Star className="h-3 w-3 fill-current" />
                            <span className="text-[10px] ml-0.5">{item.rating}</span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-xs text-slate-600 mt-1 line-clamp-2">{item.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-lg font-bold text-indigo-600">{item.price}</div>
                        <div className={cn("text-[10px] font-medium", item.stock === '有货' ? "text-green-500" : "text-amber-500")}>
                          {item.stock}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center text-[11px] text-slate-400">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="truncate max-w-[120px]">{item.address}</span>
                    </div>
                    {item.link && item.link !== '#' && (
                      <Button 
                        size="sm" 
                        className="h-7 rounded-lg bg-indigo-600 text-[11px]"
                        onClick={() => window.open(item.link, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" /> 去购买
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1 text-slate-500" onClick={resetSearch}>
                重新搜索
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 bg-white border-indigo-100 text-indigo-600"
                onClick={() => setIsCorrectionDialogOpen(true)}
              >
                <Edit className="h-3 w-3 mr-2" /> 识别不对？修正
              </Button>
            </div>
          </div>
        )}

        {/* No Results */}
        {results && results.length === 0 && !error && (
          <div className="text-center py-8">
            <p className="text-slate-500">未找到相关产品</p>
            <Button variant="link" onClick={resetSearch}>重新搜索</Button>
          </div>
        )}
      </div>

      {/* Correction Dialog */}
      <Dialog open={isCorrectionDialogOpen} onOpenChange={setIsCorrectionDialogOpen}>
        <DialogContent className="max-w-[90%] rounded-3xl">
          <DialogHeader>
            <DialogTitle>修正材料信息</DialogTitle>
            <DialogDescription>
              请提供正确的材料名称，系统将重新搜索。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="correction-description">正确的材料名称</Label>
            <Textarea 
              id="correction-description"
              value={correctionDescription}
              onChange={(e) => setCorrectionDescription(e.target.value)}
              placeholder="例如：SAKRETE High-Strength Concrete Mix 80 lb"
              className="mt-2 rounded-xl"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleCorrectionScan} disabled={!correctionDescription} className="w-full h-12 rounded-xl bg-indigo-600">
              重新搜索
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes scan-move {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan-move {
          animation: scan-move 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default MaterialSearch;
