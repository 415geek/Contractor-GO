-- =============================================
-- 虚拟号码系统
-- =============================================

CREATE TABLE IF NOT EXISTS public.virtual_numbers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- 号码信息
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    area_code VARCHAR(10),
    country_code VARCHAR(5) DEFAULT '+1',
    
    -- 提供商信息
    provider VARCHAR(50) DEFAULT 'telnyx',
    provider_number_id VARCHAR(100),
    
    -- 套餐与状态
    plan_type VARCHAR(20) DEFAULT 'basic' CHECK (plan_type IN ('basic', 'professional')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'released')),
    
    -- 计费
    monthly_cost DECIMAL(10,2) DEFAULT 5.00,
    next_billing_date DATE,
    
    -- 使用统计
    messages_sent_this_month INT DEFAULT 0,
    messages_received_this_month INT DEFAULT 0,
    
    -- 时间戳
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_virtual_numbers_user ON public.virtual_numbers(user_id);
CREATE INDEX IF NOT EXISTS idx_virtual_numbers_phone ON public.virtual_numbers(phone_number);
CREATE INDEX IF NOT EXISTS idx_virtual_numbers_status ON public.virtual_numbers(status);

-- 启用 RLS
ALTER TABLE public.virtual_numbers ENABLE ROW LEVEL SECURITY;

-- 虚拟号码策略
CREATE POLICY "virtual_numbers_select_own" ON public.virtual_numbers
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "virtual_numbers_insert_own" ON public.virtual_numbers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "virtual_numbers_update_own" ON public.virtual_numbers
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "virtual_numbers_delete_own" ON public.virtual_numbers
    FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_virtual_numbers_updated_at BEFORE UPDATE ON public.virtual_numbers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();