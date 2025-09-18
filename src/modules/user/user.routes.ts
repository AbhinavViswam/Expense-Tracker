import { FastifyInstance } from "fastify";
import authUser, {
  getLoggedUserHandler,
  getUserDetailsHandler,
  loginUserHandler,
  logOutUserHandler,
  registerUserHandler,
} from "./user.controller";
import authMiddleware from "../../middleware/authMiddleware";
import { geminisuggestion } from "../gemini/gemini";

export const userRoute = (server: FastifyInstance) => {
  server.post("/signup", registerUserHandler);
  server.post("/login", loginUserHandler);
  server.post("/logout", logOutUserHandler);
  server.get("/getuser", { preHandler: authMiddleware }, getLoggedUserHandler);
  server.get("/getuserdetails", { preHandler: authMiddleware }, geminisuggestion);
  server.get("/checkauth", authUser);
};
