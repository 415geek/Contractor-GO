"use client";

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { Search, Plus, Phone, Mail, MapPin, MoreVertical } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const clients = [
  { id: 1, name: '张伟', email: 'zhangwei@example.com', phone: '138-0000-1111', address: '朝阳区幸福大街12号', jobs: 3, lastActive: '2天前' },
  { id: 2, name: '李娜', email: 'lina@example.com', phone: '139-1111-2222', address: '海淀区中关村南路5号', jobs: 1, lastActive: '1周前' },
  { id: 3, name: '王强', email: 'wangqiang@example.com', phone: '137-2222-3333', address: '丰台区科技园路88号', jobs: 5, lastActive: '今天' },
  { id: 4, name: '赵敏', email: 'zhaomin@example.com', phone: '136-3333-4444', address: '西城区金融街2号', jobs: 2, lastActive: '3小时前' },
  { id: 5, name: '孙立', email: 'sunli@example.com', phone: '135-4444-5555', address: '东城区王府井大街1号', jobs: 0, lastActive: '1个月前' },
];

const Clients = () => {
  return (
    <AppLayout title="客户管理">
      <div className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="搜索客户姓名或电话..." className="pl-10 rounded-xl border-slate-200 bg-white" />
        </div>

        <div className="space-y-3">
          {clients.map((client) => (
            <Card key={client.id} className="border-none shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 rounded-full">
                      <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">
                        {client.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <h3 className="font-bold text-slate-900">{client.name}</h3>
                      <p className="text-[10px] text-slate-400">最后活跃: {client.lastActive}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-slate-400 h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-xs text-slate-600">
                    <Phone className="h-3 w-3 mr-2 text-slate-400" />
                    {client.phone}
                  </div>
                  <div className="flex items-center text-xs text-slate-600">
                    <MapPin className="h-3 w-3 mr-2 text-slate-400" />
                    <span className="truncate">{client.address}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <div className="text-[11px]">
                    <span className="font-bold text-slate-900">{client.jobs}</span>
                    <span className="text-slate-500 ml-1">个合作项目</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="h-7 rounded-lg text-[11px] border-slate-200">
                      联系客户
                    </Button>
                    <Button size="sm" className="h-7 rounded-lg text-[11px] bg-indigo-600">
                      查看历史
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button className="w-full h-12 rounded-xl bg-white text-indigo-600 border border-indigo-100 shadow-sm mt-4">
          <Plus className="mr-2 h-5 w-5" /> 添加新客户
        </Button>
      </div>
    </AppLayout>
  );
};

export default Clients;