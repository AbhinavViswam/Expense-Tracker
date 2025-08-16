import { FastifyInstance } from "fastify";
import {
  AddToWalletHandler,
  GetWalletHandler,
  SubFromWalletHandler,
  WalletTraceHandler,
} from "./wallet.controller";
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
  server.get(
    "/wallettrace",
    { preHandler: authMiddleware },
    WalletTraceHandler
  );
  server.get("/wallet", { preHandler: authMiddleware }, GetWalletHandler);
};
