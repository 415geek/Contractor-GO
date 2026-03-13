/**
 * ContractorLink V2.0 设计系统配置
 * 
 * 基于研发提示词文档的设计规范
 */

export const designSystem = {
  // 色彩系统
  colors: {
    primary: '#FF6B35',      // 建筑橙
    primaryLight: '#FF8F66',
    primaryDark: '#E85A2A',
    secondary: '#1E3A5F',    // 深蓝
    secondaryLight: '#2D5A8A',
    success: '#10B981',      // 翻译成功、项目完成
    warning: '#F59E0B',      // 待处理、进行中
    error: '#EF4444',        // 错误、删除
    info: '#3B82F6',         // 信息提示
    
    // 中性色
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray500: '#6B7280',
    gray700: '#374151',
    gray900: '#111827',
    
    // 消息气泡
    bubbleSent: '#FF6B35',
    bubbleReceived: '#FFFFFF',
    bubbleTranslated: '#E8F5E9',
  },
  
  // 字体系统
  fonts: {
    display: "'Plus Jakarta Sans', 'SF Pro Display', sans-serif",
    body: "'Inter', 'SF Pro Text', system-ui, sans-serif",
    chinese: "'PingFang SC', 'Noto Sans SC', 'Microsoft YaHei', sans-serif",
    latin: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    mono: "'JetBrains Mono', 'SF Mono', 'Consolas', monospace",
  },
  
  // 字体尺寸
  fontSizes: {
    xs: '12px',    // 辅助信息
    sm: '14px',    // 次要内容
    base: '16px',  // 正文
    lg: '18px',    // 强调正文
    xl: '20px',    // 小标题
    '2xl': '24px', // 标题
    '3xl': '30px', // 大标题
    '4xl': '36px', // 超大标题
  },
  
  // 行高
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // 间距系统 (8px 基础网格)
  spacing: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
  },
  
  // 圆角
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  
  // 阴影
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px -1px rgba(0,0,0,0.1)',
    lg: '0 10px 15px -3px rgba(0,0,0,0.1)',
    xl: '0 20px 25px -5px rgba(0,0,0,0.1)',
  },
  
  // 按钮尺寸
  buttonSizes: {
    large: {
      height: '56px',
      padding: '0 32px',
      fontSize: '18px',
    },
    medium: {
      height: '48px',
      padding: '0 24px',
      fontSize: '16px',
    },
    small: {
      height: '40px',
      padding: '0 16px',
      fontSize: '14px',
    },
  },
  
  // 输入框尺寸
  inputSizes: {
    large: {
      height: '56px',
      fontSize: '16px',
    },
    medium: {
      height: '48px',
      fontSize: '14px',
    },
  },
  
  // 动画时长
  durations: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  
  // 缓动函数
  easings: {
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// 支持的语言列表
export const supportedLanguages = [
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳', tier: 1 },
  { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼', tier: 1 },
  { code: 'en-US', name: 'English', flag: '🇺🇸', tier: 1 },
  { code: 'es', name: 'Español', flag: '🇪🇸', tier: 1 },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳', tier: 2 },
  { code: 'ko', name: '한국어', flag: '🇰🇷', tier: 2 },
  { code: 'tl', name: 'Tagalog', flag: '🇵🇭', tier: 2 },
  { code: 'pt-BR', name: 'Português', flag: '🇧🇷', tier: 2 },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', tier: 2 },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', tier: 2 },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', tier: 2 },
  { code: 'ja', name: '日本語', flag: '🇯🇵', tier: 2 },
];

// 服务类型
export const serviceTypes = [
  { id: 'kitchen_remodel', name: '全屋装修', icon: '🏠' },
  { id: 'kitchen', name: '厨房翻新', icon: '🍳' },
  { id: 'bathroom', name: '浴室改造', icon: '🚿' },
  { id: 'flooring', name: '地板安装', icon: '🪵' },
  { id: 'painting', name: '油漆粉刷', icon: '🎨' },
  { id: 'plumbing', name: '水电维修', icon: '🔧' },
  { id: 'roofing', name: '屋顶维护', icon: '🏠' },
  { id: 'windows', name: '门窗安装', icon: '🪟' },
  { id: 'other', name: '其他', icon: '📋' },
];

// 虚拟号码套餐
export const numberPlans = [
  {
    id: 'basic',
    name: '基础套餐',
    price: 5,
    features: [
      '无限接收短信',
      '100条发送短信/月',
      '自动翻译',
    ],
  },
  {
    id: 'professional',
    name: '专业套餐',
    price: 15,
    recommended: true,
    features: [
      '无限收发短信',
      'MMS图片/视频',
      '自动翻译',
      '语音通话 (即将推出)',
    ],
  },
];

// 常用区号
export const popularAreaCodes = [
  { code: '415', city: '旧金山' },
  { code: '650', city: '硅谷' },
  { code: '510', city: '奥克兰' },
  { code: '408', city: '圣何塞' },
  { code: '925', city: '东湾' },
  { code: '707', city: '北湾' },
];

// 项目状态
export const projectStatuses = {
  lead: { label: '潜在客户', color: 'gray' },
  negotiating: { label: '洽谈中', color: 'blue' },
  quoted: { label: '已报价', color: 'yellow' },
  contracted: { label: '已签约', color: 'orange' },
  in_progress: { label: '进行中', color: 'primary' },
  completed: { label: '已完工', color: 'green' },
  cancelled: { label: '已取消', color: 'red' },
};

// 发票状态
export const invoiceStatuses = {
  draft: { label: '草稿', color: 'gray' },
  sent: { label: '已发送', color: 'blue' },
  viewed: { label: '已查看', color: 'yellow' },
  paid: { label: '已付款', color: 'green' },
  overdue: { label: '逾期', color: 'red' },
  cancelled: { label: '已取消', color: 'gray' },
};

// 付款方式
export const paymentMethods = [
  { id: 'zelle', name: 'Zelle', icon: '💳' },
  { id: 'check', name: 'Check', icon: '📝' },
  { id: 'cash', name: 'Cash', icon: '💵' },
  { id: 'venmo', name: 'Venmo', icon: '💙' },
];

// 工具列表
export const tools = [
  {
    id: 'material_compare',
    name: '材料比价',
    description: '拍照识别，全网比价',
    icon: '📸',
    route: '/material-search',
    category: 'common',
  },
  {
    id: 'house_estimate',
    name: '房屋估价',
    description: 'AI分析，智能估价',
    icon: '🏠',
    route: '/cost-estimate',
    category: 'common',
  },
  {
    id: 'invoice',
    name: '发票管理',
    description: '查看历史发票',
    icon: '🧾',
    route: '/accounting',
    category: 'common',
  },
  {
    id: 'quote',
    name: '报价单',
    description: '创建报价模板',
    icon: '📊',
    route: '/projects',
    category: 'common',
  },
  {
    id: 'measure',
    name: '测量工具',
    description: 'AR测量',
    icon: '📐',
    route: '/tools/measure',
    category: 'more',
  },
  {
    id: 'schedule',
    name: '日程管理',
    description: '项目排期',
    icon: '📅',
    route: '/tools/schedule',
    category: 'more',
  },
  {
    id: 'documents',
    name: '文档管理',
    description: '合同存档',
    icon: '📁',
    route: '/tools/documents',
    category: 'more',
  },
  {
    id: 'finance',
    name: '收支记录',
    description: '财务统计',
    icon: '💰',
    route: '/accounting',
    category: 'more',
  },
];

// 底部导航配置
export const bottomNavItems = [
  { id: 'dashboard', label: '首页', icon: 'LayoutDashboard', route: '/dashboard' },
  { id: 'messages', label: '消息', icon: 'MessageSquare', route: '/messages' },
  { id: 'projects', label: '项目', icon: 'Folder', route: '/projects' },
  { id: 'tools', label: '工具', icon: 'Wrench', route: '/tools' },
  { id: 'profile', label: '我的', icon: 'User', route: '/profile' },
];

export default designSystem;