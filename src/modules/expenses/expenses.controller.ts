import { FastifyReply, FastifyRequest } from "fastify";
import { ExpenseBody, GetExpenseBody } from "./expenses.types";
import { addExpenses, getExpenses } from "./expenses.service";

export const addExpenseHandler = async (
  req: FastifyRequest<{ Body: ExpenseBody }>,
  res: FastifyReply
) => {
  const id = (req as any).user._id;
  const { amount, description, categoryId } = req.body;
  const addExpense = await addExpenses(id, categoryId, amount, description);
  if (!addExpense.success) {
    throw new Error(addExpense?.message || "some error occured");
  }
  return res.send({ message: addExpense.message, data: addExpense.data });
};

export const getExpenseHandler = async (
  req: FastifyRequest<{ Querystring: GetExpenseBody }>,
  res: FastifyReply
) => {
  const id = (req as any).user._id;
  const { dateRange } = req.query;
  const expense = await getExpenses(id, dateRange);
  if (!expense.success) {
    throw new Error(expense?.message || "some error occured");
  }
  return res.send({ message: expense.message, data: expense.data });
};
