import { FastifyInstance } from "fastify";
import authMiddleware from "../../middleware/authMiddleware";
import { createMailHandler, deleteMailHandler, getMailHandler } from "./mail.controller";

export const mailRoute = (server:FastifyInstance) => {
    server.post("/createmail",{preHandler:authMiddleware},createMailHandler);
    server.get("/",{preHandler:authMiddleware},getMailHandler)
    server.delete("/:mailid",{preHandler:authMiddleware},deleteMailHandler)
}