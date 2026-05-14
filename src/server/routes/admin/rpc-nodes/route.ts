import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { prisma } from "../../../lib/prisma"
import {
  createRpcNodeSchema,
  updateRpcNodeSchema,
  rpcNodeParamSchema,
} from "./schema"

export const rpcNodesRoutes = new Hono()
  .get("/", async (c) => {
    const nodes = await prisma.rpcNode.findMany({
      include: { chain: true },
      orderBy: { createdAt: "desc" },
    })

    return c.json({ data: nodes })
  })
  .post(
    "/",
    zValidator("json", createRpcNodeSchema),
    async (c) => {
      const body = c.req.valid("json")

      const node = await prisma.rpcNode.create({
        data: body,
      })

      return c.json({ data: node }, 201)
    }
  )
  .patch(
    "/:id",
    zValidator("param", rpcNodeParamSchema),
    zValidator("json", updateRpcNodeSchema),
    async (c) => {
      const { id } = c.req.valid("param")
      const body = c.req.valid("json")

      const node = await prisma.rpcNode.update({
        where: { id },
        data: body,
      })

      return c.json({ data: node })
    }
  )
  .delete(
    "/:id",
    zValidator("param", rpcNodeParamSchema),
    async (c) => {
      const { id } = c.req.valid("param")
      await prisma.rpcNode.delete({ where: { id } })
      return c.json({ success: true })
    }
  )
