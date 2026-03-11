"use client";

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MoreHorizontal, Send, Paperclip, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from "@/lib/utils";

const ChatDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = React.useState('');

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

  const currentChat = chats.find(chat => chat.id === id);

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* Header */}
      <header className="h-14 bg-background flex items-center justify-between px-4 sticky top-0 z-50 border-b">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-8 w-8 ml-2">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {currentChat?.avatar || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="ml-2">
            <h1 className="text-sm font-semibold">{currentChat?.name || 'Unknown'}</h1>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex", msg.sender === 'me' ? "justify-end" : "justify-start")}>
            <div className={cn("max-w-[80%]", msg.sender === 'me' ? "ml-auto" : "")}>
              {/* Message Bubble */}
              <div className={cn(
                "px-4 py-2 rounded-lg",
                msg.sender === 'me' 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-foreground"
              )}>
                <p className="text-sm">{msg.text}</p>
              </div>
              
              {/* AI Translation */}
              {msg.translated && (
                <div className="mt-1 px-2 py-1 bg-background border rounded text-xs text-muted-foreground">
                  <span className="text-primary font-medium">AI翻译: </span>
                  {msg.translated}
                </div>
              )}
              
              {/* Time */}
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-background">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Mic className="h-5 w-5" />
          </Button>
          <Input 
            placeholder="输入消息..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
          />
          <Button size="icon" disabled={!input}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Mock data for current chat
const chats = [
  { id: '1', name: 'John Smith', avatar: 'JS' },
  { id: '2', name: 'Mike Wilson', avatar: 'MW' },
  { id: '3', name: '材料供应商 - 老王', avatar: '王' },
];

export default ChatDetail;