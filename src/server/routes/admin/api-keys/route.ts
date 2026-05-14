import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { prisma } from "../../../lib/prisma"
import { nanoid } from "nanoid"
import { createHash } from "crypto"
import {
  createApiKeySchema,
  updateApiKeySchema,
  apiKeyParamSchema,
} from "./schema"

export const apiKeysRoutes = new Hono()
  .get("/", async (c) => {
    const keys = await prisma.apiKey.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        pid: true,
        name: true,
        ipWhitelist: true,
        status: true,
        callCount: true,
        lastUsedAt: true,
        createdAt: true,
      },
    })

    return c.json({ data: keys })
  })
  .post(
    "/",
    zValidator("json", createApiKeySchema),
    async (c) => {
      const body = c.req.valid("json")

      const pid = nanoid(10)
      const secretKey = createHash("sha256")
        .update(nanoid(32))
        .digest("hex")

      const apiKey = await prisma.apiKey.create({
        data: {
          pid,
          secretKey,
          name: body.name || "",
          ipWhitelist: body.ipWhitelist || "",
        },
      })

      return c.json(
        {
          data: {
            ...apiKey,
            secretKey,
          },
        },
        201
      )
    }
  )
  .patch(
    "/:id",
    zValidator("param", apiKeyParamSchema),
    zValidator("json", updateApiKeySchema),
    async (c) => {
      const { id } = c.req.valid("param")
      const body = c.req.valid("json")

      const apiKey = await prisma.apiKey.update({
        where: { id },
        data: body,
      })

      return c.json({ data: apiKey })
    }
  )
  .delete(
    "/:id",
    zValidator("param", apiKeyParamSchema),
    async (c) => {
      const { id } = c.req.valid("param")
      await prisma.apiKey.delete({ where: { id } })
      return c.json({ success: true })
    }
  )
