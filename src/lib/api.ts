/**
 * ContractorLink API Client
 * 统一的API调用客户端
 */

const SUPABASE_DEFAULT_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://gkcjbcrjnjfibxbxubge.supabase.co';

// Default: Supabase Edge Functions
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || SUPABASE_DEFAULT_URL;

// Optional: self-hosted backend for stable outbound IP (e.g. VoIP.ms / Stripe)
const NUMBERS_API_BASE_URL = import.meta.env.VITE_NUMBERS_API_BASE_URL || API_BASE_URL;

const joinUrl = (base: string, path: string) => {
  const b = base.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
};

const buildApiUrl = (base: string, endpoint: string) => {
  // Backwards compatibility:
  // - Supabase Edge Functions live under /functions/v1
  // - Self-hosted backend usually exposes endpoints at root (e.g. /numbers-search)
  if (base.includes('supabase.co')) {
    return joinUrl(base, `/functions/v1${endpoint}`);
  }
  return joinUrl(base, endpoint);
};

// 获取存储的token
const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// 设置token
const setToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

// 清除token
const clearToken = () => {
  localStorage.removeItem('auth_token');
};

const parseResponse = async (response: Response) => {
  const text = await response.text();

  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  return { data, text };
};

// 通用请求函数（带 token）
const request = async (
  endpoint: string,
  options: RequestInit = {},
  baseUrl: string = API_BASE_URL,
): Promise<any> => {
  const token = getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = buildApiUrl(baseUrl, endpoint);

  console.log(`[API] Request: ${options.method || 'GET'} ${url}`);

  const response = await fetch(url, {
    ...options,
    headers,
  });

  console.log(`[API] Response status: ${response.status}`);

  const { data } = await parseResponse(response);
  console.log(`[API] Response data:`, data);

  if (!response.ok) {
    const message =
      (data && (data.error || data.details || data.message)) ||
      `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
};

// Public request helper (no Authorization header by default)
const requestPublic = async (
  endpoint: string,
  options: RequestInit = {},
  baseUrl: string = API_BASE_URL,
): Promise<any> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const url = buildApiUrl(baseUrl, endpoint);

  console.log(`[API] Public request: ${options.method || 'GET'} ${url}`);

  const response = await fetch(url, {
    ...options,
    headers,
  });

  console.log(`[API] Public response status: ${response.status}`);

  const { data } = await parseResponse(response);
  console.log(`[API] Public response data:`, data);

  if (!response.ok) {
    const message =
      (data && (data.error || data.details || data.message)) ||
      `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
};

// =============================================
// 号码（VoIP.ms）API
// =============================================

export const numbersAPI = {
  list: async (clerkToken: string) => {
    return requestPublic(
      '/numbers-list',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${clerkToken}`,
        },
      },
      NUMBERS_API_BASE_URL,
    );
  },

  search: async (
    params: { areaCode?: string; state?: string; ratecenter?: string },
    clerkToken: string,
  ) => {
    const qs = new URLSearchParams();
    if (params.areaCode) qs.set('areaCode', params.areaCode);
    if (params.state) qs.set('state', params.state);
    if (params.ratecenter) qs.set('ratecenter', params.ratecenter);

    return requestPublic(
      `/numbers-search?${qs.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${clerkToken}`,
        },
      },
      NUMBERS_API_BASE_URL,
    );
  },

  purchase: async (
    data: { did: string; planType?: 'BASIC' | 'PRO' | 'BUSINESS'; packageName?: string; email?: string },
    clerkToken: string,
  ) => {
    return requestPublic(
      '/numbers-purchase',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${clerkToken}`,
        },
        body: JSON.stringify(data),
      },
      NUMBERS_API_BASE_URL,
    );
  },
};

// =============================================
// 认证 API
// =============================================

export const authAPI = {
  // 注册
  register: async (data: {
    phone?: string;
    email?: string;
    password: string;
    role: 'contractor' | 'client';
    display_name?: string;
    primary_language?: string;
    interface_language?: string;
  }) => {
    const result = await request('/auth-register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (result.token) {
      setToken(result.token);
    }

    return result;
  },

  // 登录
  login: async (data: {
    phone?: string;
    email?: string;
    password: string;
  }) => {
    const result = await request('/auth-login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (result.token) {
      setToken(result.token);
    }

    return result;
  },

  // 登出
  logout: () => {
    clearToken();
  },

  // 获取当前用户
  getCurrentUser: () => {
    const token = getToken();
    if (!token) return null;

    try {
      const decoded = JSON.parse(atob(token));
      return decoded;
    } catch {
      return null;
    }
  },
};

// =============================================
// 消息 API
// =============================================

