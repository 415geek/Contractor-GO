# ContractorLink V2.0 部署指南

## 📋 前置要求

- Node.js 18+
- npm 或 yarn
- Supabase 账号
- Git

---

## 🚀 部署步骤

### 1. 克隆项目

```bash
git clone <repository-url>
cd contractorlink-v2
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

创建 `.env` 文件：

```env
VITE_API_BASE_URL=https://your-project.supabase.co
```

### 4. 配置 Supabase

#### 4.1 创建 Supabase 项目

1. 访问 https://supabase.com
2. 创建新项目
3. 记录项目 URL 和 API 密钥

#### 4.2 设置环境变量

在 Supabase 项目设置中添加以下环境变量：

- `SUPABASE_URL`: 项目 URL
- `SUPABASE_SERVICE_ROLE_KEY`: 服务角色密钥
- `SUPABASE_ANON_KEY`: 匿名密钥

#### 4.3 执行数据库迁移

数据库表已通过 SQL 创建，无需额外迁移。

#### 4.4 验证 RLS 策略

确保所有表都启用了 RLS 并配置了正确的策略。

### 5. 部署 Edge Functions

Edge Functions 会自动部署，但你可以手动触发：

```bash
# 使用 Supabase CLI
supabase functions deploy

# 部署特定函数
supabase functions deploy auth-register
supabase functions deploy auth-login
supabase functions deploy messages-send
supabase functions deploy messages-list
supabase functions deploy conversations-list
supabase functions deploy projects-crud
supabase functions deploy invoices-crud
```

### 6. 构建前端

```bash
npm run build
```

### 7. 部署前端

#### 选项 1: Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

#### 选项 2: Netlify

```bash
# 安装 Netlify CLI
npm i -g netlify-cli

# 部署
netlify deploy --prod
```

#### 选项 3: 自定义服务器

参考 `nginx/contractorpro.conf` 配置 Nginx。

---

## 🔧 本地开发

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

### 本地 Supabase

```bash
# 启动本地 Supabase
supabase start

# 查看本地日志
supabase logs

# 重置本地数据库
supabase db reset
```

---

## 📊 监控与日志

### Supabase Dashboard

1. 访问项目 Dashboard
2. 查看 Edge Functions 日志
3. 监控数据库性能
4. 查看实时统计

### 应用日志

```bash
# 查看应用日志
supabase functions logs

# 实时查看
supabase functions logs --follow
```

---

## 🔒 安全检查清单

### 数据库安全

- [x] 所有表启用 RLS
- [x] 配置正确的 RLS 策略
- [x] 使用服务角色密钥进行服务器操作
- [x] 密码使用 bcrypt 加密

### API 安全

- [x] JWT token 验证
- [x] CORS 配置
- [x] 输入验证
- [x] 错误处理

### 前端安全

- [x] 环境变量保护
- [x] XSS 防护
- [x] HTTPS 强制

---

## 🧪 测试

### 手动测试

1. **注册测试**
   - 访问 `/register`
   - 填写注册表单
   - 验证用户创建成功

2. **登录测试**
   - 访问 `/login`
   - 使用注册的凭据登录
   - 验证 token 生成

3. **消息测试**
   - 创建会话
   - 发送消息
   - 验证翻译功能

4. **项目测试**
   - 创建项目
   - 更新项目状态
   - 删除项目

5. **发票测试**
   - 创建发票
   - 添加发票项目
   - 更新发票状态

### API 测试

使用 Postman 或 curl 测试 API：

```bash
# 注册
curl -X POST https://your-project.supabase.co/functions/v1/auth-register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+14155550123",
    "password": "password123",
    "role": "contractor",
    "display_name": "测试用户"
  }'

# 登录
curl -X POST https://your-project.supabase.co/functions/v1/auth-login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+14155550123",
    "password": "password123"
  }'
```

---

## 📈 性能优化

### 数据库优化

1. **索引优化**
   - 已为常用查询字段创建索引
   - 定期分析查询性能

2. **查询优化**
   - 使用 `select()` 只选择需要的字段
   - 使用分页避免大量数据加载

### 前端优化

1. **代码分割**
   - 使用 React.lazy() 懒加载组件
   - 路由级别的代码分割

2. **缓存策略**
   - 使用 React Query 缓存 API 响应
   - 本地存储用户数据

3. **图片优化**
   - 使用 WebP 格式
   - 懒加载图片

---

## 🐛 故障排除

### 常见问题

#### 1. Edge Functions 部署失败

**解决方案:**
- 检查函数语法
- 查看部署日志
- 确保所有依赖正确导入

#### 2. RLS 策略阻止访问

**解决方案:**
- 检查策略配置
- 验证用户身份
- 使用服务角色密钥测试

#### 3. CORS 错误

**解决方案:**
- 检查 CORS 配置
- 确保前端 URL 在允许列表中
- 使用代理服务器

#### 4. 数据库连接失败

**解决方案:**
- 检查连接字符串
- 验证网络连接
- 检查 Supabase 服务状态

---

## 📞 支持

如有问题，请联系：

- 技术支持: support@contractorlink.app
- 文档: https://docs.contractorlink.app
- GitHub Issues: https://github.com/contractorlink/v2/issues

---

## 🔄 更新部署

### 更新 Edge Functions

```bash
supabase functions deploy <function-name>
```

### 更新前端

```bash
npm run build
# 然后部署到你的托管平台
```

### 数据库迁移

```bash
# 创建迁移文件
supabase migration new <migration-name>

# 应用迁移
supabase db push
```

---

*部署指南版本: V2.0*
*最后更新: 2025年*