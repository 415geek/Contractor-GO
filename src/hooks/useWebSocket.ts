/**
 * WebSocket React Hook
 * 提供便捷的 WebSocket 功能访问
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { websocketManager, WebSocketEventType, WebSocketEvent } from '@/lib/websocket';

export interface UseWebSocketOptions {
  autoConnect?: boolean;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { autoConnect = true } = options;
  const [connected, setConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<WebSocketEvent | null>(null);
  const listenersRef = useRef<Map<WebSocketEventType, () => void>>(new Map());

  // 连接到 WebSocket
  useEffect(() => {
    if (autoConnect) {
      websocketManager.connect().then(() => {
        setConnected(true);
      }).catch((error) => {
        console.error('[useWebSocket] Failed to connect:', error);
      });
    }

    return () => {
      websocketManager.disconnect();
      setConnected(false);
    };
  }, [autoConnect]);

  // 监听所有事件
  useEffect(() => {
    const handleEvent = (event: WebSocketEvent) => {
      setLastEvent(event);
    };

    const unsubscribe = websocketManager.on('message:received', handleEvent);
    const unsubscribe2 = websocketManager.on('message:read', handleEvent);
    const unsubscribe3 = websocketManager.on('conversation:updated', handleEvent);
    const unsubscribe4 = websocketManager.on('presence:update', handleEvent);

    return () => {
      unsubscribe();
      unsubscribe2();
      unsubscribe3();
      unsubscribe4();
    };
  }, []);

  // 监听特定事件
  const on = useCallback((eventType: WebSocketEventType, callback: (event: WebSocketEvent) => void) => {
    const unsubscribe = websocketManager.on(eventType, callback);
    
    // 保存取消函数以便清理
    if (!listenersRef.current.has(eventType)) {
      listenersRef.current.set(eventType, unsubscribe);
    }

    return unsubscribe;
  }, []);

  // 发送输入状态
  const sendTypingStatus = useCallback(async (conversationId: string, isTyping: boolean) => {
    await websocketManager.sendTypingStatus(conversationId, isTyping);
  }, []);

  // 设置在线状态
  const setOnlineStatus = useCallback(async (status: 'online' | 'offline' | 'away') => {
    // 需要用户ID，这里暂时不实现
    // 实际使用时需要从认证上下文获取
  }, []);

  // 订阅输入状态
  const subscribeTypingStatus = useCallback((conversationId: string, callback: (userId: string, isTyping: boolean) => void) => {
    return websocketManager.subscribeTypingStatus(conversationId, callback);
  }, []);

  return {
    connected,
    lastEvent,
    on,
    sendTypingStatus,
    setOnlineStatus,
    subscribeTypingStatus,
    isConnected: () => websocketManager.isConnected(),
  };
}

/**
 * 专门用于消息的 Hook
 */
export function useMessagesWebSocket(conversationId?: string) {
  const [newMessage, setNewMessage] = useState<any>(null);
  const [messageRead, setMessageRead] = useState<any>(null);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!conversationId) return;

    // 监听新消息
    const unsubscribe1 = websocketManager.on('message:received', (event) => {
      if (event.data.conversation_id === conversationId) {
        setNewMessage(event.data.message);
      }
    });

    // 监听消息已读
    const unsubscribe2 = websocketManager.on('message:read', (event) => {
      if (event.data.conversation_id === conversationId) {
        setMessageRead(event.data);
      }
    });

    // 订阅输入状态
    const unsubscribe3 = websocketManager.subscribeTypingStatus(
      conversationId,
      (userId, isTyping) => {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          if (isTyping) {
            newSet.add(userId);
          } else {
            newSet.delete(userId);
          }
          return newSet;
        });
      }
    );

    return () => {
      unsubscribe1();
      unsubscribe2();
      unsubscribe3();
    };
  }, [conversationId]);

  const sendTypingStatus = async (isTyping: boolean) => {
    if (conversationId) {
      await websocketManager.sendTypingStatus(conversationId, isTyping);
    }
  };

  return {
    newMessage,
    messageRead,
    typingUsers,
    sendTypingStatus,
  };
}

/**
 * 用于会话列表的 Hook
 */
export function useConversationsWebSocket() {
  const [updatedConversation, setUpdatedConversation] = useState<any>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    // 监听会话更新
    const unsubscribe1 = websocketManager.on('conversation:updated', (event) => {
      setUpdatedConversation(event.data);
    });

    // 监听在线状态
    const unsubscribe2 = websocketManager.on('presence:update', (event) => {
      if (event.data.online_users) {
        setOnlineUsers(new Set(event.data.online_users));
      } else if (event.data.user_id) {
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          if (event.data.status === 'online') {
            newSet.add(event.data.user_id);
          } else {
            newSet.delete(event.data.user_id);
          }
          return newSet;
        });
      }
    });

    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, []);

  return {
    updatedConversation,
    onlineUsers,
  };
}