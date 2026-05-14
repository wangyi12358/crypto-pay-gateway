import { z } from 'zod';

export const createChainTokenSchema = z.object({
	chainId: z.string(),
	symbol: z.string().min(1),
	contractAddress: z.string().optional(),
	decimals: z.number().int().min(0).max(18).default(18),
	minAmount: z.number().min(0).default(0),
});

export const updateChainTokenSchema = z.object({
	symbol: z.string().min(1).optional(),
	contractAddress: z.string().optional(),
	decimals: z.number().int().min(0).max(18).optional(),
	minAmount: z.number().min(0).optional(),
	enabled: z.boolean().optional(),
});

export const chainTokenParamSchema = z.object({
	id: z.string(),
});

export type CreateChainTokenInput = z.infer<typeof createChainTokenSchema>;
export type UpdateChainTokenInput = z.infer<typeof updateChainTokenSchema>;
export type ChainTokenParamInput = z.infer<typeof chainTokenParamSchema>;
