"use client";

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Mic, Smile, Plus, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ChatDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = React.useState('');

  const messages = [
    { id: 1, sender: 'client', text: "Hi, when can you start the kitchen renovation?", original: "Hi, when can you start the kitchen renovation?", translated: "你好，你什么时候可以开始厨房装修？", time: "10:00" },
    { id: 2, sender: 'me', text: "明天早上九点，我会带两个工人过去。", original: "明天早上九点，我会带两个工人过去。", translated: "I will be there tomorrow at 9:00 AM with two workers.", time: "10:05" },
    { id: 3, sender: 'client', text: "Great. Please make sure to cover the floor.", original: "Great. Please make sure to cover the floor.", translated: "太好了。请务必把地板遮盖好。", time: "10:06" },
  ];

  return (
    <div className="min-h-screen bg-[#ededed] flex flex-col max-w-md mx-auto shadow-2xl relative">
      {/* Header */}
      <header className="h-12 bg-[#ededed] flex items-center px-2 sticky top-0 z-50 border-b border-slate-200/50">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-6 w-6 text-slate-700" />
        </Button>
        <h1 className="flex-1 text-center text-[17px] font-semibold text-slate-900 mr-8">John Smith</h1>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex", msg.sender === 'me' ? "justify-end" : "justify-start")}>
            <div className={cn("flex max-w-[85%]", msg.sender === 'me' ? "flex-row-reverse" : "flex-row")}>
              <div className={cn("h-10 w-10 rounded-md flex-shrink-0 flex items-center justify-center font-bold", 
                msg.sender === 'me' ? "bg-indigo-600 text-white ml-2" : "bg-slate-300 text-slate-600 mr-2")}>
                {msg.sender === 'me' ? '我' : 'JS'}
              </div>
              <div className="space-y-1">
                <div className={cn("p-3 rounded-lg text-[15px] shadow-sm relative", 
                  msg.sender === 'me' ? "bg-[#95ec69] text-slate-900" : "bg-white text-slate-900")}>
                  {msg.text}
                  {/* Triangle pointer */}
                  <div className={cn("absolute top-3 w-0 h-0 border-y-[6px] border-y-transparent", 
                    msg.sender === 'me' ? "-right-2 border-l-[8px] border-l-[#95ec69]" : "-left-2 border-r-[8px] border-r-white")}></div>
                </div>
                {/* AI Translation Box */}
                <div className="bg-black/5 rounded-md p-2 text-[12px] text-slate-500 italic border border-slate-200">
                  <span className="font-bold text-[10px] text-indigo-600 block mb-1 uppercase tracking-wider">AI 意图翻译:</span>
                  {msg.translated}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area - WeChat Style */}
      <div className="bg-[#f7f7f7] border-t border-slate-200 p-2 fixed bottom-0 left-0 right-0 max-w-md mx-auto">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Mic className="h-6 w-6 text-slate-700" />
          </Button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-white border-none rounded-md h-9 px-3 text-[15px] focus:ring-0"
            placeholder=""
          />
          <Button variant="ghost" size="icon" className="rounded-full">
            <Smile className="h-6 w-6 text-slate-700" />
          </Button>
          {input ? (
            <Button className="bg-[#07c160] hover:bg-[#06ae56] text-white h-9 px-4 rounded-md">
              发送
            </Button>
          ) : (
            <Button variant="ghost" size="icon" className="rounded-full">
              <Plus className="h-6 w-6 text-slate-700" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatDetail;