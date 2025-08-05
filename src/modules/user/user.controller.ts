import { FastifyRequest, FastifyReply } from "fastify";
import { RegisterUserBody } from "./user.types";
import { createUser } from "./user.service";
import { hashPassword, signToken } from "../../config/auth";

export const registerUser = async (
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
    return res.send({ error: user.data, message: user.message });
  }

  const token = signToken({ userId: user.data._id });

  res.setCookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60,
  });

  return res.send({ message: user.message });
};
