import { FastifyInstance } from "fastify";
import { registerUser } from "./user.controller";

export const userRoute = (server: FastifyInstance) => {
  server.post("/signup", registerUser);
};
