import { FastifyInstance } from "fastify";
import authMiddleware from "../../middleware/authMiddleware";
import { addExpenseHandler, getCreditedExpenseHandler, getExpenseHandler } from "./expenses.controller";

export const expenseRoute = (server: FastifyInstance) => {
  server.post("/addexpense", { preHandler: authMiddleware }, addExpenseHandler);
  server.get("/getexpense", { preHandler: authMiddleware }, getExpenseHandler);
  server.get("/getcreditedexpense", { preHandler: authMiddleware }, getCreditedExpenseHandler);
};
