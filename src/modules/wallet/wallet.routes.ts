import { FastifyInstance } from "fastify";
import { AddToWalletHandler, SubFromWalletHandler } from "./wallet.controller";
import authMiddleware from "../../middleware/authMiddleware";

export const walletRoute = (server: FastifyInstance) => {
  server.post(
    "/addtowallet",
    { preHandler: authMiddleware },
    AddToWalletHandler
  );
  server.post(
    "/subfromwallet",
    { preHandler: authMiddleware },
    SubFromWalletHandler
  );
};
