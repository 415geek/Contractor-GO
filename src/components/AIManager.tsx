"use client";

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  ChevronDown,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'analysis' | 'suggestion' | 'alert';
  data?: any;
}

interface Suggestion {
  id: string;
  title: string;
  description: string;
  impact: string;
  confidence: number;
  actionType: 'adjustment' | 'order' | 'schedule';
  parameters?: any;
}

export const AIManager = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(input),
        sender: 'ai',
        timestamp: new Date(),
        type: 'analysis'
      };

      setMessages(prev => [...prev, aiResponse]);
      
      // Add sample suggestions
      if (input.toLowerCase().includes('today') || input.toLowerCase().includes('business')) {
        setSuggestions([
          {
            id: '1',
            title: 'Optimize Evening Staffing',
            description: 'Reduce evening shift by 1 server based on current reservation patterns',
            impact: 'Save $120 in labor costs tonight',
            confidence: 0.85,
            actionType: 'schedule'
          },
          {
            id: '2',
            title: 'Promote High-Margin Items',
            description: 'Feature truffle fries and craft cocktails on special tonight',
            impact: 'Increase margin by 3-5% on evening sales',
            confidence: 0.78,
            actionType: 'adjustment'
          }
        ]);
      }
    }, 1000);
  };

  const generateAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('today') || lowerQuery.includes('business')) {
      return "Today's business is looking strong! Sales are 12% above forecast with 89 orders so far. Labor costs are within target at 18.5%. I've identified a couple of optimization opportunities for this evening.";
    }
    
    if (lowerQuery.includes('inventory') || lowerQuery.includes('stock')) {
      return "Inventory status: Beef patties are running low (2 days left), lettuce is at optimal levels, and truffle oil needs restocking. I recommend placing an order for beef patties and truffle oil today.";
    }
    
    if (lowerQuery.includes('menu') || lowerQuery.includes('items')) {
      return "Menu performance: Signature Burger is your top seller (28 orders), followed by Truffle Fries (24 orders). Craft cocktails have the highest margin at 78%. Consider promoting these high-margin items during peak hours.";
    }
    
    return "I'm here to help you optimize your restaurant operations. You can ask me about today's performance, inventory levels, menu items, staffing, or any other aspect of your business.";
  };

  const handleExecuteSuggestion = (suggestion: Suggestion) => {
    // Implementation for executing suggestions would go here
    console.log('Executing suggestion:', suggestion);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg hover:shadow-xl transition-all"
      >
        {isOpen ? (
          <ChevronDown className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6" />
        )}
      </Button>

      {/* Chat Interface */}
      {isOpen && (
        <Card className="w-80 h-96 absolute bottom-16 right-0 shadow-2xl border-0">
          <CardHeader className="pb-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            <CardTitle className="flex items-center text-sm">
              <Bot className="h-4 w-4 mr-2" />
              AI Restaurant Manager
              <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
                Online
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0 h-full flex flex-col">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex flex-col",
                    message.sender === 'user' ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-lg px-3 py-2 max-w-[80%]",
                      message.sender === 'user'
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-3 border-t">
                <p className="text-xs font-medium text-gray-500 mb-2">Suggestions</p>
                <div className="space-y-2">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="bg-amber-50 border border-amber-200 rounded-lg p-2"
                    >
                      <div className="flex items-start">
                        <TrendingUp className="h-3 w-3 text-amber-600 mt-0.5 mr-2" />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-amber-800">{suggestion.title}</p>
                          <p className="text-xs text-amber-600">{suggestion.description}</p>
                          <p className="text-xs text-amber-700 font-medium mt-1">{suggestion.impact}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="w-full mt-2 bg-amber-600 hover:bg-amber-700 text-xs h-6"
                        onClick={() => handleExecuteSuggestion(suggestion)}
                      >
                        Execute
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-3 border-t">
              <div className="flex space-x-2">
                <Input
                  placeholder="Ask me anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};