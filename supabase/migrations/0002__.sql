-- =============================================
-- 会话与消息系统
-- =============================================

CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 关联
    project_id UUID REFERENCES public.projects(id),
    virtual_number_id UUID REFERENCES public.virtual_numbers(id),
    
    -- 参与者
    participant_ids UUID[] NOT NULL,
    
    -- 会话类型
    type VARCHAR(20) DEFAULT 'direct' CHECK (type IN ('direct', 'sms', 'group')),
    
    -- 外部联系人 (SMS)
    external_phone VARCHAR(20),
    external_name VARCHAR(200),
    
    -- 元信息
    last_message_preview TEXT,
    last_message_at TIMESTAMPTZ,
    
    -- 未读计数
    unread_counts JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON public.conversations USING GIN (participant_ids);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON public.conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_virtual_number ON public.conversations(virtual_number_id);

-- 启用 RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- 会话策略
CREATE POLICY "conversations_select_participant" ON public.conversations
    FOR SELECT USING (auth.uid() = ANY(participant_ids));

CREATE POLICY "conversations_insert_participant" ON public.conversations
    FOR INSERT WITH CHECK (auth.uid() = ANY(participant_ids));

CREATE POLICY "conversations_update_participant" ON public.conversations
    FOR UPDATE USING (auth.uid() = ANY(participant_ids));

CREATE POLICY "conversations_delete_participant" ON public.conversations
    FOR DELETE USING (auth.uid() = ANY(participant_ids));

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();