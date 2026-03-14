-- 删除旧的插入策略
DROP POLICY IF EXISTS "users_insert_new" ON public.users;

-- 创建新的插入策略 - 允许所有插入（仅用于开发）
CREATE POLICY "users_insert_all" ON public.users
    FOR INSERT
    WITH CHECK (true);

-- 验证策略已创建
SELECT policyname, cmd, with_check
FROM pg_policies 
WHERE tablename = 'users' AND cmd = 'INSERT';