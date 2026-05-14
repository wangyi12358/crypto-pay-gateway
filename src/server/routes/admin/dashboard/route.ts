import { Hono } from "hono"
import { prisma } from "../../../lib/prisma"

export const dashboardRoutes = new Hono().get("/overview", async (c) => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    totalOrders,
    todayOrders,
    monthOrders,
    totalAmount,
    todayAmount,
    monthAmount,
    pendingOrders,
    paidOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({
      where: { createdAt: { gte: today } },
    }),
    prisma.order.count({
      where: { createdAt: { gte: thisMonth } },
    }),
    prisma.order.aggregate({
      _sum: { actualAmount: true },
      where: { status: 2 },
    }),
    prisma.order.aggregate({
      _sum: { actualAmount: true },
      where: { status: 2, createdAt: { gte: today } },
    }),
    prisma.order.aggregate({
      _sum: { actualAmount: true },
      where: { status: 2, createdAt: { gte: thisMonth } },
    }),
    prisma.order.count({ where: { status: 1 } }),
    prisma.order.count({ where: { status: 2 } }),
  ])

  return c.json({
    data: {
      orders: {
        total: totalOrders,
        today: todayOrders,
        month: monthOrders,
        pending: pendingOrders,
        paid: paidOrders,
      },
      amount: {
        total: totalAmount._sum.actualAmount || 0,
        today: todayAmount._sum.actualAmount || 0,
        month: monthAmount._sum.actualAmount || 0,
      },
    },
  })
})
