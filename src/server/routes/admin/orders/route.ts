import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { prisma } from '../../../lib/prisma';
import { listOrdersSchema, orderParamSchema } from './schema';

export const ordersRoutes = new Hono()
	.get('/', zValidator('query', listOrdersSchema), async (c) => {
		const { page, pageSize, status } = c.req.valid('query');
		const where = status === undefined ? {} : { status };

		const [orders, total] = await Promise.all([
			prisma.order.findMany({
				where,
				orderBy: { createdAt: 'desc' },
				skip: (page - 1) * pageSize,
				take: pageSize,
			}),
			prisma.order.count({ where }),
		]);

		return c.json({
			data: orders,
			pagination: {
				page,
				pageSize,
				total,
				totalPages: Math.ceil(total / pageSize),
			},
		});
	})
	.get('/:tradeId', zValidator('param', orderParamSchema), async (c) => {
		const { tradeId } = c.req.valid('param');
		const order = await prisma.order.findUnique({
			where: { tradeId },
		});

		if (!order) {
			return c.json({ error: 'Order not found' }, 404);
		}

		return c.json({ data: order });
	})
	.post('/:tradeId/close', zValidator('param', orderParamSchema), async (c) => {
		const { tradeId } = c.req.valid('param');
		const order = await prisma.order.update({
			where: { tradeId },
			data: { status: 3 },
		});

		return c.json({ data: order });
	})
	.post(
		'/:tradeId/mark-paid',
		zValidator('param', orderParamSchema),
		async (c) => {
			const { tradeId } = c.req.valid('param');
			const order = await prisma.order.update({
				where: { tradeId },
				data: { status: 2 },
			});

			return c.json({ data: order });
		},
	);
