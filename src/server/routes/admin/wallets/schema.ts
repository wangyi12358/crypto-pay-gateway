import { z } from "zod"

export const createWalletSchema = z.object({
  chainId: z.string(),
  address: z.string().min(1),
  label: z.string().optional(),
})

export const batchImportSchema = z.object({
  chainId: z.string(),
  addresses: z.array(z.string().min(1)).min(1),
})

export const walletParamSchema = z.object({
  id: z.string(),
})

export type CreateWalletInput = z.infer<typeof createWalletSchema>
export type BatchImportInput = z.infer<typeof batchImportSchema>
export type WalletParamInput = z.infer<typeof walletParamSchema>
