"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, Upload, X, Star, MapPin, Phone, ExternalLink, Loader2, CheckCircle } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toolsAPI } from '@/lib/api';
import { useToast } from "@/hooks/use-toast";
import AppLayout from '@/components/AppLayout';

const MaterialSearch = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<'capture' | 'recognize' | 'compare'>('capture');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recognitionResult, setRecognitionResult] = useState<any>(null);
  const [compareResult, setCompareResult] = useState<any>(null);

  const compressImage = async (dataUrl: string) => {
    const img = new Image();
    img.src = dataUrl;

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('图片加载失败'));
    });

    const maxDim = 1280;
    const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');
    if (!ctx) return dataUrl;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);

    // Convert to JPEG to reduce payload size
    const out = canvas.toDataURL('image/jpeg', 0.78);
    return out;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const raw = reader.result as string;
          const compressed = await compressImage(raw);
          setImage(compressed);
        } catch {
          setImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRecognize = async () => {
    if (!image) return;

    try {
      setLoading(true);
      setError('');

      console.log('[MaterialSearch] recognize payload size (chars):', image.length);

      const result = await toolsAPI.materialRecognize({
        images: [image],
      });

      setRecognitionResult(result.result);
      setStep('recognize');
    } catch (err: any) {
      setError(err.message || '识别失败，请重试');
      toast({
        title: "识别失败",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    if (!recognitionResult) return;

    try {
      setLoading(true);
      setError('');

      const result = await toolsAPI.materialCompare({
        material: recognitionResult.material,
        location: {
          city: 'San Francisco',
          lat: 37.7749,
          lng: -122.4194,
        },
        search_radius_km: 50,
      });

      setCompareResult(result.result);
      setStep('compare');
    } catch (err: any) {
      setError(err.message || '比价失败，请重试');
      toast({
        title: "比价失败",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setImage(null);
    setRecognitionResult(null);
    setCompareResult(null);
    setError('');
    setStep('capture');
  };

  return (
    <AppLayout title="材料比价">
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
                <div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center relative">
                  {!image ? (
                    <div className="text-center space-y-4">
                      <Camera className="h-16 w-16 text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground">拍摄或上传材料照片</p>
                    </div>
                  ) : (
                    <>
                      <img src={image} alt="Material" className="w-full h-full object-contain" />
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
                  <Button
                    className="w-full h-12 mt-4"
                    onClick={handleRecognize}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        识别中...
                      </>
                    ) : (
                      '开始识别'
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-2">💡 提示</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 确保产品标签清晰可见</li>
                  <li>• 拍摄多张角度的照片可提高准确度</li>
                  <li>• 避免反光和模糊</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Recognition Result */}
        {step === 'recognize' && recognitionResult && (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold">识别结果</h3>
                  <Badge variant="outline">
                    置信度: {Math.round(recognitionResult.material.confidence * 100)}%
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">品牌</p>
                    <p className="font-semibold">{recognitionResult.material.brand}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">型号</p>
                    <p className="font-semibold">{recognitionResult.material.model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">类型</p>
                    <p className="font-semibold">{recognitionResult.material.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">规格</p>
                    <p className="font-semibold">{recognitionResult.material.specifications.size}</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <Button variant="outline" className="flex-1" onClick={resetSearch}>
                    重新拍摄
                  </Button>
                  <Button className="flex-1" onClick={handleCompare} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        比价中...
                      </>
                    ) : (
                      '开始比价'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Compare Results */}
        {step === 'compare' && compareResult && (
          <div className="space-y-4">
            {/* Summary */}
            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">{compareResult.material.name}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">最低价</p>
                    <p className="text-2xl font-bold text-primary">
                      ${compareResult.summary.lowest_price}
                      <span className="text-sm font-normal text-muted-foreground">/sqft</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{compareResult.summary.lowest_price_store}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">平均价</p>
                    <p className="text-2xl font-bold">
                      ${compareResult.summary.average_price}
                      <span className="text-sm font-normal text-muted-foreground">/sqft</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{compareResult.summary.total_results} 个结果</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results List */}
            <div className="space-y-3">
              {compareResult.results.map((result: any, idx: number) => (
                <Card key={result.id} className={result.is_lowest_price ? 'border-2 border-primary' : ''}>
                  <CardContent className="p-4">
                    {result.is_lowest_price && (
                      <Badge className="mb-2 bg-primary">🏆 最低价</Badge>
                    )}
                    {result.is_wholesale && (
                      <Badge className="mb-2 bg-purple-500">批发价</Badge>
                    )}
                    
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{result.store}</h4>
                        <p className="text-sm text-muted-foreground">{result.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">
                          ${result.price}
                          <span className="text-sm font-normal text-muted-foreground">/sqft</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      {result.distance > 0 && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{result.distance} {result.distance_unit}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{result.rating} ({result.reviews})</span>
                      </div>
                      <Badge variant={result.in_stock ? 'default' : 'secondary'}>
                        {result.stock_level}
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      {result.phone && (
                        <Button variant="outline" size="sm" className="flex-1">
                          <Phone className="h-4 w-4 mr-1" />
                          拨打电话
                        </Button>
                      )}
                      {result.url && (
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => window.open(result.url, '_blank')}>
                          <ExternalLink className="h-4 w-4 mr-1" />
                          查看详情
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Tips */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-2">💰 省钱提示</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {compareResult.tips.map((tip: string, idx: number) => (
                    <li key={idx}>• {tip}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full" onClick={resetSearch}>
              重新搜索
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default MaterialSearch;