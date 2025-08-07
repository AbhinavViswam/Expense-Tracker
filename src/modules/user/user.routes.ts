import { FastifyInstance } from "fastify";
import {
  getLoggedUserHandler,
  loginUserHandler,
  logOutUserHandler,
  registerUserHandler,
} from "./user.controller";
import authMiddleware from "../../middleware/authMiddleware";

export const userRoute = (server: FastifyInstance) => {
  server.post("/signup", registerUserHandler);
  server.post("/login", loginUserHandler);
  server.post("/logout", logOutUserHandler);
  server.get("/getuser", { preHandler: authMiddleware }, getLoggedUserHandler);
};
