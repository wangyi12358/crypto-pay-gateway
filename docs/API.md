# API 接口文档

## 通用说明

### 基础地址

```
https://your-domain.com
```

### 签名算法

所有支付接口需要携带 `signature` 参数，算法如下：

1. 取所有非空参数（排除 `signature`），按 key 字典序排序
2. 拼成 `key1=value1&key2=value2` 字符串
3. 末尾拼接 `secret_key`，做 MD5，得到 32 位小写 hex

```typescript
import { createHash } from 'crypto';

function sign(params: Record<string, any>, secretKey: string): string {
  const sorted = Object.entries(params)
    .filter(([k, v]) => k !== 'signature' && v !== '' && v != null)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('&');

  return createHash('md5').update(sorted + secretKey).digest('hex');
}
```

### 响应格式

```json
{
  "status_code": 200,
  "message": "success",
  "data": { ... },
  "request_id": "uuid"
}
```

### 状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 系统错误 |
| 401 | 签名认证错误 |
| 10002 | 交易已存在 |
| 10003 | 无可用钱包地址 |
| 10004 | 金额有误 |
| 10005 | 无可用金额通道 |
| 10006 | 汇率计算错误 |
| 10008 | 订单不存在 |
| 10009 | 参数解析失败 |

---

## 支付接口

### 创建交易

```
POST /payments/v1/order/create-transaction
```

**请求参数 (JSON):**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| pid | string | 是 | 商户 ID |
| order_id | string | 是 | 商户订单号 (最大 32 字符) |
| amount | number | 是 | 支付金额 (法币，最少 0.01) |
| token | string | 是 | 代币符号: usdt / usdc |
| network | string | 是 | 网络: ethereum / tron / bsc / polygon / solana |
| currency | string | 是 | 法币: cny / usd |
| notify_url | string | 是 | 异步回调地址 |
| redirect_url | string | 否 | 同步跳转地址 |
| name | string | 否 | 商品名称 |
| signature | string | 是 | 签名 |

**请求示例:**

```json
{
  "pid": "1000",
  "order_id": "ORD20240101001",
  "amount": 100.00,
  "token": "usdt",
  "network": "ethereum",
  "currency": "cny",
  "notify_url": "https://example.com/api/notify",
  "redirect_url": "https://example.com/pay/success",
  "name": "VIP月卡",
  "signature": "a1b2c3d4..."
}
```

**成功响应:**

```json
{
  "status_code": 200,
  "message": "success",
  "data": {
    "trade_id": "20240101120000123456",
    "order_id": "ORD20240101001",
    "amount": 100.00,
    "actual_amount": 13.8889,
    "token": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    "expiration_time": 1704067800,
    "payment_url": "https://your-domain.com/pay/checkout-counter/20240101120000123456"
  },
  "request_id": "uuid"
}
```

### 获取公共配置

```
GET /payments/v1/config
```

**响应:**

```json
{
  "status_code": 200,
  "data": {
    "chains": [
      {
        "network": "ethereum",
        "name": "Ethereum",
        "tokens": ["USDT", "USDC"]
      }
    ],
    "order_expiration_minutes": 10,
    "amount_precision": 4
  }
}
```

### 切换支付网络

```
POST /payments/v1/order/switch-network
```

**请求参数 (JSON):**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| trade_id | string | 是 | 原订单交易号 |
| token | string | 是 | 目标代币 |
| network | string | 是 | 目标网络 |

---

## 异步回调

支付成功后，系统向 `notify_url` 发送 POST 请求。

**回调参数 (JSON):**

| 参数 | 类型 | 说明 |
|------|------|------|
| trade_id | string | 平台交易号 |
| order_id | string | 商户订单号 |
| amount | number | 法币金额 |
| actual_amount | number | 实际加密货币金额 |
| token | string | 代币符号 |
| network | string | 网络 |
| block_transaction_id | string | 链上交易哈希 |
| status | number | 2=支付成功 |
| signature | string | 签名 |

**商户验证步骤:**

1. 验证签名是否正确
2. 验证金额是否匹配
3. 处理业务逻辑
4. 返回字符串 `ok`

**重试策略:**

- 最多重试 5 次
- 指数退避: 5s → 10s → 20s → 40s → 80s
- 响应 `ok` 或 `success` 视为成功

---

## 管理接口

### 登录

```
POST /admin/api/v1/auth/login
```

**请求:**

```json
{
  "username": "admin",
  "password": "your_password"
}
```

**响应:**

```json
{
  "status_code": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_at": 1704153600
  }
}
```

### 订单列表

```
GET /admin/api/v1/orders?page=1&size=20&status=1
Authorization: Bearer <token>
```

### 钱包管理

```
GET    /admin/api/v1/wallets
POST   /admin/api/v1/wallets          # 添加钱包
POST   /admin/api/v1/wallets/batch-import  # 批量导入
DELETE /admin/api/v1/wallets/:id
```

### 设置管理

```
GET /admin/api/v1/settings
PUT /admin/api/v1/settings
```

**更新设置:**

```json
{
  "items": [
    {
      "group": "rate",
      "key": "rate.forced_usdt_rate",
      "value": "7.2",
      "type": "string"
    }
  ]
}
```

---

## SDK 示例

### Node.js

```typescript
import { createHash } from 'crypto';

interface CreateOrderParams {
  pid: string;
  orderId: string;
  amount: number;
  token: string;
  network: string;
  currency: string;
  notifyUrl: string;
  redirectUrl?: string;
  name?: string;
  secretKey: string;
}

function sign(params: Record<string, any>, secretKey: string): string {
  const sorted = Object.entries(params)
    .filter(([k, v]) => k !== 'signature' && v !== '' && v != null)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('&');
  return createHash('md5').update(sorted + secretKey).digest('hex');
}

async function createOrder(baseUrl: string, params: CreateOrderParams) {
  const body = {
    pid: params.pid,
    order_id: params.orderId,
    amount: params.amount,
    token: params.token,
    network: params.network,
    currency: params.currency,
    notify_url: params.notifyUrl,
    redirect_url: params.redirectUrl || '',
    name: params.name || '',
  };

  body.signature = sign(body, params.secretKey);

  const resp = await fetch(`${baseUrl}/payments/v1/order/create-transaction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  return resp.json();
}
```

### Python

```python
import hashlib
import requests

def sign(params: dict, secret_key: str) -> str:
    filtered = {k: v for k, v in params.items() 
                if k != 'signature' and v is not None and v != ''}
    sorted_str = '&'.join(f'{k}={v}' for k, v in sorted(filtered.items()))
    return hashlib.md5((sorted_str + secret_key).encode()).hexdigest()

def create_order(base_url: str, params: dict, secret_key: str):
    params['signature'] = sign(params, secret_key)
    resp = requests.post(f'{base_url}/payments/v1/order/create-transaction', json=params)
    return resp.json()
```
