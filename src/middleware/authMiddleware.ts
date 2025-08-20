import { FastifyReply, FastifyRequest } from "fastify";
import { getUserById } from "../modules/user/user.service";
import { verifyToken } from "../config/auth";

export default async function authMiddleware(
  req: FastifyRequest,
  res: FastifyReply
) {
  try {
    // Try cookie first, then fallback to Authorization header
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);
    console.log("token:", token);
    if (!token) {
      return res.code(401).send({ error: "Unauthorized" });
    }

    const decoded = await verifyToken(token);
    const user = await getUserById(decoded.userId);

    if (!user) {
      return res.code(404).send({ error: "User not found" });
    }

    // Attach user to request for downstream handlers
    (req as any).user = user?.data;
  } catch (err) {
    return res.code(401).send({ error: "Unauthorized" });
  }
}
