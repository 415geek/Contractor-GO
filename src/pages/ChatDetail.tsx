"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, MoreHorizontal, Send, Paperclip, Mic, Phone,
  Video, Info, Globe, Copy, Reply, Trash2, ChevronDown, ChevronUp,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { messagesAPI } from '@/lib/api';
import { useMessagesWebSocket } from '@/hooks/useWebSocket';
import { useUser } from '@clerk/clerk-react';

const ChatDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [input, setInput] = useState('');
  const [expandedMessages, setExpandedMessages] = useState<Set<number>>(new Set());
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // WebSocket hooks
  const { newMessage, messageRead, typingUsers, sendTypingStatus } = useMessagesWebSocket(id);

  // 加载消息
  useEffect(() => {
    loadMessages();
  }, [id]);

  // 处理新消息
  useEffect(() => {
    if (newMessage) {
      setMessages(prev => [...prev, newMessage]);
      scrollToBottom();
    }
  }, [newMessage]);

  // 处理消息已读
  useEffect(() => {
    if (messageRead) {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageRead.message_id
            ? { ...msg, status: 'read', read_at: messageRead.read_at }
            : msg
        )
      );
    }
  }, [messageRead]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const result = await messagesAPI.getMessages(id);
      setMessages(result.messages || []);
      scrollToBottom();
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleMessageExpand = (msgId: number) => {
    setExpandedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(msgId)) {
        newSet.delete(msgId);
      } else {
        newSet.add(msgId);
      }
      return newSet;
    });
  };

  const handleSendMessage = async () => {
    if (!input.trim() || sending) return;

    try {
      setSending(true);
      const result = await messagesAPI.sendMessage({
        conversation_id: id!,
        content: input.trim(),
        type: 'text',
      });

      setMessages(prev => [...prev, result.message]);
      setInput('');
      scrollToBottom();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    // 发送输入状态
    sendTypingStatus(true);
  };

  // 停止输入状态
  useEffect(() => {
    const timer = setTimeout(() => {
      if (input.trim() === '') {
        sendTypingStatus(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [input, sendTypingStatus]);

  const currentChat = chats.find(chat => chat.id === id);

  return (
    <div className="min-h-screen bg-background flex flex-col mx-auto md:shadow-2xl md:max-w-4xl md:flex-row">
      {/* Chat Sidebar - Desktop Only */}
      <div className="hidden md:flex md:w-80 md:border-r md:flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-foreground">对话列表</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => navigate(`/chat/${chat.id}`)}
              className={cn(
                "flex items-center p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                chat.id === id && "bg-muted"
              )}
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {chat.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <h3 className="font-medium text-foreground">{chat.name}</h3>
                <p className="text-xs text-muted-foreground truncate">最后消息...</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col max-w-md mx-auto md:max-w-none md:mx-0">
        {/* Header */}
        <header className="h-14 md:h-16 bg-background flex items-center justify-between px-4 sticky top-0 z-50 border-b">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="md:hidden">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Avatar className="h-9 w-9 ml-2">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {currentChat?.avatar || '?'}
              </AvatarFallback>
            </Avatar>
            <div className="ml-2">
              <div className="flex items-center gap-2">
                <h1 className="text-sm md:text-base font-semibold">{currentChat?.name || 'Unknown'}</h1>
                <Badge variant="outline" className="text-xs h-5">
                  🇺🇸 → 🇨🇳
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {typingUsers.size > 0 ? '正在输入...' : '在线'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1 md:space-x-2">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Video className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Info className="h-4 w-4 mr-2" />
                  查看详情
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="h-4 w-4 mr-2" />
                  复制对话
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  删除对话
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 md:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            messages.map((msg) => {
              const isExpanded = expandedMessages.has(msg.id);
              const isMe = msg.sender_id === user?.id;
              
              return (
                <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                  <div className={cn("max-w-[85%] md:max-w-[70%]", isMe ? "ml-auto" : "")}>
                    {/* Message Bubble */}
                    <div className={cn(
                      "px-4 py-3 rounded-2xl",
                      isMe 
                        ? "message-bubble-sent text-white" 
                        : "message-bubble-received text-foreground"
                    )}>
                      <p className="text-sm md:text-base leading-relaxed">{msg.content_original}</p>
                    </div>
                    
                    {/* Translation Section */}
                    {msg.content_translated && msg.content_translated !== msg.content_original && (
                      <div 
                        className={cn(
                          "mt-1 px-3 py-2 rounded-xl transition-all",
                          isMe ? "bg-primary/5" : "message-bubble-translated"
                        )}
                      >
                        <div 
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() => toggleMessageExpand(msg.id)}
                        >
                          <Globe className="h-3 w-3 text-primary" />
                          <span className="text-xs font-medium text-primary">AI翻译</span>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span>{msg.original_language}</span>
                            <span>→</span>
                            <span>{msg.target_language}</span>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="h-3 w-3 text-muted-foreground ml-auto" />
                          ) : (
                            <ChevronDown className="h-3 w-3 text-muted-foreground ml-auto" />
                          )}
                        </div>
                        
                        <p className={cn(
                          "text-sm mt-1 text-muted-foreground",
                          !isExpanded && "truncate"
                        )}>
                          {msg.content_translated}
                        </p>
                      </div>
                    )}
                    
                    {/* Time */}
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {isMe && msg.status === 'read' && (
                        <span className="text-xs text-primary">已读</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-background md:px-6">
          {/* Translation Preview */}
          {input && (
            <div className="mb-2 px-3 py-2 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Globe className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium text-primary">翻译预览</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {input.length > 0 ? 'Translation preview will appear here...' : ''}
              </p>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Paperclip className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>
                  📷 拍照
                </DropdownMenuItem>
                <DropdownMenuItem>
                  🖼️ 相册
                </DropdownMenuItem>
                <DropdownMenuItem>
                  📹 视频
                </DropdownMenuItem>
                <DropdownMenuItem>
                  📄 文件
                </DropdownMenuItem>
                <DropdownMenuItem>
                  📍 位置
                </DropdownMenuItem>
                <DropdownMenuItem>
                  🧾 发票
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Mic className="h-5 w-5" />
            </Button>
            
            <Input 
              ref={inputRef}
              placeholder="输入消息..."
              value={input}
              onChange={handleInputChange}
              className="flex-1 h-10"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && input.trim()) {
                  handleSendMessage();
                }
              }}
            />
            
            <Button 
              size="icon" 
              className="h-10 w-10"
              disabled={!input.trim() || sending}
              onClick={handleSendMessage}
            >
              {sending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
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