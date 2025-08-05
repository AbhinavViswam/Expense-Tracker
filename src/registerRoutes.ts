import { FastifyInstance } from "fastify";
import { userRoute } from "./modules/user/user.routes";

export default function registerRoutes(server: FastifyInstance) {
  server.register(userRoute, { prefix: "/api/user" });
}
