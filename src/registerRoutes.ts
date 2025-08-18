import { FastifyInstance } from "fastify";
import { userRoute } from "./modules/user/user.routes";
import { walletRoute } from "./modules/wallet/wallet.routes";
import { categoryRoute } from "./modules/category/category.routes";
import { expenseRoute } from "./modules/expenses/expenses.routes";

export default function registerRoutes(server: FastifyInstance) {
  server.register(userRoute, { prefix: "/api/user" });
  server.register(walletRoute, { prefix: "/api/wallet" });
  server.register(categoryRoute, { prefix: "/api/category" });
  server.register(expenseRoute, { prefix: "/api/expense" });
}
