import { FastifyRequest, FastifyReply } from "fastify";
import { LoginUserBody, RegisterUserBody } from "./user.types";
import { createUser, getUserById, loginUser, logOutUser } from "./user.service";
import { hashPassword, signToken, verifyToken } from "../../config/auth";
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
    throw new Error(user.message);
  }

  const wallet = await createWallet(user?.data?._id);

  if (!wallet.success) {
    throw new Error(wallet.message);
  }

  const token = signToken({ userId: user?.data?._id });

  res.setCookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60,
    path: "/",
  });

  const userDetails = await getUserById(user?.data?._id);

  return res.send({ message: user.message, data: userDetails });
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
    throw new Error(user.message);
  }

  const wallet = await createWallet(user?.data?._id);

  if (!wallet.success) {
    throw new Error(wallet.message);
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
    throw new Error(user.message);
  }
  return res.send({ data: user.data });
};

export default async function authUser(req: FastifyRequest, res: FastifyReply) {
  const token = req?.cookies?.token;
  if (!token) {
    throw new Error("Unauthorized");
  }
  try {
    const decoded = await verifyToken(token);
    const user = await getUserById(decoded.userId);
    if (!user) throw new Error("user not found");
    return res.send({ userData: user?.data });
  } catch {
    return res.code(401).send({ error: "Unauthorized" });
  }
}