export const messagesAPI = {
  // 获取会话列表
  getConversations: async () => {
    return request('/conversations-list');
  },

  // 获取消息列表
  getMessages: async (conversationId?: string, limit = 50, before?: string) => {
    const params = new URLSearchParams();
    if (conversationId) params.append('conversation_id', conversationId);
    params.append('limit', limit.toString());
    if (before) params.append('before', before);

    return request(`/messages-list?${params.toString()}`);
  },

  // 发送消息
  sendMessage: async (data: {
    conversation_id: string;
    content: string;
    type?: 'text' | 'voice' | 'image' | 'video' | 'file' | 'location' | 'invoice' | 'quote';
    target_language?: string;
  }) => {
    return request('/messages-send', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 标记消息已读
  markAsRead: async (messageIds: string[]) => {
    // TODO: Implement
    return Promise.resolve({});
  },
};

// =============================================
// 项目 API
// =============================================

export const projectsAPI = {
  // 获取项目列表
  getProjects: async (status?: string) => {
    const params = status ? `?status=${status}` : '';
    return request(`/projects-crud${params}`);
  },

  // 获取项目详情
  getProject: async (id: string) => {
    // TODO: Implement
    return Promise.resolve({});
  },

  // 创建项目
  createProject: async (data: {
    name: string;
    description?: string;
    project_type?: string;
    client_name?: string;
    client_phone?: string;
    client_email?: string;
    client_language?: string;
    address?: string;
    location?: string;
    estimated_start_date?: string;
    estimated_end_date?: string;
    estimated_budget_min?: number;
    estimated_budget_max?: number;
  }) => {
    return request('/projects-crud', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 更新项目
  updateProject: async (id: string, data: any) => {
    return request(`/projects-crud?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // 删除项目
  deleteProject: async (id: string) => {
    return request(`/projects-crud?id=${id}`, {
      method: 'DELETE',
    });
  },
};

// =============================================
// 发票 API
// =============================================

export const invoicesAPI = {
  // 获取发票列表
  getInvoices: async (status?: string, projectId?: string) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (projectId) params.append('project_id', projectId);

    return request(`/invoices-crud${params.toString() ? `?${params.toString()}` : ''}`);
  },

  // 获取发票详情
  getInvoice: async (id: string) => {
    // TODO: Implement
    return Promise.resolve({});
  },

  // 创建发票
  createInvoice: async (data: any) => {
    return request('/invoices-crud', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 更新发票
  updateInvoice: async (id: string, data: any) => {
    return request(`/invoices-crud?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // 删除发票
  deleteInvoice: async (id: string) => {
    return request(`/invoices-crud?id=${id}`, {
      method: 'DELETE',
    });
  },
};

// =============================================
// 虚拟号码 API
// =============================================

export const virtualNumbersAPI = {
  // 获取虚拟号码列表
  getNumbers: async () => {
    return request('/virtual-numbers-crud');
  },

  // 创建虚拟号码
  createNumber: async (data: any) => {
    return request('/virtual-numbers-crud', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 更新虚拟号码
  updateNumber: async (id: string, data: any) => {
    return request(`/virtual-numbers-crud?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // 删除虚拟号码
  deleteNumber: async (id: string) => {
    return request(`/virtual-numbers-crud?id=${id}`, {
      method: 'DELETE',
    });
  },

  // 发送SMS
  sendSMS: async (data: {
    virtual_number_id: string;
    to: string;
    text: string;
    media_urls?: string[];
  }) => {
    return request('/sms-send', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// =============================================
// 工具 API
// =============================================

export const toolsAPI = {
  // 材料识别
  materialRecognize: async (data: {
    images: string[];
  }) => {
    return requestPublic('/tools-material-recognize', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 材料比价
  materialCompare: async (data: {
    material: {
      category: string;
      type: string;
      brand: string;
      model: string;
      specifications: any;
    };
    location?: {
      city: string;
      lat: number;
      lng: number;
    };
    search_radius_km?: number;
  }) => {
    return requestPublic('/tools-material-compare', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 房屋估价
  houseEstimate: async (data: {
    image: string;
    areas?: Array<{
      name: string;
      sqft: number;
      condition: string;
    }>;
    quality?: 'economy' | 'standard' | 'premium';
    property_type?: 'residential' | 'commercial';
  }) => {
    return requestPublic('/tools-house-estimate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// 导出默认对象
export default {
  auth: authAPI,
  messages: messagesAPI,
  projects: projectsAPI,
  invoices: invoicesAPI,
  virtualNumbers: virtualNumbersAPI,
  tools: toolsAPI,
  numbers: numbersAPI,
  getToken,
  setToken,
  clearToken,
};