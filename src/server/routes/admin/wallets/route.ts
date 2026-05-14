import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { prisma } from '../../../lib/prisma';
import {
	batchImportSchema,
	createWalletSchema,
	walletParamSchema,
} from './schema';

export const walletsRoutes = new Hono()
	.get('/', async (c) => {
		const wallets = await prisma.walletAddress.findMany({
			include: { chain: true },
			orderBy: { createdAt: 'desc' },
		});

		return c.json({ data: wallets });
	})
	.post('/', zValidator('json', createWalletSchema), async (c) => {
		const body = c.req.valid('json');

		const wallet = await prisma.walletAddress.create({
			data: body,
		});

		return c.json({ data: wallet }, 201);
	})
	.post('/batch-import', zValidator('json', batchImportSchema), async (c) => {
		const { chainId, addresses } = c.req.valid('json');

		const results = await prisma.$transaction(
			addresses.map((address) =>
				prisma.walletAddress.create({
					data: { chainId, address },
				}),
			),
		);

		return c.json({ data: results, count: results.length });
	})
	.delete('/:id', zValidator('param', walletParamSchema), async (c) => {
		const { id } = c.req.valid('param');
		await prisma.walletAddress.delete({ where: { id } });
		return c.json({ success: true });
	});
