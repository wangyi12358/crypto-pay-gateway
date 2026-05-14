import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { prisma } from '../../../lib/prisma';
import {
	listSettingsSchema,
	settingParamSchema,
	upsertSettingsSchema,
} from './schema';

export const settingsRoutes = new Hono()
	.get('/', zValidator('query', listSettingsSchema), async (c) => {
		const { group } = c.req.valid('query');
		const where = group ? { group } : {};

		const settings = await prisma.setting.findMany({
			where,
			orderBy: { key: 'asc' },
		});

		return c.json({ data: settings });
	})
	.put('/', zValidator('json', upsertSettingsSchema), async (c) => {
		const { items } = c.req.valid('json');

		const results = await Promise.all(
			items.map((item) =>
				prisma.setting.upsert({
					where: { key: item.key },
					create: {
						key: item.key,
						value: item.value,
						type: item.type,
						group: item.group,
					},
					update: {
						value: item.value,
						type: item.type,
						group: item.group,
					},
				}),
			),
		);

		return c.json({ data: results });
	})
	.delete('/:key', zValidator('param', settingParamSchema), async (c) => {
		const { key } = c.req.valid('param');
		await prisma.setting.delete({ where: { key } });
		return c.json({ success: true });
	});
