"use client";

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const transactions = [
  { id: 1, type: 'income', project: 'Flushing 厨房翻新', description: '首付款 (50%)', amount: 7500, date: '2023-10-20' },
  { id: 2, type: 'expense', project: 'Flushing 厨房翻新', description: 'Home Depot - 橱柜材料', amount: -3200, date: '2023-10-21' },
  { id: 3, type: 'expense', project: 'Queens 屋顶维修', description: 'ABC Supply - 防水材料', amount: -1850, date: '2023-10-22' },
  { id: 4, type: 'income', project: 'Brooklyn 地板打蜡', description: '项目全款', amount: 2500, date: '2023-09-15' },
  { id: 5, type: 'expense', project: 'Flushing 厨房翻新', description: '工人日薪 (x2)', amount: -800, date: '2023-10-23' },
];

const Accounting = () => {
  const navigate = useNavigate();
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const netProfit = totalIncome + totalExpenses;

  return (
    <AppLayout title="财务与账单">
      <div className="p-4 space-y-6">
        {/* Financial Summary Card */}
        <Card className="border-none shadow-sm rounded-2xl bg-white">
          <CardContent className="p-5">
            <div className="grid grid-cols-3 divide-x divide-slate-100 text-center">
              <div>
                <p className="text-xs text-slate-400">总收入</p>
                <p className="text-lg font-bold text-emerald-600 mt-1">${totalIncome.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">总支出</p>
                <p className="text-lg font-bold text-red-600 mt-1">${Math.abs(totalExpenses).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">净利润</p>
                <p className="text-lg font-bold text-indigo-600 mt-1">${netProfit.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button className="flex-1 h-12 rounded-xl bg-indigo-600 shadow-md">
            <Plus className="mr-2 h-5 w-5" /> 添加记录
          </Button>
          <Button variant="outline" className="flex-1 h-12 rounded-xl border-slate-200 bg-white text-slate-600">
            <Download className="mr-2 h-5 w-5" /> 生成报表
          </Button>
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 px-1">最近记录</h3>
          {transactions.map((tx) => (
            <Card key={tx.id} className="border-none shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-4 flex items-center">
                <div className="mr-4">
                  {tx.type === 'income' ? (
                    <ArrowUpCircle className="h-8 w-8 text-emerald-500" />
                  ) : (
                    <ArrowDownCircle className="h-8 w-8 text-red-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-slate-900">{tx.description}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{tx.project}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {tx.type === 'income' ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}
                  </p>
                  <p className="text-[11px] text-slate-400">{tx.date}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Accounting;