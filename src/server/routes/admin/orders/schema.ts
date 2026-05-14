import { z } from 'zod';

export const listOrdersSchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	pageSize: z.coerce.number().int().positive().max(100).default(20),
	status: z.coerce.number().int().optional(),
});

export const orderParamSchema = z.object({
	tradeId: z.string(),
});

export type ListOrdersInput = z.infer<typeof listOrdersSchema>;
export type OrderParamInput = z.infer<typeof orderParamSchema>;
