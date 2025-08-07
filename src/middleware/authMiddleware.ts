import { FastifyReply, FastifyRequest } from "fastify";
import { getUserById } from "../modules/user/user.service";
import { verifyToken } from "../config/auth";

export default async function authMiddleware(
  req: FastifyRequest,
  res: FastifyReply
) {
  const token = req?.cookies?.token;
  if (!token) {
    return res.code(401).send({ error: "Unauthorized" });
  }
  try {
    const decoded = await verifyToken(token);
    const user = await getUserById(decoded.userId);
    if (!user) throw new Error("user not found");
    (req as any).user = user?.data;
  } catch {
    return res.code(401).send({ error: "Unauthorized" });
  }
}
