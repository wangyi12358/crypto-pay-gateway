# Crypto Pay Gateway - 开源多链加密支付网关

## 项目概述

类似 EPusdt 的开源多链加密货币支付网关，支持私有化部署，资金直达商户钱包，零托管。

**目标**: 更现代化的架构、更好的开发体验、更完善的文档。

---

## 技术栈

| 类别 | 选型 | 理由 |
|------|------|------|
| 框架 | Next.js 15 (App Router) | React 全栈框架，前后端一体 |
| API | Hono.js (API Route) | 轻量高性能，嵌入 Next.js /api |
| UI 库 | HeroUI (原 NextUI) | 现代、美观、Tailwind 原生 |
| 样式 | Tailwind CSS v4 | 原子化 CSS，高效开发 |
| 状态管理 | Jotai | 轻量原子化状态管理 |
| ORM | Prisma | 类型安全、自动迁移 |
| 数据库 | PostgreSQL 16 | 生产级关系型数据库 |
| 认证 | better-auth | 现代、类型安全的认证库 |
| 区块链 | viem (EVM) + @solana/web3.js | 现代、类型安全 |
| 定时任务 | node-cron | 轻量 |
| 通知 | grammy (Telegram) | 现代 Telegram Bot 框架 |
| 日志 | pino | 高性能结构化日志 |
| 验证 | zod | 运行时类型校验 |
| 测试 | Vitest | 快速、原生 TS 支持 |
| 包管理 | pnpm | 快速、节省空间 |
| 构建 | Turborepo | Monorepo 管理 |

---

