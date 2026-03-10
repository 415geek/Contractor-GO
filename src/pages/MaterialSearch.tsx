"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, Search, MapPin, ExternalLink, Phone, Upload, ImagePlus, X, Edit } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const MaterialSearch = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = React.useState(false);
  const [results, setResults] = React.useState<any[] | null>(null);
  const [image, setImage] = React.useState<string | null>(null);
  const [description, setDescription] = React.useState('');
  const [isCorrectionDialogOpen, setIsCorrectionDialogOpen] = React.useState(false);
  const [correctionDescription, setCorrectionDescription] = React.useState('');

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

  const runSearch = (searchText: string) => {
    // AI System Prompt: "You are an expert in American building materials, with many years of experience in purchasing construction and decoration materials. You are familiar with all kinds of decoration materials and can accurately identify what material it is and where to buy it just by looking at a photo."
    setIsScanning(true);
    setResults(null);
    
    setTimeout(() => {
      setIsScanning(false);
      const lowerSearchText = searchText.toLowerCase();

      // Simulate AI analysis based on text description
      if (lowerSearchText.includes('wood') || lowerSearchText.includes('2x4') || lowerSearchText.includes('lumber') || lowerSearchText.includes('木')) {
        setResults([
          { 
            id: 1, 
            store: 'Home Depot', 
            name: '2 in. x 4 in. x 8 ft. #2 Prime Douglas Fir Stud', 
            price: '$4.52 / each', 
            distance: '1.5 miles', 
            stock: '充足',
            address: '200 Bayshore Blvd, San Francisco, CA',
            link: '#'
          },
          { 
            id: 2, 
            store: 'Lowe\'s', 
            name: '2-in x 4-in x 8-ft Whitewood Stud', 
            price: '$4.65 / each', 
            distance: '3.2 miles', 
            stock: '充足',
            address: '520 High St, Oakland, CA',
            link: '#'
          },
          { 
            id: 3, 
            store: 'Golden State Lumber', 
            name: '2x4-8\' SPF Stud', 
            price: '$4.95 / each', 
            distance: '5.1 miles', 
            stock: '充足',
            address: '401 Du Bois St, San Rafael, CA',
            link: '#'
          },
        ]);
      } else if (lowerSearchText.includes('walnut') || lowerSearchText.includes('flooring')) {
        setResults([
          { 
            id: 4, 
            store: 'Lumber Liquidators', 
            name: 'American Walnut Hardwood Flooring', 
            price: '$9.99 / sq ft', 
            distance: '4.5 miles', 
            stock: '充足',
            address: '101 Flooring Ave, Palo Alto, CA',
            link: '#'
          },
          { 
            id: 5, 
            store: 'Home Depot', 
            name: 'Engineered Walnut Wood Flooring', 
            price: '$8.25 / sq ft', 
            distance: '1.5 miles', 
            stock: '充足',
            address: '200 Bayshore Blvd, San Francisco, CA',
            link: '#'
          },
        ]);
      } else {
        // Default to Sakrete Concrete Mix if no specific keywords match
        setResults([
          { 
            id: 1, 
            store: 'Home Depot', 
            name: 'Sakrete 80 lb. High-Strength Concrete Mix', 
            price: '$7.25 / bag', 
            distance: '1.5 miles', 
            stock: '充足',
            address: '200 Bayshore Blvd, San Francisco, CA',
            link: '#'
          },
          { 
            id: 2, 
            store: 'Lowe\'s', 
            name: 'Sakrete 80-lb High Strength Concrete Mix', 
            price: '$7.25 / bag', 
            distance: '3.2 miles', 
            stock: '充足',
            address: '520 High St, Oakland, CA',
            link: '#'
          },
          { 
            id: 3, 
            store: 'Central Concrete Supply', 
            name: 'Sakrete Concrete Mix 80lb', 
            price: '$7.80 / bag', 
            distance: '6.8 miles', 
            stock: '少量',
            address: '999 Construction Rd, San Jose, CA',
            link: '#'
          },
        ]);
      }
    }, 2000);
  };

  const handleInitialScan = () => {
    runSearch(description);
  };

  const handleCorrectionScan = () => {
    setIsCorrectionDialogOpen(false);
    runSearch(correctionDescription);
  };

  const resetSearch = () => {
    setResults(null);
    setImage(null);
    setDescription('');
    setCorrectionDescription('');
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
              <p className="mt-6 text-indigo-300 font-bold animate-pulse">Nova Act AI 正在全网比价...</p>
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
                placeholder="添加描述帮助 AI 更精准识别，例如：2x4 木方，8英尺长"
                className="bg-white rounded-xl"
              />
            </div>
            <Button onClick={handleInitialScan} disabled={!image} className="w-full h-12 rounded-xl bg-indigo-600 text-base font-bold">
              开始识别
            </Button>
          </div>
        )}

        {/* Results List */}
        {results && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-bold text-slate-900">搜索结果</h2>
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
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <p className="text-xs text-slate-400 text-center px-4 pt-2">
              *价格与地址为演示数据，仅供参考。
            </p>

            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1 text-slate-500" onClick={resetSearch}>
                重新搜索
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 bg-white border-indigo-100 text-indigo-600"
                onClick={() => setIsCorrectionDialogOpen(true)}
              >
                <Edit className="h-3 w-3 mr-2" /> 材料不对？点击修正
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Correction Dialog */}
      <Dialog open={isCorrectionDialogOpen} onOpenChange={setIsCorrectionDialogOpen}>
        <DialogContent className="max-w-[90%] rounded-3xl">
          <DialogHeader>
            <DialogTitle>修正材料信息</DialogTitle>
            <DialogDescription>
              请提供更详细的材料描述，帮助 AI 进行更精确的搜索。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="correction-description">详细描述</Label>
            <Textarea 
              id="correction-description"
              value={correctionDescription}
              onChange={(e) => setCorrectionDescription(e.target.value)}
              placeholder="例如：美国胡桃木实木地板，3/4英寸厚"
              className="mt-2 rounded-xl"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleCorrectionScan} className="w-full h-12 rounded-xl bg-indigo-600">
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