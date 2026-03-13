-- 删除现有的 INSERT 策略
DROP POLICY IF EXISTS "users_insert_own" ON public.users;

-- 创建新的 INSERT 策略，允许注册新用户
CREATE POLICY "users_insert_new" ON public.users
FOR INSERT
TO public
WITH CHECK (
  -- 允许匿名用户注册（auth.uid() 为 null）
  auth.uid() IS NULL OR
  -- 或者允许用户插入自己的数据
  auth.uid() = id
);

-- 添加注释
COMMENT ON POLICY "users_insert_new" ON public.users IS 'Allow new user registration';