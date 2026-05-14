import { zValidator } from '@hono/zod-validator';
import Decimal from 'decimal.js';
import { Hono } from 'hono';
import { prisma } from '../../lib/prisma';
import { verifySignature } from '../../lib/sign';
import { generateTradeId } from '../../service/order';
import { createTransactionSchema, switchNetworkSchema } from './schema';

export const paymentRoutes = new Hono()
	.post(
		'/v1/order/create-transaction',
		zValidator('json', createTransactionSchema),
		async (c) => {
			const body = c.req.valid('json');

			// 1. 查找 API Key
			const apiKey = await prisma.apiKey.findUnique({
				where: { pid: body.pid },
			});
			if (!apiKey || apiKey.status !== 1) {
				return c.json({ status_code: 401, message: 'Invalid API Key' }, 401);
			}

			// 2. 验证签名
			const { signature, ...params } = body;
			if (!verifySignature(params, apiKey.secretKey, signature)) {
				return c.json({ status_code: 401, message: 'Invalid signature' }, 401);
			}

			// 3. 检查订单是否已存在
			const existingOrder = await prisma.order.findFirst({
				where: { orderId: body.order_id },
			});
			if (existingOrder) {
				return c.json({
					status_code: 10_002,
					message: 'Order already exists',
				});
			}

			// 4. 查找链配置
			const chain = await prisma.chain.findUnique({
				where: { network: body.network },
				include: { tokens: true, wallets: true },
			});
			if (!chain?.enabled) {
				return c.json({
					status_code: 10_003,
					message: 'Chain not enabled',
				});
			}

			// 5. 查找可用钱包
			const enabledWallets = chain.wallets.filter((w) => w.enabled);
			if (enabledWallets.length === 0) {
				return c.json({
					status_code: 10_003,
					message: 'No available wallet address',
				});
			}

			// 6. 计算汇率
			const forcedRate = await getForcedUsdtRate();
			const rate = forcedRate > 0 ? 1 / forcedRate : 0;
			if (rate <= 0) {
				return c.json({
					status_code: 10_006,
					message: 'Rate calculation failed',
				});
			}

			const precision = await getAmountPrecision();
			const actualAmount = new Decimal(body.amount)
				.mul(rate)
				.toDecimalPlaces(precision)
				.toNumber();

			// 7. 锁定金额 + 创建订单
			const tradeId = generateTradeId();

			const lockResult = await lockTransaction(
				body.network,
				enabledWallets.map((w) => w.address),
				body.token.toUpperCase(),
				actualAmount,
				tradeId,
			);

			if (!lockResult) {
				return c.json({
					status_code: 10_005,
					message: 'No available amount channel',
				});
			}

			// 8. 创建订单
			const order = await prisma.order.create({
				data: {
					tradeId,
					orderId: body.order_id,
					amount: body.amount,
					currency: body.currency.toUpperCase(),
					actualAmount,
					receiveAddress: lockResult.address,
					token: body.token.toUpperCase(),
					network: body.network,
					status: 1,
					notifyUrl: body.notify_url,
					redirectUrl: body.redirect_url || '',
					name: body.name || '',
					payProvider: 'on_chain',
					apiKeyId: apiKey.id,
				},
			});

			// 9. 更新 API Key 调用次数
			await prisma.apiKey.update({
				where: { id: apiKey.id },
				data: {
					callCount: { increment: 1 },
					lastUsedAt: new Date(),
				},
			});

			const expirationTime = Math.floor(Date.now() / 1000) + 10 * 60;

			return c.json({
				status_code: 200,
				message: 'success',
				data: {
					trade_id: order.tradeId,
					order_id: order.orderId,
					amount: order.amount,
					actual_amount: order.actualAmount,
					token: order.receiveAddress,
					expiration_time: expirationTime,
					payment_url: `${process.env.BETTER_AUTH_URL}/pay/${order.tradeId}`,
				},
			});
		},
	)
	.get('/v1/config', async (c) => {
		const chains = await prisma.chain.findMany({
			where: { enabled: true },
			include: { tokens: { where: { enabled: true } } },
		});

		return c.json({
			status_code: 200,
			data: {
				chains: chains.map((chain) => ({
					network: chain.network,
					name: chain.name,
					tokens: chain.tokens.map((t) => t.symbol),
				})),
				order_expiration_minutes: 10,
				amount_precision: await getAmountPrecision(),
			},
		});
	})
	.post(
		'/v1/order/switch-network',
		zValidator('json', switchNetworkSchema),
		async (c) => {
			const body = c.req.valid('json');

			const order = await prisma.order.findUnique({
				where: { tradeId: body.trade_id },
			});

			if (!order) {
				return c.json({
					status_code: 10_008,
					message: 'Order not found',
				});
			}

			if (order.status !== 1) {
				return c.json({
					status_code: 10_009,
					message: 'Order is not pending',
				});
			}

			// TODO: 实现网络切换逻辑

			return c.json({
				status_code: 200,
				message: 'success',
				data: {
					trade_id: order.tradeId,
					network: body.network,
					token: body.token,
				},
			});
		},
	)
	.get('/check-status/:tradeId', async (c) => {
		const tradeId = c.req.param('tradeId');
		const order = await prisma.order.findUnique({
			where: { tradeId },
		});

		if (!order) {
			return c.json({ status_code: 10_008, message: 'Order not found' });
		}

		return c.json({
			status_code: 200,
			data: {
				trade_id: order.tradeId,
				order_id: order.orderId,
				status: order.status,
				amount: order.amount,
				actual_amount: order.actualAmount,
				token: order.token,
				network: order.network,
				receive_address: order.receiveAddress,
				block_transaction_id: order.blockTransactionId,
			},
		});
	});

// 辅助函数

async function getForcedUsdtRate(): Promise<number> {
	const setting = await prisma.setting.findUnique({
		where: { key: 'rate.forced_usdt_rate' },
	});
	if (!setting) return 0;
	const rate = Number.parseFloat(setting.value);
	return Number.isNaN(rate) ? 0 : rate;
}

async function getAmountPrecision(): Promise<number> {
	const setting = await prisma.setting.findUnique({
		where: { key: 'system.amount_precision' },
	});
	if (!setting) return 4;
	const precision = Number.parseInt(setting.value, 10);
	return Number.isNaN(precision) || precision < 2 || precision > 6
		? 4
		: precision;
}

async function lockTransaction(
	network: string,
	addresses: string[],
	token: string,
	amount: number,
	tradeId: string,
): Promise<{ address: string } | null> {
	const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

	for (const address of addresses) {
		try {
			await prisma.transactionLock.create({
				data: {
					network,
					address,
					token,
					amount,
					tradeId,
					expiresAt,
				},
			});
			return { address };
		} catch {
			return null;
		}
	}

	return null;
}
