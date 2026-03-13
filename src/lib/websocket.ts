/**
 * WebSocket 实时通讯管理器
 * 基于 Supabase Realtime 实现
 */

import { supabase } from '@/integrations/supabase/client';

export type WebSocketEventType = 
  | 'message:received'
  | 'message:sent'
  | 'message:read'
  | 'typing:start'
  | 'typing:stop'
  | 'presence:update'
  | 'conversation:updated';

export interface WebSocketEvent {
  type: WebSocketEventType;
  data: any;
  timestamp: number;
}

type EventCallback = (event: WebSocketEvent) => void;

class WebSocketManager {
  private connected: boolean = false;
  private listeners: Map<WebSocketEventType, Set<EventCallback>> = new Map();
  private subscriptions: any[] = [];

  /**
   * 连接到实时服务
   */
  async connect(): Promise<void> {
    if (this.connected) return;

    try {
      // 订阅消息表的变化
      const messagesSubscription = supabase
        .channel('messages_changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
          },
          (payload) => {
            this.handleMessageInsert(payload);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'messages',
          },
          (payload) => {
            this.handleMessageUpdate(payload);
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            this.connected = true;
            console.log('[WebSocket] Connected');
          }
        });

      this.subscriptions.push(messagesSubscription);

      // 订阅会话表的变化
      const conversationsSubscription = supabase
        .channel('conversations_changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'conversations',
          },
          (payload) => {
            this.handleConversationUpdate(payload);
          }
        )
        .subscribe();

      this.subscriptions.push(conversationsSubscription);

      // 订阅在线状态
      const presenceSubscription = supabase
        .channel('online_users')
        .on('presence', { event: 'sync' }, () => {
          this.handlePresenceSync();
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          this.handlePresenceJoin(key, newPresences);
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          this.handlePresenceLeave(key, leftPresences);
        })
        .subscribe((status) => {
          console.log('[WebSocket] Presence channel status:', status);
        });

      this.subscriptions.push(presenceSubscription);

    } catch (error) {
      console.error('[WebSocket] Connection error:', error);
      throw error;
    }
  }

  /**
   * 断开连接
   */
  async disconnect(): Promise<void> {
    this.subscriptions.forEach(subscription => {
      supabase.removeChannel(subscription);
    });
    this.subscriptions = [];
    this.connected = false;
    console.log('[WebSocket] Disconnected');
  }

  /**
   * 注册事件监听器
   */
  on(eventType: WebSocketEventType, callback: EventCallback): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);

    // 返回取消订阅函数
    return () => {
      this.listeners.get(eventType)?.delete(callback);
    };
  }

  /**
   * 触发事件
   */
  private emit(eventType: WebSocketEventType, data: any): void {
    const event: WebSocketEvent = {
      type: eventType,
      data,
      timestamp: Date.now(),
    };

    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error(`[WebSocket] Error in callback for ${eventType}:`, error);
        }
      });
    }
  }

  /**
   * 处理新消息插入
   */
  private async handleMessageInsert(payload: any): Promise<void> {
    const message = payload.new;
    
    // 获取发送者信息
    if (message.sender_id) {
      const { data: sender } = await supabase
        .from('users')
        .select('id, display_name, avatar_url')
        .eq('id', message.sender_id)
        .single();

      message.sender = sender;
    }

    this.emit('message:received', {
      conversation_id: message.conversation_id,
      message,
    });
  }

  /**
   * 处理消息更新
   */
  private handleMessageUpdate(payload: any): void {
    const message = payload.new;
    
    if (message.status === 'read') {
      this.emit('message:read', {
        message_id: message.id,
        conversation_id: message.conversation_id,
        read_at: message.read_at,
      });
    }
  }

  /**
   * 处理会话更新
   */
  private handleConversationUpdate(payload: any): void {
    const conversation = payload.new;
    
    this.emit('conversation:updated', {
      conversation_id: conversation.id,
      last_message_preview: conversation.last_message_preview,
      last_message_at: conversation.last_message_at,
      unread_counts: conversation.unread_counts,
    });
  }

  /**
   * 处理在线状态同步
   */
  private handlePresenceSync(): void {
    const state = supabase.channel('online_users').presenceState();
    this.emit('presence:update', {
      online_users: Object.keys(state),
    });
  }

  /**
   * 处理用户上线
   */
  private handlePresenceJoin(key: string, newPresences: any[]): void {
    newPresences.forEach(presence => {
      this.emit('presence:update', {
        user_id: key,
        status: 'online',
        user: presence,
      });
    });
  }

  /**
   * 处理用户下线
   */
  private handlePresenceLeave(key: string, leftPresences: any[]): void {
    leftPresences.forEach(presence => {
      this.emit('presence:update', {
        user_id: key,
        status: 'offline',
        user: presence,
      });
    });
  }

  /**
   * 设置用户在线状态
   */
  async setOnlineStatus(userId: string, status: 'online' | 'offline' | 'away'): Promise<void> {
    const channel = supabase.channel('online_users');
    
    if (status === 'online') {
      await channel.track({
        user_id: userId,
        online_at: new Date().toISOString(),
      });
    } else {
      await channel.untrack();
    }
  }

  /**
   * 发送输入状态
   */
  async sendTypingStatus(conversationId: string, isTyping: boolean): Promise<void> {
    // 使用 presence channel 发送输入状态
    const channel = supabase.channel(`typing_${conversationId}`);
    
    if (isTyping) {
      await channel.track({
        conversation_id: conversationId,
        typing: true,
        timestamp: new Date().toISOString(),
      });
    } else {
      await channel.untrack();
    }
  }

  /**
   * 订阅会话的输入状态
   */
  subscribeTypingStatus(conversationId: string, callback: (userId: string, isTyping: boolean) => void): () => void {
    const channel = supabase.channel(`typing_${conversationId}`);
    
    const subscription = channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        Object.entries(state).forEach(([userId, presences]) => {
          const isTyping = presences.some((p: any) => p.typing);
          if (isTyping) {
            callback(userId, true);
          }
        });
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        const isTyping = newPresences.some((p: any) => p.typing);
        if (isTyping) {
          callback(key, true);
        }
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        callback(key, false);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  /**
   * 获取连接状态
   */
  isConnected(): boolean {
    return this.connected;
  }
}

// 导出单例
export const websocketManager = new WebSocketManager();

// 导出类型
export type { WebSocketManager };