# 部署文档

## 快速开始

### 方式一: Docker (推荐)

```bash
# 创建工作目录
mkdir -p ~/crypto-pay-gateway && cd ~/crypto-pay-gateway

# 下载配置文件
curl -O https://raw.githubusercontent.com/your-org/crypto-pay-gateway/main/.env.example
cp .env.example .env

# 编辑配置
vim .env

# 启动
docker run -d \
  --name crypto-pay \
  -p 8000:8000 \
  -v $(pwd)/.env:/app/.env \
  -v $(pwd)/data:/app/data \
  your-org/crypto-pay-gateway:latest
```

### 方式二: Docker Compose

```yaml
# docker-compose.yaml
services:
  crypto-pay:
    image: your-org/crypto-pay-gateway:latest
    restart: always
    ports:
      - "8000:8000"
    volumes:
      - ./.env:/app/.env
      - ./data:/app/data
```

```bash
docker compose up -d
```

### 方式三: 手动部署

```bash
# 克隆项目
git clone https://github.com/your-org/crypto-pay-gateway.git
cd crypto-pay-gateway

# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env
vim .env

# 构建
pnpm build

# 启动
node dist/index.js serve
```

### 方式四: 宝塔面板

1. 安装 Node.js 项目管理器
2. 添加项目，选择源码目录
3. 启动命令: `node dist/index.js serve`
4. 设置开机自启

---

## 环境变量配置

```bash
# 应用配置
APP_NAME=crypto-pay
APP_URI=https://pay.example.com
HTTP_LISTEN=:8000

# 数据库 (默认 SQLite，无需配置)
# DB_TYPE=sqlite
# DB_PATH=./data/crypto-pay.db

# PostgreSQL (可选)
# DB_TYPE=postgres
# DB_URL=postgresql://user:pass@localhost:5432/crypto_pay

# 日志
LOG_LEVEL=info
LOG_SAVE_PATH=./data/logs

# 汇率
# RATE_API_URL=https://api.coingecko.com/api/v3/simple/price
# FORCED_USDT_RATE=7.2

# Telegram 通知 (可选)
# TG_BOT_TOKEN=your_bot_token
# TG_MANAGE_CHAT_ID=your_chat_id
```

---

## Nginx 反向代理

```nginx
server {
    listen 443 ssl http2;
    server_name pay.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 首次安装

部署完成后访问管理后台:

```
https://your-domain.com/admin
```

获取初始密码:

```bash
# Docker
docker logs crypto-pay 2>&1 | grep "Password"

# 或调用 API
curl https://your-domain.com/admin/api/v1/auth/init-password
```

登录后需要:

1. 修改管理员密码
2. 配置收款链和代币
3. 添加 RPC 节点
4. 导入钱包地址
5. 设置汇率 (rate.forced_usdt_rate)

---

## 添加链配置

### 1. 添加 RPC 节点

在管理后台 Settings → RPC Nodes 添加:

| 链 | 推荐 RPC |
|---|---|
| Ethereum | https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY |
| BSC | https://bsc-dataseed.binance.org |
| Polygon | https://polygon-rpc.com |
| Tron | https://api.trongrid.io |
| Solana | https://api.mainnet-beta.solana.com |

### 2. 添加钱包地址

Settings → Wallets → 添加或批量导入钱包地址。

**重要**: 钱包私钥不存储在系统中，系统只存储地址用于监听。

### 3. 设置汇率

Settings → Rate:
- `rate.forced_usdt_rate`: 固定 USDT/CNY 汇率 (如 7.2)
- `rate.api_url`: 外部汇率 API (可选)

---

## HTTPS 配置

生产环境必须使用 HTTPS，推荐使用 Let's Encrypt:

```bash
# 安装 certbot
apt install certbot

# 获取证书
certbot certonly --standalone -d pay.example.com

# 证书自动续期
crontab -e
0 0 1 * * certbot renew --quiet
```

---

## 备份

```bash
# SQLite 备份
cp ./data/crypto-pay.db ./backup/crypto-pay-$(date +%Y%m%d).db

# 定时备份 (每天凌晨 3 点)
crontab -e
0 3 * * * cp /path/to/data/crypto-pay.db /path/to/backup/crypto-pay-$(date +\%Y\%m\%d).db
```

---

## 监控

### 健康检查

```bash
curl https://your-domain.com/health
```

### 日志查看

```bash
# Docker
docker logs -f crypto-pay

# 手动部署
tail -f ./data/logs/app.log
```

---

## 升级

```bash
# Docker
docker pull your-org/crypto-pay-gateway:latest
docker compose down && docker compose up -d

# 手动部署
git pull
pnpm install
pnpm build
# 重启进程
pm2 restart crypto-pay
```

---

## 常见问题

### 订单创建失败 10006 (汇率错误)

检查 `rate.forced_usdt_rate` 是否设置 > 0。

### 钱包地址无法添加

确保对应的链 (chain) 已启用。

### 回调失败

- 检查商户服务器是否可达
- 检查签名算法是否正确
- 查看日志中的回调请求详情

### SQLite 锁冲突

高并发场景建议切换到 PostgreSQL。
