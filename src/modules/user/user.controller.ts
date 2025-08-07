import { FastifyRequest, FastifyReply } from "fastify";
import { LoginUserBody, RegisterUserBody } from "./user.types";
import { createUser, getUserById, loginUser, logOutUser } from "./user.service";
import { hashPassword, signToken } from "../../config/auth";
import { createWallet } from "../wallet/wallet.service";

export const registerUserHandler = async (
  req: FastifyRequest<{ Body: RegisterUserBody }>,
  res: FastifyReply
) => {
  const { name, phone, email, password } = req.body;

  if (!name || !phone || !email || !password) {
    return res.send({
      error: "All fields are required",
    });
  }

  const hashedPass = await hashPassword(password);

  const user = await createUser(name, email, phone, hashedPass);

  if (!user.success) {
    return res.send({ error: user?.data || "", message: user.message });
  }

  const wallet = await createWallet(user?.data?._id);

  if (!wallet.success) {
    return res.send({ error: wallet?.data || "", message: wallet.message });
  }

  const token = signToken({ userId: user?.data?._id });

  res.setCookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60,
    path: "/",
  });

  return res.send({ message: user.message });
};

export const loginUserHandler = async (
  req: FastifyRequest<{ Body: LoginUserBody }>,
  res: FastifyReply
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.send({
      error: "All fields are required",
    });
  }

  const user = await loginUser(email, password);

  if (!user.success) {
    return res.send({ error: user.message });
  }

  const wallet = await createWallet(user?.data?._id);

  if (!wallet.success) {
    return res.send({ error: wallet?.data || "", message: wallet.message });
  }

  const token = signToken({ userId: user.data._id });

  res.setCookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60,
    path: "/",
  });
  return res.send({ message: user.message, data: user.data });
};

export const logOutUserHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  return await logOutUser(req, res);
};

export const getLoggedUserHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const id = (req as any).user._id;
  const user = await getUserById(id);
  if (!user.success) {
    return res.send({ error: user.message });
  }
  return res.send({ data: user.data });
};
