-- 测试插入一个新用户
INSERT INTO public.users (
  phone,
  email,
  password_hash,
  role,
  display_name,
  primary_language,
  interface_language
) VALUES (
  '+14155550200',
  'test_registration@example.com',
  '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
  'contractor',
  '测试注册用户',
  'zh-CN',
  'zh-CN'
) ON CONFLICT (phone) DO NOTHING;

-- 查询验证
SELECT id, phone, email, role, display_name, created_at 
FROM public.users 
WHERE phone = '+14155550200';