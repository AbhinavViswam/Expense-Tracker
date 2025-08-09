import { FastifyInstance } from "fastify";
import authMiddleware from "../../middleware/authMiddleware";
import {
  addCategoryHandler,
  deleteCategoryHandler,
  getCategoriesForUserHandler,
} from "./category.controller";

export const categoryRoute = (server: FastifyInstance) => {
  server.post("/", { preHandler: authMiddleware }, addCategoryHandler);
  server.get("/", { preHandler: authMiddleware }, getCategoriesForUserHandler);
  server.delete("/:categoryid", { preHandler: authMiddleware }, deleteCategoryHandler);
};
