import { Hono } from "hono"
import { authMiddleware } from "../../middleware/auth"
import { ordersRoutes } from "./orders/route"
import { walletsRoutes } from "./wallets/route"
import { chainsRoutes } from "./chains/route"
import { chainTokensRoutes } from "./chain-tokens/route"
import { rpcNodesRoutes } from "./rpc-nodes/route"
import { apiKeysRoutes } from "./api-keys/route"
import { settingsRoutes } from "./settings/route"
import { dashboardRoutes } from "./dashboard/route"

export const adminRoutes = new Hono()
  .route("/orders", ordersRoutes)
  .route("/wallets", walletsRoutes)
  .route("/chains", chainsRoutes)
  .route("/chain-tokens", chainTokensRoutes)
  .route("/rpc-nodes", rpcNodesRoutes)
  .route("/api-keys", apiKeysRoutes)
  .route("/settings", settingsRoutes)
  .route("/dashboard", dashboardRoutes)
