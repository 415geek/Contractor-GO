-- =============================================
-- 消息表
-- =============================================

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.users(id),
    
    -- 消息类型
    type VARCHAR(20) DEFAULT 'text' CHECK (type IN (
        'text', 'voice', 'image', 'video', 'file', 
        'location', 'contact', 'invoice', 'quote'
    )),
    
    -- 内容
    content_original TEXT,
    content_translated TEXT,
    original_language VARCHAR(10),
    target_language VARCHAR(10),
    
    -- 媒体
    media_url VARCHAR(500),
    media_type VARCHAR(100),
    media_size_bytes BIGINT,
    voice_duration_seconds INT,
    voice_transcription TEXT,
    
    -- 翻译元信息
    translation_confidence DECIMAL(3,2),
    
    -- 状态
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN (
        'sending', 'sent', 'delivered', 'read', 'failed'
    )),
    
    -- SMS特有
    is_sms BOOLEAN DEFAULT FALSE,
    sms_provider_message_id VARCHAR(100),
    
    -- 时间戳
    created_at TIMESTAMPTZ DEFAULT NOW(),
    read_at TIMESTAMPTZ
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_status ON public.messages(status);

-- 启用 RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 消息策略
CREATE POLICY "messages_select_conversation" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.conversations 
            WHERE conversations.id = messages.conversation_id
            AND auth.uid() = ANY(conversations.participant_ids)
        )
    );

CREATE POLICY "messages_insert_sender" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "messages_update_sender" ON public.messages
    FOR UPDATE USING (auth.uid() = sender_id);