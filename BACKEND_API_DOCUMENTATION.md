# ContractorLink V2.0 后端 API 文档

## 📋 概述

本文档描述了 ContractorLink V2.0 的所有后端 API 接口。所有 API 都部署在 Supabase Edge Functions 上。

---

## 🔐 认证

所有 API（除了注册和登录）都需要在请求头中包含 JWT token：

```
Authorization: Bearer <token>
```

---

## 📡 API 端点

### 1. 认证 API

#### 1.1 用户注册

**端点:** `POST /functions/v1/auth-register`

**请求体:**
```json
{
  "phone": "+14155550123",
  "email": "user@example.com",
  "password": "password123",
  "role": "contractor",
  "display_name": "张师傅",
  "primary_language": "zh-CN",
  "interface_language": "zh-CN"
}
```

**响应:**
```json
{
  "user": {
    "id": "uuid",
    "phone": "+14155550123",
    "email": "user@example.com",
    "role": "contractor",
    "display_name": "张师傅",
    "primary_language": "zh-CN",
    "interface_language": "zh-CN"
  },
  "token": "base64_encoded_jwt_token"
}
```

#### 1.2 用户登录

**端点:** `POST /functions/v1/auth-login`

**请求体:**
```json
{
  "phone": "+14155550123",
  "email": "user@example.com",
  "password": "password123"
}
```

**响应:**
```json
{
  "user": {
    "id": "uuid",
    "phone": "+14155550123",
    "email": "user@example.com",
    "role": "contractor",
    "display_name": "张师傅",
    "primary_language": "zh-CN",
    "interface_language": "zh-CN",
    "avatar_url": "https://...",
    "company_name": "张师傅装修公司"
  },
  "token": "base64_encoded_jwt_token"
}
```

---

### 2. 消息 API

#### 2.1 获取会话列表

**端点:** `GET /functions/v1/conversations-list`

**响应:**
```json
{
  "conversations": [
    {
      "id": "uuid",
      "participant_ids": ["uuid1", "uuid2"],
      "type": "direct",
      "last_message_preview": "你好，请问...",
      "last_message_at": "2024-01-15T10:30:00Z",
      "unread_counts": {
        "uuid1": 2,
        "uuid2": 0
      },
      "participants": [
        {
          "id": "uuid2",
          "display_name": "John Smith",
          "avatar_url": "https://..."
        }
      ],
      "unread_count": 2
    }
  ]
}
```

#### 2.2 获取消息列表

**端点:** `GET /functions/v1/messages-list?conversation_id=<id>&limit=50&before=<timestamp>`

**查询参数:**
- `conversation_id` (可选): 会话 ID
- `limit` (可选): 返回数量，默认 50
- `before` (可选): 分页游标

**响应:**
```json
{
  "messages": [
    {
      "id": "uuid",
      "conversation_id": "uuid",
      "sender_id": "uuid",
      "type": "text",
      "content_original": "Hello",
      "content_translated": "你好",
      "original_language": "en-US",
      "target_language": "zh-CN",
      "status": "sent",
      "created_at": "2024-01-15T10:30:00Z",
      "sender": {
        "id": "uuid",
        "display_name": "John Smith",
        "avatar_url": "https://..."
      }
    }
  ]
}
```

#### 2.3 发送消息

**端点:** `POST /functions/v1/messages-send`

**请求体:**
```json
{
  "conversation_id": "uuid",
  "content": "你好，请问价格可以优惠吗？",
  "type": "text",
  "target_language": "en-US"
}
```

