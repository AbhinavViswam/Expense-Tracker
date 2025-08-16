import { FastifyReply, FastifyRequest } from "fastify";
import { AddToWalletBody } from "./wallet.types";
import {
  AddToWallet,
  getWallet,
  getWalletTrace,
  SubFromWallet,
} from "./wallet.service";

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
  if (!addtowallet.success) {
    throw new Error(addtowallet?.message || "not added to wallet");
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
  if (!subfromwallet.success) {
    throw new Error(subfromwallet?.message || "not deleted from wallet");
  }
  return res.send({ message: subfromwallet.message, data: subfromwallet.data });
};

export const WalletTraceHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const id = (req as any).user._id;
  const wallettrace = await getWalletTrace(id);
  if (!wallettrace.success) {
    throw new Error(wallettrace?.message || "some error occured");
  }
  return res.send({ message: wallettrace.message, data: wallettrace.data });
};

export const GetWalletHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const id = (req as any).user._id;
  const wallet = await getWallet(id);
  if (!wallet.success) {
    throw new Error(wallet?.message || "some error occured");
  }
  return res.send({ message: wallet.message, data: wallet.data });
};
