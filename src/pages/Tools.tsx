"use client";

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, Home, FileText, BarChart3, Ruler, Calendar,
  Folder, DollarSign, ChevronRight, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { tools } from '@/lib/design-system';

const commonTools = tools.filter(t => t.category === 'common');
const moreTools = tools.filter(t => t.category === 'more');

const Tools = () => {
  const navigate = useNavigate();

  const ToolCard = ({ tool }: { tool: typeof tools[0] }) => (
    <Card 
      className="hover:border-primary/50 transition-all cursor-pointer card-hover group"
      onClick={() => navigate(tool.route)}
    >
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
              <span className="text-2xl">{tool.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base md:text-lg mb-1">{tool.name}</h3>
              <p className="text-sm text-muted-foreground">{tool.description}</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2 group-hover:text-primary transition-colors" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AppLayout title="工具箱">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <p className="text-sm text-muted-foreground">
            智能工具，提升工作效率
          </p>
        </div>

        {/* Common Tools */}
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            常用工具
            <Badge variant="secondary" className="text-xs">推荐</Badge>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {commonTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>

        {/* More Tools */}
        <div>
          <h2 className="text-lg font-semibold mb-4">更多工具</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {moreTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>

        {/* Coming Soon Banner */}
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base mb-1">更多功能即将推出</h3>
                <p className="text-sm text-muted-foreground">
                  AI助手、语音识别、AR测量等强大功能正在开发中
                </p>
              </div>
              <Badge className="bg-primary text-primary-foreground">
                即将上线
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              使用技巧
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                <p>拍照识别材料时，确保标签清晰可见以获得更准确的结果</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                <p>房屋估价支持选择特定区域，可更精准地计算成本</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                <p>创建发票后可直接发送到聊天，自动翻译成客户语言</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Tools;