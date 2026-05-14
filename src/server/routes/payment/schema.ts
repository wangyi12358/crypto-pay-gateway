import { z } from "zod"

export const createTransactionSchema = z.object({
  pid: z.string(),
  order_id: z.string().max(32),
  amount: z.number().positive().min(0.01),
  token: z.enum(["usdt", "usdc"]),
  network: z.enum(["ethereum", "bsc", "polygon", "tron", "solana"]),
  currency: z.enum(["cny", "usd"]),
  notify_url: z.string().url(),
  redirect_url: z.string().url().optional(),
  name: z.string().optional(),
  signature: z.string(),
})

export const switchNetworkSchema = z.object({
  trade_id: z.string(),
  token: z.string(),
  network: z.enum(["ethereum", "bsc", "polygon", "tron", "solana", "okpay"]),
})

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
export type SwitchNetworkInput = z.infer<typeof switchNetworkSchema>
