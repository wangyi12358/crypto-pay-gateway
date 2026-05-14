import { z } from 'zod';

export const chainParamSchema = z.object({
	network: z.string(),
});

export const updateChainSchema = z.object({
	name: z.string().optional(),
	enabled: z.boolean().optional(),
});

export type ChainParamInput = z.infer<typeof chainParamSchema>;
export type UpdateChainInput = z.infer<typeof updateChainSchema>;
