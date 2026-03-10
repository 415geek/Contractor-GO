"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, ArrowUpCircle, ArrowDownCircle, MoreHorizontal } from 'lucide-react';
import { cn } from "@/lib/utils";

const transactions = [
  { id: 1, type: 'income', project: 'Flushing 厨房翻新', description: '首付款 (50%)', amount: 7500, date: '10-20' },
  { id: 2, type: 'expense', project: 'Flushing 厨房翻新', description: 'Home Depot - 橱柜材料', amount: -3200, date: '10-21' },
  { id: 3, type: 'expense', project: 'Queens 屋顶维修', description: 'ABC Supply - 防水材料', amount: -1850, date: '10-22' },
  { id: 4, type: 'income', project: 'Brooklyn 地板打蜡', description: '项目全款', amount: 2500, date: '09-15' },
  { id: 5, type: 'expense', project: 'Flushing 厨房翻新', description: '工人日薪 (x2)', amount: -800, date: '10-23' },
];

const Accounting = () => {
  const navigate = useNavigate();
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome + totalExpenses;

  return (
    <div className="min-h-screen bg-[#EDEDED] flex flex-col max-w-md mx-auto relative">
      {/* Header */}
      <header className="h-[44px] bg-[#EDEDED] flex items-center justify-between px-1 sticky top-0 z-50 border-b border-[#D9D9D9]">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center px-2 py-2 active:opacity-70"
        >
          <ChevronLeft className="h-6 w-6 text-[#191919]" />
        </button>
        <h1 className="text-[17px] font-medium text-[#191919]">记账本</h1>
        <button className="px-3 py-2 active:opacity-70">
          <Plus className="h-6 w-6 text-[#191919]" />
        </button>
      </header>

      {/* Balance Card */}
      <div className="bg-[#07C160] px-4 py-6">
        <p className="text-white/70 text-[14px]">本月结余</p>
        <p className="text-white text-[36px] font-medium mt-1">${balance.toLocaleString()}</p>
        <div className="flex mt-4 space-x-6">
          <div>
            <p className="text-white/70 text-[12px]">收入</p>
            <p className="text-white text-[18px]">+${totalIncome.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-white/70 text-[12px]">支出</p>
            <p className="text-white text-[18px]">${totalExpenses.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white flex">
        <button className="flex-1 py-4 text-center active:bg-[#ECECEC]">
          <ArrowDownCircle className="h-6 w-6 text-[#07C160] mx-auto" />
          <span className="text-[12px] text-[#191919] mt-1 block">记收入</span>
        </button>
        <div className="w-px bg-[#F0F0F0]"></div>
        <button className="flex-1 py-4 text-center active:bg-[#ECECEC]">
          <ArrowUpCircle className="h-6 w-6 text-[#FA5151] mx-auto" />
          <span className="text-[12px] text-[#191919] mt-1 block">记支出</span>
        </button>
      </div>

      {/* Transactions */}
      <div className="mt-2">
        <div className="px-4 py-2 bg-[#EDEDED]">
          <span className="text-[13px] text-[#888888]">最近记录</span>
        </div>
        <div className="bg-white">
          {transactions.map((tx, idx) => (
            <div 
              key={tx.id}
              className={cn(
                "flex items-center px-4 py-3",
                idx !== transactions.length - 1 && "border-b border-[#F0F0F0]"
              )}
            >
              <div className={cn(
                "h-[40px] w-[40px] rounded-full flex items-center justify-center",
                tx.type === 'income' ? "bg-[#E8F8EE]" : "bg-[#FFEFEF]"
              )}>
                {tx.type === 'income' ? (
                  <ArrowDownCircle className="h-5 w-5 text-[#07C160]" />
                ) : (
                  <ArrowUpCircle className="h-5 w-5 text-[#FA5151]" />
                )}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-[16px] text-[#191919]">{tx.description}</p>
                <p className="text-[12px] text-[#B2B2B2] mt-0.5">{tx.project}</p>
              </div>
              <div className="text-right">
                <p className={cn(
                  "text-[16px] font-medium",
                  tx.type === 'income' ? "text-[#07C160]" : "text-[#191919]"
                )}>
                  {tx.type === 'income' ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}
                </p>
                <p className="text-[12px] text-[#B2B2B2]">{tx.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Accounting;