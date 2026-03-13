-- =============================================
-- 发票系统
-- =============================================

CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 关联
    contractor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.users(id),
    project_id UUID REFERENCES public.projects(id),
    conversation_id UUID REFERENCES public.conversations(id),
    message_id UUID REFERENCES public.messages(id),
    
    -- 发票编号
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- 客户信息
    client_name VARCHAR(200),
    client_email VARCHAR(255),
    client_address TEXT,
    
    -- 发票状态
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN (
        'draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled'
    )),
    
    -- 金额
    subtotal DECIMAL(12,2) NOT NULL,
    tax_rate DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    total DECIMAL(12,2) NOT NULL,
    
    -- 日期
    issue_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    paid_date DATE,
    
    -- 付款方式
    payment_methods TEXT[],
    payment_instructions TEXT,
    
    -- 备注
    notes TEXT,
    terms TEXT,
    
    -- 语言版本
    language VARCHAR(10) DEFAULT 'en-US',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_invoices_contractor ON public.invoices(contractor_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON public.invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_project ON public.invoices(project_id);

-- 启用 RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- 发票策略
CREATE POLICY "invoices_select_own" ON public.invoices
    FOR SELECT USING (auth.uid() = contractor_id);

CREATE POLICY "invoices_insert_own" ON public.invoices
    FOR INSERT WITH CHECK (auth.uid() = contractor_id);

CREATE POLICY "invoices_update_own" ON public.invoices
    FOR UPDATE USING (auth.uid() = contractor_id);

CREATE POLICY "invoices_delete_own" ON public.invoices
    FOR DELETE USING (auth.uid() = contractor_id);

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 发票项目表
CREATE TABLE IF NOT EXISTS public.invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    
    -- 项目信息
    description TEXT NOT NULL,
    description_translated TEXT,
    
    quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
    unit VARCHAR(50),
    unit_price DECIMAL(12,2) NOT NULL,
    
    -- 计算字段
    subtotal DECIMAL(12,2) NOT NULL,
    
    -- 排序
    sort_order INT DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON public.invoice_items(invoice_id);

-- 启用 RLS
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- 发票项目策略
CREATE POLICY "invoice_items_select_via_invoice" ON public.invoice_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.invoices 
            WHERE invoices.id = invoice_items.invoice_id
            AND auth.uid() = invoices.contractor_id
        )
    );

CREATE POLICY "invoice_items_insert_via_invoice" ON public.invoice_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.invoices 
            WHERE invoices.id = invoice_items.invoice_id
            AND auth.uid() = invoices.contractor_id
        )
    );

CREATE POLICY "invoice_items_update_via_invoice" ON public.invoice_items
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.invoices 
            WHERE invoices.id = invoice_items.invoice_id
            AND auth.uid() = invoices.contractor_id
        )
    );

CREATE POLICY "invoice_items_delete_via_invoice" ON public.invoice_items
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.invoices 
            WHERE invoices.id = invoice_items.invoice_id
            AND auth.uid() = invoices.contractor_id
        )
    );

-- 创建发票编号生成函数
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
        NEW.invoice_number := 'INV-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('invoice_number_seq')::TEXT, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建序列
CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 1;

-- 添加触发器
CREATE TRIGGER generate_invoice_number_trigger BEFORE INSERT ON public.invoices
    FOR EACH ROW EXECUTE FUNCTION public.generate_invoice_number();