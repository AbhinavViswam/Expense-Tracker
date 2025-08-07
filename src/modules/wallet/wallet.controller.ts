import { FastifyReply, FastifyRequest } from "fastify";
import { AddToWalletBody } from "./wallet.types";

export const AddToWalletHandler = async (
  req: FastifyRequest<{ Body: AddToWalletBody }>,
  res: FastifyReply
) => {
  const { amount, description } = req.body;
  if (!amount) {
    return res.send();
  }
};
