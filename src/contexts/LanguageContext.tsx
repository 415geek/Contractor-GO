"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supportedLanguages } from '@/lib/design-system';

type LanguageCode = typeof supportedLanguages[0]['code'];

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  availableLanguages: typeof supportedLanguages;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 翻译字典
const translations: Record<string, Record<string, string>> = {
  'zh-CN': {
    // 通用
    'app.name': 'ContractorLink',
    'app.tagline': '跨越语言，连接信任',
    
    // 导航
    'nav.home': '首页',
    'nav.messages': '消息',
    'nav.projects': '项目',
    'nav.tools': '工具',
    'nav.profile': '我的',
    
    // Dashboard
    'dashboard.title': '首页',
    'dashboard.good_morning': '早上好',
    'dashboard.good_afternoon': '下午好',
    'dashboard.good_evening': '晚上好',
    'dashboard.welcome_message': '今天是个好日子，继续加油！',
    'dashboard.active_projects': '进行中项目',
    'dashboard.monthly_revenue': '本月收入',
    'dashboard.pending_invoices': '待收款',
    'dashboard.completed': '已完成',
    'dashboard.recent_messages': '最近消息',
    'dashboard.active_projects_title': '进行中的项目',
    'dashboard.pending_invoices_title': '待处理发票',
    'dashboard.view_all': '查看全部',
    'dashboard.new_project': '新项目',
    'dashboard.new_message': '发消息',
    'dashboard.invoice': '发票',
    'dashboard.compare': '比价',
    'dashboard.send_reminder': '发送提醒',
    'dashboard.days_remaining': '天后',
    'dashboard.estimated_completion': '预计完成',
    
    // 消息
    'messages.title': '消息',
    'messages.search_placeholder': '搜索消息或联系人...',
    'messages.virtual_number': '虚拟号码消息',
    'messages.new_messages': '新消息',
    'messages.all': '全部',
    'messages.unread': '未读',
    'messages.client': '客户',
    'messages.supplier': '供应商',
    'messages.new_conversation': '新对话',
    'messages.no_messages': '没有找到消息',
    'messages.start_conversation': '开始与客户或供应商沟通吧',
    'messages.translation': '翻译',
    'messages.original': '原文',
    'messages.type_message': '输入消息...',
    'messages.send': '发送',
    'messages.attachments': '附件',
    'messages.voice_message': '语音消息',
    'messages.hold_to_record': '按住说话',
    'messages.release_to_send': '松开发送',
    'messages.slide_to_cancel': '上滑取消',
    
    // 工具
    'tools.title': '工具箱',
    'tools.common_tools': '常用工具',
    'tools.more_tools': '更多工具',
    'tools.material_compare': '材料比价',
    'tools.material_compare_desc': '拍照识别，全网比价',
    'tools.house_estimate': '房屋估价',
    'tools.house_estimate_desc': 'AI分析，智能估价',
    'tools.invoice_management': '发票管理',
    'tools.invoice_management_desc': '查看历史发票',
    'tools.quote': '报价单',
    'tools.quote_desc': '创建报价模板',
    'tools.measure': '测量工具',
    'tools.measure_desc': 'AR测量',
    'tools.schedule': '日程管理',
    'tools.schedule_desc': '项目排期',
    'tools.documents': '文档管理',
    'tools.documents_desc': '合同存档',
    'tools.finance': '收支记录',
    'tools.finance_desc': '财务统计',
    'tools.coming_soon': '更多功能即将推出',
    'tools.coming_soon_desc': 'AI助手、语音识别、AR测量等强大功能正在开发中',
    'tools.tips': '使用技巧',
    
    // 虚拟号码
    'virtual_numbers.title': '虚拟号码',
    'virtual_numbers.my_numbers': '我的号码',
    'virtual_numbers.no_numbers': '还没有虚拟号码',
    'virtual_numbers.no_numbers_desc': '购买虚拟号码，保护隐私，自动翻译客户短信',
    'virtual_numbers.buy_number': '购买号码',
    'virtual_numbers.from_monthly': '从 $5/月起',
    'virtual_numbers.monthly_cost': '月费',
    'virtual_numbers.next_billing': '下次续费',
    'virtual_numbers.messages_this_month': '本月消息',
    'virtual_numbers.view_messages': '查看消息',
    'virtual_numbers.manage_subscription': '管理订阅',
    'virtual_numbers.why_need': '为什么需要虚拟号码？',
    'virtual_numbers.privacy': '保护隐私',
    'virtual_numbers.privacy_desc': '不暴露真实手机号，分离工作与生活',
    'virtual_numbers.auto_translate': '自动翻译',
    'virtual_numbers.auto_translate_desc': '客户短信自动翻译成你的语言',
    'virtual_numbers.professional': '专业形象',
    'virtual_numbers.professional_desc': '建立专业品牌，提升客户信任',
    'virtual_numbers.purchase_title': '购买虚拟号码',
    'virtual_numbers.select_area_code': '选择区号',
    'virtual_numbers.select_plan': '选择套餐',
    'virtual_numbers.confirm_purchase': '确认购买',
    'virtual_numbers.recommended': '推荐',
    
    // 项目
    'projects.title': '项目',
    'projects.new_project': '新项目',
    'projects.active': '进行中',
    'projects.completed': '已完成',
    'projects.cancelled': '已取消',
    'projects.status': '状态',
    'projects.client': '客户',
    'projects.progress': '进度',
    'projects.budget': '预算',
    'projects.timeline': '时间线',
    
    // 个人资料
    'profile.title': '我的',
    'profile.edit_profile': '编辑资料',
    'profile.settings': '设置',
    'profile.language_settings': '语言设置',
    'profile.primary_language': '主要语言',
    'profile.primary_language_desc': '所有消息将自动翻译成这个语言',
    'profile.interface_language': '界面语言',
    'profile.notifications': '通知',
    'profile.privacy': '隐私',
    'profile.help': '帮助与支持',
    'profile.logout': '退出登录',
    
    // 通用按钮
    'button.save': '保存',
    'button.cancel': '取消',
    'button.delete': '删除',
    'button.edit': '编辑',
    'button.close': '关闭',
    'button.confirm': '确认',
    'button.search': '搜索',
    'button.filter': '筛选',
    'button.more': '更多',
    
    // 状态
    'status.active': '活跃',
    'status.suspended': '暂停',
    'status.draft': '草稿',
    'status.sent': '已发送',
    'status.paid': '已付款',
    'status.overdue': '逾期',
    'status.in_progress': '进行中',
    'status.completed': '已完成',
    'status.cancelled': '已取消',
  },
  
  'en-US': {
    // Common
    'app.name': 'ContractorLink',
    'app.tagline': 'Bridging Languages, Building Trust',
    
    // Navigation
    'nav.home': 'Home',
    'nav.messages': 'Messages',
    'nav.projects': 'Projects',
    'nav.tools': 'Tools',
    'nav.profile': 'Profile',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.good_morning': 'Good morning',
    'dashboard.good_afternoon': 'Good afternoon',
    'dashboard.good_evening': 'Good evening',
    'dashboard.welcome_message': 'Have a great day, keep going!',
    'dashboard.active_projects': 'Active Projects',
    'dashboard.monthly_revenue': 'Monthly Revenue',
    'dashboard.pending_invoices': 'Pending Invoices',
    'dashboard.completed': 'Completed',
    'dashboard.recent_messages': 'Recent Messages',
    'dashboard.active_projects_title': 'Active Projects',
    'dashboard.pending_invoices_title': 'Pending Invoices',
    'dashboard.view_all': 'View All',
    'dashboard.new_project': 'New Project',
    'dashboard.new_message': 'New Message',
    'dashboard.invoice': 'Invoice',
    'dashboard.compare': 'Compare',
    'dashboard.send_reminder': 'Send Reminder',
    'dashboard.days_remaining': 'days remaining',
    'dashboard.estimated_completion': 'Estimated completion',
    
    // Messages
    'messages.title': 'Messages',
    'messages.search_placeholder': 'Search messages or contacts...',
    'messages.virtual_number': 'Virtual Number Messages',
    'messages.new_messages': 'new messages',
    'messages.all': 'All',
    'messages.unread': 'Unread',
    'messages.client': 'Clients',
    'messages.supplier': 'Suppliers',
    'messages.new_conversation': 'New Conversation',
    'messages.no_messages': 'No messages found',
    'messages.start_conversation': 'Start communicating with clients or suppliers',
    'messages.translation': 'Translation',
    'messages.original': 'Original',
    'messages.type_message': 'Type a message...',
    'messages.send': 'Send',
    'messages.attachments': 'Attachments',
    'messages.voice_message': 'Voice Message',
    'messages.hold_to_record': 'Hold to record',
    'messages.release_to_send': 'Release to send',
    'messages.slide_to_cancel': 'Slide to cancel',
    
    // Tools
    'tools.title': 'Tools',
    'tools.common_tools': 'Common Tools',
    'tools.more_tools': 'More Tools',
    'tools.material_compare': 'Material Compare',
    'tools.material_compare_desc': 'Photo recognition, price comparison',
    'tools.house_estimate': 'House Estimate',
    'tools.house_estimate_desc': 'AI analysis, smart estimation',
    'tools.invoice_management': 'Invoice Management',
    'tools.invoice_management_desc': 'View invoice history',
    'tools.quote': 'Quote',
    'tools.quote_desc': 'Create quote templates',
    'tools.measure': 'Measure Tool',
    'tools.measure_desc': 'AR measurement',
    'tools.schedule': 'Schedule',
    'tools.schedule_desc': 'Project scheduling',
    'tools.documents': 'Documents',
    'tools.documents_desc': 'Contract archive',
    'tools.finance': 'Finance',
    'tools.finance_desc': 'Financial statistics',
    'tools.coming_soon': 'More features coming soon',
    'tools.coming_soon_desc': 'AI assistant, voice recognition, AR measurement and more are under development',
    'tools.tips': 'Tips',
    
    // Virtual Numbers
    'virtual_numbers.title': 'Virtual Numbers',
    'virtual_numbers.my_numbers': 'My Numbers',
    'virtual_numbers.no_numbers': 'No virtual numbers yet',
    'virtual_numbers.no_numbers_desc': 'Buy a virtual number to protect your privacy and auto-translate customer SMS',
    'virtual_numbers.buy_number': 'Buy Number',
    'virtual_numbers.from_monthly': 'From $5/month',
    'virtual_numbers.monthly_cost': 'Monthly Cost',
    'virtual_numbers.next_billing': 'Next Billing',
    'virtual_numbers.messages_this_month': 'Messages This Month',
    'virtual_numbers.view_messages': 'View Messages',
    'virtual_numbers.manage_subscription': 'Manage Subscription',
    'virtual_numbers.why_need': 'Why need a virtual number?',
    'virtual_numbers.privacy': 'Privacy Protection',
    'virtual_numbers.privacy_desc': 'Don\'t expose your real number, separate work and life',
    'virtual_numbers.auto_translate': 'Auto Translation',
    'virtual_numbers.auto_translate_desc': 'Customer SMS automatically translated to your language',
    'virtual_numbers.professional': 'Professional Image',
    'virtual_numbers.professional_desc': 'Build professional brand, increase customer trust',
    'virtual_numbers.purchase_title': 'Purchase Virtual Number',
    'virtual_numbers.select_area_code': 'Select Area Code',
    'virtual_numbers.select_plan': 'Select Plan',
    'virtual_numbers.confirm_purchase': 'Confirm Purchase',
    'virtual_numbers.recommended': 'Recommended',
    
    // Projects
    'projects.title': 'Projects',
    'projects.new_project': 'New Project',
    'projects.active': 'Active',
    'projects.completed': 'Completed',
    'projects.cancelled': 'Cancelled',
    'projects.status': 'Status',
    'projects.client': 'Client',
    'projects.progress': 'Progress',
    'projects.budget': 'Budget',
    'projects.timeline': 'Timeline',
    
    // Profile
    'profile.title': 'Profile',
    'profile.edit_profile': 'Edit Profile',
    'profile.settings': 'Settings',
    'profile.language_settings': 'Language Settings',
    'profile.primary_language': 'Primary Language',
    'profile.primary_language_desc': 'All messages will be translated to this language',
    'profile.interface_language': 'Interface Language',
    'profile.notifications': 'Notifications',
    'profile.privacy': 'Privacy',
    'profile.help': 'Help & Support',
    'profile.logout': 'Logout',
    
    // Buttons
    'button.save': 'Save',
    'button.cancel': 'Cancel',
    'button.delete': 'Delete',
    'button.edit': 'Edit',
    'button.close': 'Close',
    'button.confirm': 'Confirm',
    'button.search': 'Search',
    'button.filter': 'Filter',
    'button.more': 'More',
    
    // Status
    'status.active': 'Active',
    'status.suspended': 'Suspended',
    'status.draft': 'Draft',
    'status.sent': 'Sent',
    'status.paid': 'Paid',
    'status.overdue': 'Overdue',
    'status.in_progress': 'In Progress',
    'status.completed': 'Completed',
    'status.cancelled': 'Cancelled',
  },
  
  'es': {
    // Spanish translations - basic set
    'app.name': 'ContractorLink',
    'nav.home': 'Inicio',
    'nav.messages': 'Mensajes',
    'nav.projects': 'Proyectos',
    'nav.tools': 'Herramientas',
    'nav.profile': 'Perfil',
    'dashboard.title': 'Panel',
    'messages.title': 'Mensajes',
    'tools.title': 'Herramientas',
    'virtual_numbers.title': 'Números Virtuales',
    'profile.title': 'Perfil',
    'button.save': 'Guardar',
    'button.cancel': 'Cancelar',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('zh-CN');

  useEffect(() => {
    // Load saved language from localStorage
    const saved = localStorage.getItem('app-language') as LanguageCode;
    if (saved && supportedLanguages.find(l => l.code === saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('app-language', lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages: supportedLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};