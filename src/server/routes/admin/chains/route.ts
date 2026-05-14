import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { prisma } from '../../../lib/prisma';
import { chainParamSchema, updateChainSchema } from './schema';

export const chainsRoutes = new Hono()
	.get('/', async (c) => {
		const chains = await prisma.chain.findMany({
			include: {
				tokens: true,
				rpcNodes: true,
				wallets: true,
			},
			orderBy: { network: 'asc' },
		});

		return c.json({ data: chains });
	})
	.patch(
		'/:network',
		zValidator('param', chainParamSchema),
		zValidator('json', updateChainSchema),
		async (c) => {
			const { network } = c.req.valid('param');
			const body = c.req.valid('json');

			const chain = await prisma.chain.update({
				where: { network },
				data: body,
			});

			return c.json({ data: chain });
		},
	);
