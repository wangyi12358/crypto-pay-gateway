import { z } from "zod"

export const createRpcNodeSchema = z.object({
  chainId: z.string(),
  url: z.string().url(),
  nodeType: z.enum(["http", "ws"]).default("http"),
  apiKey: z.string().optional(),
})

export const updateRpcNodeSchema = z.object({
  url: z.string().url().optional(),
  nodeType: z.enum(["http", "ws"]).optional(),
  apiKey: z.string().optional(),
  enabled: z.boolean().optional(),
})

export const rpcNodeParamSchema = z.object({
  id: z.string(),
})

export type CreateRpcNodeInput = z.infer<typeof createRpcNodeSchema>
export type UpdateRpcNodeInput = z.infer<typeof updateRpcNodeSchema>
export type RpcNodeParamInput = z.infer<typeof rpcNodeParamSchema>
