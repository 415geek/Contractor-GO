/**
 * 临时认证解决方案
 * 直接使用 Supabase 客户端进行认证
 */

import { supabase } from '@/integrations/supabase/client';

// 简单的密码哈希（仅用于演示，生产环境应使用 bcrypt）
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

// 验证密码
const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
};

// 生成简单的 JWT token
const generateToken = (userId: string, role: string): string => {
  const payload = {
    user_id: userId,
    role: role,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  return btoa(JSON.stringify(payload));
};

// 注册
export const register = async (data: {
  phone?: string;
  email?: string;
  password: string;
  role: 'contractor' | 'client';
  display_name?: string;
  primary_language?: string;
  interface_language?: string;
}) => {
  try {
    // 检查用户是否已存在
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .or(`phone.eq.${data.phone},email.eq.${data.email}`)
      .single();

    if (existingUser) {
      throw new Error('用户已存在');
    }

    // 哈希密码
    const password_hash = await hashPassword(data.password);

    // 创建用户
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        phone: data.phone,
        email: data.email,
        password_hash,
        role: data.role,
        display_name: data.display_name || data.phone || data.email,
        primary_language: data.primary_language || 'zh-CN',
        interface_language: data.interface_language || 'zh-CN',
      })
      .select()
      .single();

    if (userError) {
      console.error('[supabaseAuth] Error creating user:', userError);
      throw new Error(userError.message || '创建用户失败');
    }

    // 生成 token
    const token = generateToken(userData.id, userData.role);

    // 保存 token
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify({
      id: userData.id,
      phone: userData.phone,
      email: userData.email,
      role: userData.role,
      display_name: userData.display_name,
      primary_language: userData.primary_language,
      interface_language: userData.interface_language,
    }));

    return {
      user: {
        id: userData.id,
        phone: userData.phone,
        email: userData.email,
        role: userData.role,
        display_name: userData.display_name,
        primary_language: userData.primary_language,
        interface_language: userData.interface_language,
      },
      token,
    };
  } catch (error: any) {
    console.error('[supabaseAuth] Register error:', error);
    throw error;
  }
};

// 登录
export const login = async (data: {
  phone?: string;
  email?: string;
  password: string;
}) => {
  try {
    // 查找用户
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .or(`phone.eq.${data.phone},email.eq.${data.email}`)
      .single();

    if (userError || !userData) {
      throw new Error('用户不存在');
    }

    // 验证密码
    const isValid = await verifyPassword(data.password, userData.password_hash);
    if (!isValid) {
      throw new Error('密码错误');
    }

    // 生成 token
    const token = generateToken(userData.id, userData.role);

    // 保存 token
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify({
      id: userData.id,
      phone: userData.phone,
      email: userData.email,
      role: userData.role,
      display_name: userData.display_name,
      primary_language: userData.primary_language,
      interface_language: userData.interface_language,
      avatar_url: userData.avatar_url,
      company_name: userData.company_name,
    }));

    return {
      user: {
        id: userData.id,
        phone: userData.phone,
        email: userData.email,
        role: userData.role,
        display_name: userData.display_name,
        primary_language: userData.primary_language,
        interface_language: userData.interface_language,
        avatar_url: userData.avatar_url,
        company_name: userData.company_name,
      },
      token,
    };
  } catch (error: any) {
    console.error('[supabaseAuth] Login error:', error);
    throw error;
  }
};

// 登出
export const logout = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
};

// 获取当前用户
export const getCurrentUser = () => {
  const userData = localStorage.getItem('user_data');
  if (!userData) return null;
  return JSON.parse(userData);
};

// 获取 token
export const getToken = () => {
  return localStorage.getItem('auth_token');
};