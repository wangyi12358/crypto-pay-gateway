import { Hono } from 'hono';
import { apiKeysRoutes } from './api-keys/route';
import { chainTokensRoutes } from './chain-tokens/route';
import { chainsRoutes } from './chains/route';
import { dashboardRoutes } from './dashboard/route';
import { ordersRoutes } from './orders/route';
import { rpcNodesRoutes } from './rpc-nodes/route';
import { settingsRoutes } from './settings/route';
import { walletsRoutes } from './wallets/route';

export const adminRoutes = new Hono()
	.route('/orders', ordersRoutes)
	.route('/wallets', walletsRoutes)
	.route('/chains', chainsRoutes)
	.route('/chain-tokens', chainTokensRoutes)
	.route('/rpc-nodes', rpcNodesRoutes)
	.route('/api-keys', apiKeysRoutes)
	.route('/settings', settingsRoutes)
	.route('/dashboard', dashboardRoutes);