**响应:**
```json
{
  "message": {
    "id": "uuid",
    "conversation_id": "uuid",
    "sender_id": "uuid",
    "type": "text",
    "content_original": "你好，请问价格可以优惠吗？",
    "content_translated": "Hello, can you offer a discount on the price?",
    "original_language": "zh-CN",
    "target_language": "en-US",
    "status": "sent",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

---

### 3. 项目 API

#### 3.1 获取项目列表

**端点:** `GET /functions/v1/projects-crud?status=<status>`

**查询参数:**
- `status` (可选): 项目状态筛选

**响应:**
```json
{
  "projects": [
    {
      "id": "uuid",
      "contractor_id": "uuid",
      "client_name": "John Smith",
      "client_phone": "+14155550123",
      "name": "Johnson 厨房翻新",
      "description": "全屋厨房翻新项目",
      "project_type": "kitchen_remodel",
      "status": "in_progress",
      "progress_percentage": 80,
      "estimated_start_date": "2024-01-01",
      "estimated_end_date": "2024-01-31",
      "estimated_budget_min": 5000,
      "estimated_budget_max": 8000,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### 3.2 创建项目

**端点:** `POST /functions/v1/projects-crud`

**请求体:**
```json
{
  "name": "Johnson 厨房翻新",
  "description": "全屋厨房翻新项目",
  "project_type": "kitchen_remodel",
  "client_name": "John Smith",
  "client_phone": "+14155550123",
  "client_email": "john@example.com",
  "client_language": "en-US",
  "address": "123 Main St, San Francisco, CA",
  "estimated_start_date": "2024-01-01",
  "estimated_end_date": "2024-01-31",
  "estimated_budget_min": 5000,
  "estimated_budget_max": 8000
}
```

**响应:**
```json
{
  "project": {
    "id": "uuid",
    "contractor_id": "uuid",
    "name": "Johnson 厨房翻新",
    "status": "lead",
    "progress_percentage": 0,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### 3.3 更新项目

**端点:** `PUT /functions/v1/projects-crud?id=<id>`

**请求体:**
```json
{
  "status": "in_progress",
  "progress_percentage": 50
}
```

#### 3.4 删除项目

**端点:** `DELETE /functions/v1/projects-crud?id=<id>`

---

### 4. 发票 API

#### 4.1 获取发票列表

**端点:** `GET /functions/v1/invoices-crud?status=<status>&project_id=<id>`

**查询参数:**
- `status` (可选): 发票状态筛选
- `project_id` (可选): 项目 ID 筛选

**响应:**
```json
{
  "invoices": [
    {
      "id": "uuid",
      "contractor_id": "uuid",
      "client_name": "John Smith",
      "invoice_number": "INV-2024-0001",
      "status": "sent",
      "subtotal": 2100,
      "tax_rate": 8.5,
      "tax_amount": 178.5,
      "discount_amount": 0,
      "total": 2278.5,
      "issue_date": "2024-01-15",
      "due_date": "2024-02-15",
      "language": "en-US",
      "created_at": "2024-01-15T00:00:00Z",
      "invoice_items": [
        {
          "id": "uuid",
          "description": "拆除旧橱柜",
          "quantity": 1,
          "unit": "piece",
          "unit_price": 500,
          "subtotal": 500
        }
      ]
    }
  ]
}
```

#### 4.2 创建发票

**端点:** `POST /functions/v1/invoices-crud`

**请求体:**
```json
{
  "client_name": "John Smith",
  "client_email": "john@example.com",
  "client_address": "123 Main St, San Francisco, CA",
  "project_id": "uuid",
  "items": [
    {
      "description": "拆除旧橱柜",
      "description_translated": "Remove old cabinets",
      "quantity": 1,
      "unit": "piece",
      "unit_price": 500
    },
    {
      "description": "安装新橱柜",
      "description_translated": "Install new cabinets",
      "quantity": 8,
      "unit": "set",
      "unit_price": 200
    }
  ],
  "tax_rate": 8.5,
  "discount_amount": 0,
  "payment_methods": ["zelle", "check"],
  "payment_instructions": "Please send payment via Zelle to...",
  "notes": "预计工期2周",
  "terms": "Payment due within 30 days",
  "language": "en-US",
  "due_date": "2024-02-15"
}
```

**响应:**
```json
{
  "invoice": {
    "id": "uuid",
    "invoice_number": "INV-2024-0001",
    "subtotal": 2100,
    "tax_amount": 178.5,
    "total": 2278.5,
    "status": "draft",
    "invoice_items": [...]
  }
}
```

#### 4.3 更新发票

**端点:** `PUT /functions/v1/invoices-crud?id=<id>`

**请求体:**
```json
{
  "status": "sent",
  "paid_date": "2024-02-10"
}
```

#### 4.4 删除发票

**端点:** `DELETE /functions/v1/invoices-crud?id=<id>`

---

## 🔒 安全性

### RLS (Row Level Security)

所有数据库表都启用了 RLS，确保用户只能访问自己的数据：

- **users**: 用户只能访问自己的数据
- **virtual_numbers**: 用户只能访问自己的虚拟号码
- **projects**: 承包商只能访问自己的项目
- **conversations**: 用户只能访问自己参与的会话
- **messages**: 用户只能访问自己参与的会话中的消息
- **invoices**: 承包商只能访问自己的发票
- **invoice_items**: 通过发票关联访问

### 密码加密

所有密码都使用 bcrypt 加密存储，salt rounds = 10。

### JWT Token

- Token 有效期：7 天
- Token 包含：user_id, role, exp
- Token 存储：localStorage

---

## 📊 数据库表结构

### users
- id (UUID, PK)
- phone (VARCHAR, UNIQUE)
- email (VARCHAR, UNIQUE)
- password_hash (VARCHAR)
- role (VARCHAR: contractor/client)
- status (VARCHAR: active/suspended/deleted)
- primary_language (VARCHAR)
- interface_language (VARCHAR)
- display_name (VARCHAR)
- avatar_url (VARCHAR)
- bio (TEXT)
- company_name (VARCHAR)
- service_types (TEXT[])
- service_area (TEXT)
- license_number (VARCHAR)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
- last_login_at (TIMESTAMPTZ)

### virtual_numbers
- id (UUID, PK)
- user_id (UUID, FK → users)
- phone_number (VARCHAR, UNIQUE)
- area_code (VARCHAR)
- country_code (VARCHAR)
- provider (VARCHAR)
- provider_number_id (VARCHAR)
- plan_type (VARCHAR: basic/professional)
- status (VARCHAR: active/suspended/released)
- monthly_cost (DECIMAL)
- next_billing_date (DATE)
- messages_sent_this_month (INT)
- messages_received_this_month (INT)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

### projects
- id (UUID, PK)
- contractor_id (UUID, FK → users)
- client_id (UUID, FK → users)
- virtual_number_id (UUID, FK → virtual_numbers)
- client_name (VARCHAR)
- client_phone (VARCHAR)
- client_email (VARCHAR)
- client_language (VARCHAR)
- name (VARCHAR)
- description (TEXT)
- project_type (VARCHAR)
- address (TEXT)
- location (TEXT)
- status (VARCHAR: lead/negotiating/quoted/contracted/in_progress/completed/cancelled)
- progress_percentage (INT)
- estimated_start_date (DATE)
- estimated_end_date (DATE)
- actual_start_date (DATE)
- actual_end_date (DATE)
- estimated_budget_min (DECIMAL)
- estimated_budget_max (DECIMAL)
- contracted_amount (DECIMAL)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

### conversations
- id (UUID, PK)
- project_id (UUID, FK → projects)
- virtual_number_id (UUID, FK → virtual_numbers)
- participant_ids (UUID[])
- type (VARCHAR: direct/sms/group)
- external_phone (VARCHAR)
- external_name (VARCHAR)
- last_message_preview (TEXT)
- last_message_at (TIMESTAMPTZ)
- unread_counts (JSONB)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

### messages
- id (UUID, PK)
- conversation_id (UUID, FK → conversations)
- sender_id (UUID, FK → users)
- type (VARCHAR: text/voice/image/video/file/location/contact/invoice/quote)
- content_original (TEXT)
- content_translated (TEXT)
- original_language (VARCHAR)
- target_language (VARCHAR)
- media_url (VARCHAR)
- media_type (VARCHAR)
- media_size_bytes (BIGINT)
- voice_duration_seconds (INT)
- voice_transcription (TEXT)
- translation_confidence (DECIMAL)
- status (VARCHAR: sending/sent/delivered/read/failed)
- is_sms (BOOLEAN)
- sms_provider_message_id (VARCHAR)
- created_at (TIMESTAMPTZ)
- read_at (TIMESTAMPTZ)

### invoices
- id (UUID, PK)
- contractor_id (UUID, FK → users)
- client_id (UUID, FK → users)
- project_id (UUID, FK → projects)
- conversation_id (UUID, FK → conversations)
- message_id (UUID, FK → messages)
- invoice_number (VARCHAR, UNIQUE)
- client_name (VARCHAR)
- client_email (VARCHAR)
- client_address (TEXT)
- status (VARCHAR: draft/sent/viewed/paid/overdue/cancelled)
- subtotal (DECIMAL)
- tax_rate (DECIMAL)
- tax_amount (DECIMAL)
- discount_amount (DECIMAL)
- total (DECIMAL)
- issue_date (DATE)
- due_date (DATE)
- paid_date (DATE)
- payment_methods (TEXT[])
- payment_instructions (TEXT)
- notes (TEXT)
- terms (TEXT)
- language (VARCHAR)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

### invoice_items
- id (UUID, PK)
- invoice_id (UUID, FK → invoices)
- description (TEXT)
- description_translated (TEXT)
- quantity (DECIMAL)
- unit (VARCHAR)
- unit_price (DECIMAL)
- subtotal (DECIMAL)
- sort_order (INT)
- created_at (TIMESTAMPTZ)

---

## 🚀 部署说明

### 环境变量

确保在 Supabase 项目中设置以下环境变量：

- `SUPABASE_URL`: Supabase 项目 URL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase 服务角色密钥
- `SUPABASE_ANON_KEY`: Supabase 匿名密钥

### Edge Functions 部署

所有 Edge Functions 都在 `supabase/functions/` 目录下，会自动部署。

### 前端配置

在 `.env` 文件中配置：

```env
VITE_API_BASE_URL=https://your-project.supabase.co
```

---

## 📝 待实现功能

以下功能为 Phase 2/3 计划：

1. **虚拟号码系统**
   - Telnyx 集成
   - 号码购买流程
   - SMS/MMS 收发
   - Webhook 处理

2. **工具功能**
   - 材料比价（Claude Vision + Nova Act）
   - 房屋估价（AI 分析）

3. **WebSocket 实时通讯**
   - 消息实时推送
   - 在线状态
   - 输入状态
   - 消息已读回执

4. **AI 翻译集成**
   - Claude API 集成
   - 建筑行业术语库
   - 翻译质量评估

---

## 🐛 错误处理

所有 API 都遵循统一的错误响应格式：

```json
{
  "error": "错误描述",
  "details": "详细错误信息（可选）"
}
```

常见 HTTP 状态码：

- `200`: 成功
- `201`: 创建成功
- `400`: 请求参数错误
- `401`: 未授权
- `403`: 禁止访问
- `404`: 资源不存在
- `500`: 服务器错误

---

*文档版本: V2.0*
*最后更新: 2025年*