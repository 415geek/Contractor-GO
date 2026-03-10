"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, Search, MapPin, ExternalLink, Phone } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const MaterialSearch = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = React.useState(false);
  const [results, setResults] = React.useState<any[] | null>(null);

  const handleScan = () => {
    setIsScanning(true);
    // 模拟 Nova Act AI 搜索过程
    setTimeout(() => {
      setIsScanning(false);
      setResults([
        { 
          id: 1, 
          store: 'Home Depot', 
          name: 'Premium 2x4x8 Stud', 
          price: '$3.98', 
          distance: '1.2 miles', 
          stock: '充足',
          address: '123 Main St, Flushing, NY',
          link: '#'
        },
        { 
          id: 2, 
          store: 'Lowe\'s', 
          name: 'Standard 2x4x8 Stud', 
          price: '$4.15', 
          distance: '2.5 miles', 
          stock: '仅剩15件',
          address: '456 Broadway, Queens, NY',
          link: '#'
        },
        { 
          id: 3, 
          store: 'Local Lumber Yard', 
          name: 'Douglas Fir 2x4', 
          price: '$3.75', 
          distance: '0.8 miles', 
          stock: '需预订',
          address: '789 Industrial Way, NY',
          link: '#'
        },
      ]);
    }, 2000);
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
        {/* Camera Viewport Simulation */}
        <div className="relative aspect-[4/3] bg-black rounded-2xl overflow-hidden flex items-center justify-center border-4 border-white shadow-lg">
          {!results && !isScanning ? (
            <div className="text-center text-white space-y-4">
              <div className="h-20 w-20 bg-white/10 rounded-full flex items-center justify-center mx-auto border border-white/20">
                <Camera className="h-10 w-10" />
              </div>
              <p className="text-sm font-medium">请拍摄材料标签或实物</p>
              <Button onClick={handleScan} className="bg-indigo-600 hover:bg-indigo-700 rounded-full px-8">
                开始识别
              </Button>
            </div>
          ) : isScanning ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
              <div className="w-48 h-48 border-2 border-indigo-400 rounded-lg relative overflow-hidden">
                <div className="absolute inset-x-0 h-1 bg-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.8)] animate-scan-move"></div>
              </div>
              <p className="mt-6 text-indigo-300 font-bold animate-pulse">Nova Act AI 正在全网比价...</p>
            </div>
          ) : (
            <img 
              src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=500" 
              alt="Material" 
              className="w-full h-full object-cover opacity-60"
            />
          )}
        </div>

        {/* Results List */}
        {results && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-bold text-slate-900">搜索结果 (基于当前位置)</h2>
              <Badge className="bg-indigo-100 text-indigo-700 border-none">最低价: $3.75</Badge>
            </div>
            
            {results.map((item) => (
              <Card key={item.id} className="border-none shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">{item.store}</span>
                        <span className="text-[10px] text-slate-400">| {item.distance}</span>
                      </div>
                      <h3 className="text-sm text-slate-600 mt-1">{item.name}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-indigo-600">{item.price}</div>
                      <div className={cn("text-[10px] font-medium", item.stock === '充足' ? "text-green-500" : "text-amber-500")}>
                        库存: {item.stock}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center text-[11px] text-slate-400">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="truncate max-w-[150px]">{item.address}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="h-8 rounded-lg border-slate-200">
                        <Phone className="h-3 w-3 mr-1" /> 拨打
                      </Button>
                      <Button size="sm" className="h-8 rounded-lg bg-indigo-600">
                        <ExternalLink className="h-3 w-3 mr-1" /> 导航
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Button 
              variant="ghost" 
              className="w-full text-slate-400 text-xs"
              onClick={() => setResults(null)}
            >
              重新拍摄
            </Button>
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
  );
};

export default MaterialSearch;