## 架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js 15 (单服务)                       │
│                                                              │
│  ┌──────────────────────┐    ┌────────────────────────────┐ │
│  │   Frontend (SSR/CSR)  │    │   API Routes (Hono.js)     │ │
│  │                      │    │                            │ │
│  │  /                   │    │  /api/payments/*           │ │
│  │  /admin/*            │    │  /api/admin/*              │ │
│  │  /pay/[tradeId]      │    │  /api/auth/* (better-auth) │ │
│  │                      │    │                            │ │
│  │  HeroUI + Tailwind   │    │  Hono RPC                 │ │
│  │  Jotai + SWR         │    │  Middleware                │ │
│  └──────────────────────┘    └─────────────┬──────────────┘ │
│                                            │                │
└────────────────────────────────────────────┼────────────────┘
                                             │ Prisma ORM
                                             ▼
                                  ┌─────────────────────┐
                                  │    PostgreSQL 16     │
                                  └─────────────────────┘
```

**关键点**: 前后端在同一个 Next.js 进程中运行，Hono 通过 `app/api/[[...route]]/route.ts` 接管所有 `/api/*` 路由。

---

## 项目结构

```
crypto-pay-gateway/
├── src/
│   ├── app/                              # Next.js App Router
│   │   ├── layout.tsx                    # 根布局
│   │   ├── page.tsx                      # 首页
│   │   ├── globals.css
│   │   │
│   │   ├── api/                          # API Routes
│   │   │   └── [[...route]]/
│   │   │       └── route.ts              # Hono 入口 (接管所有 /api/*)
│   │   │
│   │   ├── admin/                        # 管理后台
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                  # 仪表盘
│   │   │   ├── orders/
│   │   │   │   └── page.tsx
│   │   │   ├── wallets/
│   │   │   │   └── page.tsx
│   │   │   ├── chains/
│   │   │   │   └── page.tsx
│   │   │   ├── api-keys/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   │
│   │   ├── pay/                          # 收银台
│   │   │   └── [tradeId]/
│   │   │       └── page.tsx
│   │   │
│   │   └── auth/                         # 认证页面
│   │       ├── login/
│   │       │   └── page.tsx
│   │       └── register/
│   │           └── page.tsx
│   │
│   ├── server/                           # 后端逻辑 (Hono + Services)
│   │   ├── app.ts                        # Hono app 定义
│   │   │
│   │   ├── routes/                       # Hono 路由
│   │   │   ├── payment.ts               # 支付接口
│   │   │   ├── admin/
│   │   │   │   ├── index.ts
│   │   │   │   ├── orders.ts
│   │   │   │   ├── wallets.ts
│   │   │   │   ├── chains.ts
│   │   │   │   ├── chain-tokens.ts
│   │   │   │   ├── rpc-nodes.ts
│   │   │   │   ├── api-keys.ts
│   │   │   │   ├── settings.ts
│   │   │   │   └── dashboard.ts
│   │   │   └── callback.ts
│   │   │
│   │   ├── middleware/                   # Hono 中间件
│   │   │   ├── auth.ts                  # better-auth session 验证
│   │   │   ├── signature.ts             # 支付签名验证
│   │   │   ├── cors.ts
│   │   │   └── request-id.ts
│   │   │
│   │   ├── lib/                          # 后端库
│   │   │   ├── prisma.ts                # Prisma 客户端
│   │   │   ├── auth.ts                  # better-auth 实例
│   │   │   └── hono.ts                  # Hono 类型 (用于 RPC)
│   │   │
│   │   ├── service/                      # 业务逻辑
│   │   │   ├── order.ts
│   │   │   ├── payment.ts
│   │   │   ├── rate.ts
│   │   │   ├── wallet.ts
│   │   │   └── callback.ts
│   │   │
│   │   ├── chain/                        # 链监听
│   │   │   ├── types.ts
│   │   │   ├── evm/
│   │   │   │   ├── index.ts
│   │   │   │   └── scanner.ts
│   │   │   ├── tron/
│   │   │   │   └── index.ts
│   │   │   └── solana/
│   │   │       └── index.ts
│   │   │
│   │   ├── queue/                        # 异步队列
│   │   │   ├── index.ts
│   │   │   ├── expiration.ts
│   │   │   └── callback.ts
│   │   │
│   │   └── notify/                       # 通知
│   │       ├── dispatcher.ts
│   │       ├── telegram.ts
│   │       └── webhook.ts
│   │
│   ├── components/                       # 前端组件
│   │   ├── ui/                           # HeroUI 封装
│   │   ├── admin/                        # 管理后台组件
│   │   └── pay/                          # 收银台组件
│   │
│   ├── lib/                              # 前端工具
│   │   ├── api-client.ts                # Hono RPC 客户端
│   │   ├── auth-client.ts               # better-auth 客户端
│   │   └── utils.ts
│   │
│   ├── stores/                           # Jotai atoms
│   │   ├── auth.ts
│   │   └── dashboard.ts
│   │
│   ├── hooks/                            # React Hooks
│   │
│   └── types/                            # 类型定义
│
├── prisma/
│   └── schema.prisma                     # Prisma Schema
│
├── public/                               # 静态资源
│
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yaml
│
├── docs/
│   ├── API.md
│   └── DEPLOYMENT.md
│
├── .env.example
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── LICENSE
└── README.md
```

---

## Hono API Route 配置

### 入口文件

```typescript
// src/app/api/[[...route]]/route.ts
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { requestId } from 'hono/request-id'

import { paymentRoutes } from '@/server/routes/payment'
import { adminRoutes } from '@/server/routes/admin'
import { authMiddleware } from '@/server/middleware/auth'

const app = new Hono().basePath('/api')

// 全局中间件
app.use('*', logger())
app.use('*', requestId())
app.use('*', cors({
  origin: process.env.APP_URI || 'http://localhost:3000',
  credentials: true,
}))

// 公开路由 (支付)
app.route('/payments', paymentRoutes)

// 认证路由 (better-auth)
app.on(['POST', 'GET'], '/auth/*', async (c) => {
  const { auth } = await import('@/server/lib/auth')
  return auth.handler(c.req.raw)
})

// 管理路由 (需要认证)
app.use('/admin/*', authMiddleware)
app.route('/admin', adminRoutes)

// 404
app.notFound((c) => {
  return c.json({ message: 'Not Found' }, 404)
})

// 错误处理
app.onError((err, c) => {
  console.error(err)
  return c.json({ message: 'Internal Server Error' }, 500)
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)
```

### Hono RPC 路由

```typescript
// src/server/routes/payment.ts
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const createTransactionSchema = z.object({
  pid: z.string(),
  order_id: z.string().max(32),
  amount: z.number().positive().min(0.01),
  token: z.enum(['usdt', 'usdc']),
  network: z.enum(['ethereum', 'bsc', 'polygon', 'tron', 'solana']),
  currency: z.enum(['cny', 'usd']),
  notify_url: z.string().url(),
  redirect_url: z.string().url().optional(),
  name: z.string().optional(),
  signature: z.string(),
})

export const paymentRoutes = new Hono()
  .post(
    '/v1/order/create-transaction',
    zValidator('json', createTransactionSchema),
    async (c) => {
      const body = c.req.valid('json')
      // 业务逻辑...
      return c.json({ status_code: 200, data: { ... } })
    }
  )
  .get('/v1/config', async (c) => {
    return c.json({ status_code: 200, data: { ... } })
  })
```

### 前端 RPC 调用

```typescript
// src/lib/api-client.ts
import { hc } from 'hono/client'
import type { AppType } from '@/server/app'

// 客户端类型自动推导 - 端到端类型安全
export const api = hc<AppType>('/api')

// 使用
const res = await api.payments.v1.config.$get()
const data = await res.json() // 类型自动推导
```

---

## 数据库设计 (Prisma Schema)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==================== better-auth 表 ====================

model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  sessions      Session[]
  accounts      Account[]
}

model Session {
  id           String   @id @default(cuid())
  expiresAt    DateTime
  token        String   @unique
  ipAddress    String?
  userAgent    String?
  userId       String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Account {
  id                String    @id @default(cuid())
  accountId         String
  providerId        String
  userId            String
  accessToken       String?
  refreshToken      String?
  idToken           String?
  accessTokenExpiresAt DateTime?
  refreshTokenExpiresAt DateTime?
  scope             String?
  password          String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([providerId, accountId])
}

// ==================== 业务表 ====================

model ApiKey {
  id           String    @id @default(cuid())
  pid          String    @unique
  secretKey    String    @map("secret_key")
  name         String    @default("")
  ipWhitelist  String?   @map("ip_whitelist")
  status       Int       @default(1)
  callCount    Int       @default(0)  @map("call_count")
  lastUsedAt   DateTime? @map("last_used_at")
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt      @map("updated_at")

  orders       Order[]

  @@map("api_keys")
}

model Chain {
  id          String       @id @default(cuid())
  network     String       @unique
  name        String
  enabled     Boolean      @default(true)
  createdAt   DateTime     @default(now()) @map("created_at")

  tokens      ChainToken[]
  rpcNodes    RpcNode[]
  wallets     WalletAddress[]

  @@map("chains")
}

model ChainToken {
  id              String  @id @default(cuid())
  chainId         String  @map("chain_id")
  symbol          String
  contractAddress String? @map("contract_address") @default("")
  decimals        Int     @default(18)
  minAmount       Float   @default(0) @map("min_amount")
  enabled         Boolean @default(true)
  createdAt       DateTime @default(now()) @map("created_at")

  chain           Chain   @relation(fields: [chainId], references: [id])

  @@unique([chainId, symbol, contractAddress])
  @@map("chain_tokens")
}

model RpcNode {
  id                String    @id @default(cuid())
  chainId           String    @map("chain_id")
  url               String
  nodeType          String    @default("http") @map("node_type")
  apiKey            String?   @map("api_key") @default("")
  enabled           Boolean   @default(true)
  lastHealthCheckAt DateTime? @map("last_health_check_at")
  lastHealthStatus  Boolean   @default(true) @map("last_health_status")
  createdAt         DateTime  @default(now()) @map("created_at")

  chain             Chain     @relation(fields: [chainId], references: [id])

  @@map("rpc_nodes")
}

model WalletAddress {
  id        String   @id @default(cuid())
  chainId   String   @map("chain_id")
  address   String
  label     String   @default("")
  enabled   Boolean  @default(true)
  createdAt DateTime @default(now()) @map("created_at")

  chain     Chain    @relation(fields: [chainId], references: [id])

  @@unique([chainId, address])
  @@map("wallet_addresses")
}

model Order {
  id                 String    @id @default(cuid())
  tradeId            String    @unique @map("trade_id")
  orderId            String    @unique @map("order_id")
  parentTradeId      String?   @map("parent_trade_id") @default("")
  amount             Float
  currency           String    @default("CNY")
  actualAmount       Float     @map("actual_amount")
  receiveAddress     String    @map("receive_address")
  token              String
  network            String
  status             Int       @default(1)
  notifyUrl          String    @map("notify_url")
  redirectUrl        String?   @map("redirect_url") @default("")
  name               String    @default("")
  blockTransactionId String?   @map("block_transaction_id") @default("")
  callbackNum        Int       @default(0) @map("callback_num")
  callbackConfirm    Int       @default(2) @map("callback_confirm")
  paymentType        String?   @map("payment_type") @default("")
  payProvider        String    @default("on_chain") @map("pay_provider")
  apiKeyId           String?   @map("api_key_id")
  createdAt          DateTime  @default(now()) @map("created_at")
  updatedAt          DateTime  @updatedAt      @map("updated_at")

  apiKey             ApiKey?   @relation(fields: [apiKeyId], references: [id])

  @@index([status])
  @@index([createdAt])
  @@map("orders")
}

model TransactionLock {
  id        String   @id @default(cuid())
  network   String
  address   String
  token     String
  amount    Float
  tradeId   String   @map("trade_id")
  expiresAt DateTime @map("expires_at")
  createdAt DateTime @default(now()) @map("created_at")

  @@unique([network, address, token, amount])
  @@map("transaction_locks")
}

model Setting {
  id        String   @id @default(cuid())
  key       String   @unique
  value     String   @default("")
  type      String   @default("string")
  group     String   @default("")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt      @map("updated_at")

  @@map("settings")
}
```

---

## 认证设计 (better-auth)

```typescript
// src/server/lib/auth.ts
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from './prisma'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,     // 1 day
  },
  trustedOrigins: [
    process.env.APP_URI || 'http://localhost:3000',
  ],
})

// src/server/middleware/auth.ts
import { auth } from '../lib/auth'

export const authMiddleware = async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })
  if (!session) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  c.set('session', session)
  c.set('user', session.user)
  await next()
}

// src/lib/auth-client.ts
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || '',
})

export const { signIn, signUp, signOut, useSession } = authClient
```

---

## 核心功能模块

### 1. 支付流程

```
商户请求 → 签名验证 → 计算汇率 → 查找钱包 → 锁定金额 → 创建订单 → 返回支付链接
```

### 2. 金额锁定机制

```
用户需支付 20.05 USDT
→ 遍历所有可用钱包地址
→ 尝试锁定 address_1:20.05
→ 已占用 → 尝试 address_1:20.0501 (+0.0001)
→ 最多重试 100 次
→ 锁定成功返回地址+金额
```

### 3. 链上监听

| 链 | 方式 | 频率 |
|---|---|---|
| Ethereum/BSC/Polygon | WebSocket 监听 Transfer 事件 | 实时 |
| Tron | HTTP 轮询区块 | 每 3 秒 |
| Solana | RPC 轮询账户变动 | 每 5 秒 |

### 4. 支付确认流程

```
检测到链上转入 → 解析金额+地址 → 匹配锁定记录 → 验证订单 → 更新状态 → 释放锁 → 触发回调
```

### 5. 回调机制

```
异步队列轮询待回调订单 → 发送 HTTP POST → 等待 "ok" 响应
→ 失败重试 (指数退避, 最多 5 次)
```

---

## API 接口列表

### 公开接口 (无需认证)

```
POST   /api/payments/v1/order/create-transaction    # 创建订单
GET    /api/payments/v1/config                      # 获取公共配置
POST   /api/payments/v1/order/switch-network        # 切换支付网络
GET    /api/pay/check-status/:tradeId               # 查询订单状态
```

### 认证接口 (better-auth)

```
POST   /api/auth/sign-in/email                      # 邮箱登录
POST   /api/auth/sign-up/email                      # 邮箱注册
POST   /api/auth/sign-out                           # 登出
GET    /api/auth/get-session                        # 获取 session
```

### 管理接口 (需要认证)

```
GET    /api/admin/orders                            # 订单列表
GET    /api/admin/orders/:tradeId                   # 订单详情
POST   /api/admin/orders/:tradeId/close             # 关闭订单
POST   /api/admin/orders/:tradeId/mark-paid         # 标记已付

GET    /api/admin/wallets                           # 钱包列表
POST   /api/admin/wallets                           # 添加钱包
POST   /api/admin/wallets/batch-import              # 批量导入

GET    /api/admin/chains                            # 链列表
PATCH  /api/admin/chains/:network                   # 更新链配置

GET    /api/admin/chain-tokens                      # 代币列表
POST   /api/admin/chain-tokens                      # 添加代币

GET    /api/admin/rpc-nodes                         # RPC 节点列表
POST   /api/admin/rpc-nodes                         # 添加节点

GET    /api/admin/api-keys                          # API 密钥列表
POST   /api/admin/api-keys                          # 创建密钥

GET    /api/admin/settings                          # 设置列表
PUT    /api/admin/settings                          # 更新设置

GET    /api/admin/dashboard/overview                # 仪表盘概览
```

---

## 签名算法

```typescript
import { createHash } from 'crypto'

function generateSignature(params: Record<string, any>, secretKey: string): string {
  const entries = Object.entries(params)
    .filter(([k, v]) => k !== 'signature' && v !== '' && v != null)
    .sort(([a], [b]) => a.localeCompare(b))

  const sortedStr = entries.map(([k, v]) => `${k}=${v}`).join('&')
  return createHash('md5').update(sortedStr + secretKey).digest('hex')
}
```

---

## 开发计划

### Phase 1: 项目基础 (Week 1)

- [ ] Next.js 项目初始化 (App Router)
- [ ] Hono.js API Route 配置 (`/api/[[...route]]`)
- [ ] Prisma schema + PostgreSQL 连接
- [ ] better-auth 集成
- [ ] HeroUI + Tailwind CSS 配置
- [ ] Jotai 状态管理基础

### Phase 2: 核心支付 (Week 2)

- [ ] API 密钥管理 (CRUD)
- [ ] 签名验证中间件
- [ ] 订单创建流程
- [ ] 金额锁定机制 (Prisma transaction)
- [ ] 汇率服务

### Phase 3: 链上监听 (Week 3)

- [ ] EVM 链监听 (viem WebSocket)
- [ ] Tron 监听 (HTTP 区块扫描)
- [ ] Solana 监听 (RPC 轮询)
- [ ] 支付确认逻辑

### Phase 4: 异步处理 (Week 4)

- [ ] 内存队列
- [ ] 订单过期清理
- [ ] 回调重试机制
- [ ] 通知系统 (Telegram/Webhook)

### Phase 5: 管理后台前端 (Week 5)

- [ ] 登录页面 (better-auth)
- [ ] 仪表盘 (Recharts)
- [ ] 订单管理页面
- [ ] 钱包管理页面
- [ ] 链/代币配置页面
- [ ] 设置页面

### Phase 6: 收银台 + 部署 (Week 6)

- [ ] 收银台前端页面
- [ ] Docker 支持
- [ ] API 文档
- [ ] README
- [ ] CI/CD (GitHub Actions)
- [ ] 首次发布

---

## 开源协议

MIT License - 比 EPusdt 的 GPLv3 更宽松，允许闭源二次开发。

---

## 与 EPusdt 的差异

| 特性 | EPusdt | 本项目 |
|------|--------|--------|
| 架构 | Go 单体 + 独立前端 | **Next.js 全栈 (前后端一体)** |
| License | GPLv3 | MIT |
| API | Echo REST | **Hono RPC (类型安全)** |
| 前端 | 嵌入式静态文件 | **Next.js SSR + HeroUI** |
| 数据库 | SQLite/MySQL/PostgreSQL | **PostgreSQL** |
| ORM | GORM | **Prisma** |
| 认证 | JWT 自实现 | **better-auth** |
| UI | 无 | **HeroUI + Tailwind + Jotai** |
| 类型安全 | 部分 | **端到端完全类型安全** |
| 部署 | 单二进制 | **Docker / Vercel** |

---

## 参考资源

- [EPusdt 源码](https://github.com/GMWalletApp/epusdt)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Hono.js + Next.js](https://hono.dev/docs/getting-started/vercel)
- [HeroUI](https://www.heroui.com/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Jotai](https://jotai.org/)
- [Prisma](https://www.prisma.io/)
- [better-auth](https://www.better-auth.com/)
- [viem](https://viem.sh/)
