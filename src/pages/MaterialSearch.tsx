"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, Upload, X, Edit, ExternalLink, Star, MoreHorizontal } from 'lucide-react';
import { cn } from "@/lib/utils";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import AppLayout from '@/components/AppLayout';

const MaterialSearch = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isScanning, setIsScanning] = React.useState(false);
  const [results, setResults] = React.useState<any[] | null>(null);
  const [image, setImage] = React.useState<string | null>(null);
  const [description, setDescription] = React.useState('');
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
      if (!searchText && image && useImageRecognition) {
        setScanStatus('AI 正在识别材料...');
      } else {
        setScanStatus('正在搜索最佳价格...');
      }

      const { data, error } = await supabase.functions.invoke('nova-act-search', {
        body: { 
          searchText: searchText || '',
          location: 'San Francisco, California, United States',
          imageBase64: (!searchText && useImageRecognition) ? image : null
        },
      });

      if (error) throw error;

      if (data.error) {
        setError(data.error);
        toast({
          title: "搜索出错",
          description: data.error,
          variant: "destructive",
        });
      }

      if (data.identifiedProduct) {
        setIdentifiedProduct(data.identifiedProduct);
      }

      setResults(data.results || []);
    } catch (error: any) {
      console.error('Error invoking Supabase function:', error);
      setError(error.message);
      setResults([]);
    } finally {
      setIsScanning(false);
      setScanStatus('');
    }
  };

  const handleInitialScan = () => {
    runSearch(description || undefined, !description);
  };

  const resetSearch = () => {
    setResults(null);
    setImage(null);
    setDescription('');
    setError(null);
    setIdentifiedProduct(null);
  };

  return (
    <AppLayout title="扫一扫">
      <div className="min-h-screen bg-[#EDEDED] flex flex-col max-w-md mx-auto relative md:max-w-2xl md:shadow-lg">
        {/* Header */}
        <header className="h-[44px] bg-[#EDEDED] flex items-center justify-between px-1 sticky top-0 z-50 border-b border-[#D9D9D9]">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center px-2 py-2 active:opacity-70"
          >
            <ChevronLeft className="h-6 w-6 text-[#191919]" />
          </button>
          <h1 className="text-[17px] font-medium text-[#191919]">扫一扫</h1>
          <button className="px-3 py-2 active:opacity-70">
            <MoreHorizontal className="h-6 w-6 text-[#191919]" />
          </button>
        </header>

        <div className="flex-1 p-4">
          {/* Capture Area */}
          {!results && (
            <div className="space-y-4">
              <div className="relative aspect-square bg-black rounded-lg overflow-hidden flex items-center justify-center">
                {!image && !isScanning && (
                  <div className="text-center text-white space-y-6 p-6">
                    <div className="w-48 h-48 border-2 border-white/30 rounded-lg mx-auto relative">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#07C160]"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#07C160]"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#07C160]"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#07C160]"></div>
                    </div>
                    <p className="text-[14px] text-white/70">将材料放入框内扫描</p>
                  </div>
                )}

                {image && !isScanning && (
                  <>
                    <img src={image} alt="Material Preview" className="w-full h-full object-contain" />
                    <button 
                      onClick={() => setImage(null)}
                      className="absolute top-3 right-3 h-8 w-8 bg-black/50 rounded-full flex items-center justify-center active:opacity-70"
                    >
                      <X className="h-5 w-5 text-white" />
                    </button>
                  </>
                )}

                {isScanning && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
                    <div className="w-48 h-48 border-2 border-[#07C160]/50 rounded-lg relative overflow-hidden">
                      <div className="absolute inset-x-0 h-0.5 bg-[#07C160] shadow-[0_0_10px_#07C160] animate-scan-move"></div>
                    </div>
                    <p className="mt-6 text-[#07C160] text-[14px]">{scanStatus}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-8 py-4">
                <label className="flex flex-col items-center cursor-pointer active:opacity-70">
                  <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow">
                    <Camera className="h-6 w-6 text-[#191919]" />
                  </div>
                  <span className="text-[12px] text-[#191919] mt-2">拍照</span>
                  <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageUpload} />
                </label>
                <label className="flex flex-col items-center cursor-pointer active:opacity-70">
                  <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow">
                    <Upload className="h-6 w-6 text-[#191919]" />
                  </div>
                  <span className="text-[12px] text-[#191919] mt-2">相册</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>

              {/* Description Input */}
              {image && (
                <div className="bg-white rounded-lg p-3 space-y-3">
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="补充描述（选填）"
                    className="w-full h-20 text-[16px] resize-none focus:outline-none placeholder:text-[#B2B2B2]"
                  />
                  <button 
                    onClick={handleInitialScan}
                    className="w-full h-[44px] bg-[#07C160] text-white rounded-lg text-[16px] font-medium active:bg-[#06AE56]"
                  >
                    开始识别比价
                  </button>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="bg-[#FFF3F3] rounded-lg p-3 text-[14px] text-[#FA5151]">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Results */}
          {results && results.length > 0 && (
            <div className="space-y-3 animate-fade-in">
              {/* Identified Product */}
              {identifiedProduct && (
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center text-[#07C160] text-[12px] mb-1">
                    <span className="font-medium">AI 识别结果</span>
                  </div>
                  <p className="text-[16px] text-[#191919]">{identifiedProduct}</p>
                </div>
              )}

              {/* Results List */}
              <div className="bg-white rounded-lg overflow-hidden">
                {results.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => item.link && item.link !== '#' && window.open(item.link, '_blank')}
                    className={cn(
                      "flex p-3 active:bg-[#ECECEC] cursor-pointer",
                      idx !== results.length - 1 && "border-b border-[#F0F0F0]"
                    )}
                  >
                    {item.thumbnail && (
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                        className="w-[72px] h-[72px] object-cover rounded-md flex-shrink-0 bg-[#F5F5F5]"
                      />
                    )}
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="text-[14px] text-[#191919] line-clamp-2">{item.name}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-[12px] text-[#B2B2B2]">{item.store}</span>
                        {item.rating && (
                          <div className="flex items-center ml-2">
                            <Star className="h-3 w-3 text-[#FA9D3B] fill-[#FA9D3B]" />
                            <span className="text-[12px] text-[#B2B2B2] ml-0.5">{item.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[18px] font-medium text-[#FA5151]">{item.price}</span>
                        <span className={cn(
                          "text-[12px] px-2 py-0.5 rounded",
                          item.stock === '有货' ? "text-[#07C160] bg-[#E8F8EE]" : "text-[#FA9D3B] bg-[#FFF8E8]"
                        )}>
                          {item.stock}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button 
                  onClick={resetSearch}
                  className="flex-1 h-[44px] bg-white text-[#191919] rounded-lg text-[16px] active:bg-[#ECECEC]"
                >
                  重新扫描
                </button>
                <button 
                  onClick={() => {}}
                  className="flex-1 h-[44px] bg-[#07C160] text-white rounded-lg text-[16px] active:bg-[#06AE56]"
                >
                  保存结果
                </button>
              </div>
            </div>
          )}

          {/* No Results */}
          {results && results.length === 0 && !error && (
            <div className="text-center py-12">
              <p className="text-[#B2B2B2]">未找到相关产品</p>
              <button 
                onClick={resetSearch}
                className="mt-4 text-[#07C160] text-[16px]"
              >
                重新扫描
              </button>
            </div>
          )}
        </div>

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
    </AppLayout>
  );
};

export default MaterialSearch;