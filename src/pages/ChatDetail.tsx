"use client";

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MoreHorizontal, Mic, Smile, Plus, Keyboard } from 'lucide-react';
import { cn } from "@/lib/utils";

const ChatDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = React.useState('');
  const [isVoiceMode, setIsVoiceMode] = React.useState(false);

  const messages = [
    { 
      id: 1, 
      sender: 'client', 
      text: "Hi, when can you start the kitchen renovation?", 
      translated: "你好，你什么时候可以开始厨房装修？", 
      time: "10:00" 
    },
    { 
      id: 2, 
      sender: 'me', 
      text: "明天早上九点，我会带两个工人过去。", 
      translated: "I will be there tomorrow at 9:00 AM with two workers.", 
      time: "10:05" 
    },
    { 
      id: 3, 
      sender: 'client', 
      text: "Great. Please make sure to cover the floor.", 
      translated: "太好了。请务必把地板遮盖好。", 
      time: "10:06" 
    },
  ];

  return (
    <div className="min-h-screen bg-[#EDEDED] flex flex-col max-w-md mx-auto relative">
      {/* Header */}
      <header className="h-[44px] bg-[#EDEDED] flex items-center justify-between px-1 sticky top-0 z-50 border-b border-[#D9D9D9]">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center px-2 py-2 active:opacity-70"
        >
          <ChevronLeft className="h-6 w-6 text-[#191919]" />
          <span className="text-[#191919] text-[17px]">返回</span>
        </button>
        <h1 className="text-[17px] font-medium text-[#191919] absolute left-1/2 -translate-x-1/2">John Smith</h1>
        <button className="px-3 py-2 active:opacity-70">
          <MoreHorizontal className="h-6 w-6 text-[#191919]" />
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 pb-[60px]">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex", msg.sender === 'me' ? "justify-end" : "justify-start")}>
            <div className={cn("flex max-w-[80%]", msg.sender === 'me' ? "flex-row-reverse" : "flex-row")}>
              {/* Avatar */}
              <div className={cn(
                "h-[40px] w-[40px] rounded-md flex-shrink-0 flex items-center justify-center font-medium text-white",
                msg.sender === 'me' ? "bg-[#07C160] ml-2" : "bg-[#C4C4C4] mr-2"
              )}>
                {msg.sender === 'me' ? '我' : 'JS'}
              </div>
              
              {/* Message Bubble */}
              <div className="space-y-1">
                <div className={cn(
                  "px-3 py-2.5 rounded-md text-[16px] relative",
                  msg.sender === 'me' 
                    ? "bg-[#95EC69] text-[#191919]" 
                    : "bg-white text-[#191919]"
                )}>
                  {msg.text}
                  {/* Triangle */}
                  <div className={cn(
                    "absolute top-[12px] w-0 h-0 border-y-[6px] border-y-transparent",
                    msg.sender === 'me' 
                      ? "-right-[6px] border-l-[6px] border-l-[#95EC69]" 
                      : "-left-[6px] border-r-[6px] border-r-white"
                  )}></div>
                </div>
                
                {/* AI Translation */}
                <div className="bg-[#F5F5F5] rounded px-2 py-1.5 text-[12px] text-[#888888]">
                  <span className="text-[#07C160] font-medium">AI翻译: </span>
                  {msg.translated}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-[#F7F7F7] border-t border-[#D9D9D9] px-2 py-2 fixed bottom-0 left-0 right-0 max-w-md mx-auto safe-area-bottom">
        <div className="flex items-end space-x-2">
          <button 
            onClick={() => setIsVoiceMode(!isVoiceMode)}
            className="h-[36px] w-[36px] flex items-center justify-center active:opacity-70"
          >
            {isVoiceMode ? (
              <Keyboard className="h-6 w-6 text-[#191919]" />
            ) : (
              <Mic className="h-6 w-6 text-[#191919]" />
            )}
          </button>
          
          {isVoiceMode ? (
            <button className="flex-1 h-[36px] bg-white rounded-md flex items-center justify-center active:bg-[#C4C4C4]">
              <span className="text-[16px] text-[#191919]">按住 说话</span>
            </button>
          ) : (
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 h-[36px] bg-white rounded-md px-3 text-[16px] focus:outline-none"
              placeholder=""
            />
          )}
          
          <button className="h-[36px] w-[36px] flex items-center justify-center active:opacity-70">
            <Smile className="h-6 w-6 text-[#191919]" />
          </button>
          
          {input ? (
            <button className="h-[36px] px-4 bg-[#07C160] rounded-md flex items-center justify-center active:bg-[#06AE56]">
              <span className="text-[16px] text-white font-medium">发送</span>
            </button>
          ) : (
            <button className="h-[36px] w-[36px] flex items-center justify-center active:opacity-70">
              <Plus className="h-6 w-6 text-[#191919]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatDetail;