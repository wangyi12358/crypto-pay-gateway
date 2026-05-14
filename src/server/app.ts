import { Hono } from "hono"
import { logger } from "hono/logger"
import { requestId } from "hono/request-id"
import { cors } from "hono/cors"
import { paymentRoutes } from "./routes/payment/route"
import { adminRoutes } from "./routes/admin/index"
import { authMiddleware } from "./middleware/auth"

const app = new Hono().basePath("/api")

// 全局中间件
app.use("*", logger())
app.use("*", requestId())
app.use(
  "*",
  cors({
    origin: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    credentials: true,
  })
)

// 公开路由 (支付)
app.route("/payments", paymentRoutes)

// 认证路由 (better-auth)
app.on(["POST", "GET"], "/auth/*", async (c) => {
  const { auth } = await import("./lib/auth")
  return auth.handler(c.req.raw)
})

// 管理路由 (需要认证)
app.use("/admin/*", authMiddleware)
app.route("/admin", adminRoutes)

// 健康检查
app.get("/health", (c) => c.json({ status: "ok" }))

// 404
app.notFound((c) => {
  return c.json({ message: "Not Found" }, 404)
})

// 错误处理
app.onError((err, c) => {
  console.error(err)
  return c.json({ message: "Internal Server Error" }, 500)
})

export type AppType = typeof app

export default app
