import { z } from 'zod';

export const createApiKeySchema = z.object({
	name: z.string().optional(),
	ipWhitelist: z.string().optional(),
});

export const updateApiKeySchema = z.object({
	name: z.string().optional(),
	ipWhitelist: z.string().optional(),
	status: z.number().int().optional(),
});

export const apiKeyParamSchema = z.object({
	id: z.string(),
});

export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;
export type UpdateApiKeyInput = z.infer<typeof updateApiKeySchema>;
export type ApiKeyParamInput = z.infer<typeof apiKeyParamSchema>;
