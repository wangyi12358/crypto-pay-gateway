import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { prisma } from '../../../lib/prisma';
import {
	chainTokenParamSchema,
	createChainTokenSchema,
	updateChainTokenSchema,
} from './schema';

export const chainTokensRoutes = new Hono()
	.get('/', async (c) => {
		const tokens = await prisma.chainToken.findMany({
			include: { chain: true },
			orderBy: { symbol: 'asc' },
		});

		return c.json({ data: tokens });
	})
	.post('/', zValidator('json', createChainTokenSchema), async (c) => {
		const body = c.req.valid('json');

		const token = await prisma.chainToken.create({
			data: body,
		});

		return c.json({ data: token }, 201);
	})
	.patch(
		'/:id',
		zValidator('param', chainTokenParamSchema),
		zValidator('json', updateChainTokenSchema),
		async (c) => {
			const { id } = c.req.valid('param');
			const body = c.req.valid('json');

			const token = await prisma.chainToken.update({
				where: { id },
				data: body,
			});

			return c.json({ data: token });
		},
	)
	.delete('/:id', zValidator('param', chainTokenParamSchema), async (c) => {
		const { id } = c.req.valid('param');
		await prisma.chainToken.delete({ where: { id } });
		return c.json({ success: true });
	});
