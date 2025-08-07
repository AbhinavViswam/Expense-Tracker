import { FastifyReply, FastifyRequest } from "fastify";
import { AddToWalletBody } from "./wallet.types";
import { AddToWallet, SubFromWallet } from "./wallet.service";

export const AddToWalletHandler = async (
  req: FastifyRequest<{ Body: AddToWalletBody }>,
  res: FastifyReply
) => {
  const { amount, description } = req.body;
  const id = (req as any).user._id;
  if (!amount) {
    return res.send({ error: "all fields are required" });
  }
  const addtowallet = await AddToWallet(id, amount, description);
  if (!addtowallet) {
    return res.send({ error: addtowallet.message });
  }
  return res.send({ message: addtowallet.message, data: addtowallet.data });
};

export const SubFromWalletHandler = async (
  req: FastifyRequest<{ Body: AddToWalletBody }>,
  res: FastifyReply
) => {
  const { amount, description } = req.body;
  const id = (req as any).user._id;
  if (!amount) {
    return res.send({ error: "all fields are required" });
  }
  const subfromwallet = await SubFromWallet(id, amount, description);
  if (!subfromwallet) {
    return res.send({ error: subfromwallet.message });
  }
  return res.send({ message: subfromwallet.message, data: subfromwallet.data });
};
