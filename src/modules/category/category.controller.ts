import { FastifyReply, FastifyRequest } from "fastify";
import { CategoryBody, CategoryParams } from "./category.types";
import {
  addCategory,
  deleteCategory,
  getCategoriesForUser,
} from "./category.service";

export const addCategoryHandler = async (
  req: FastifyRequest<{ Body: CategoryBody }>,
  res: FastifyReply
) => {
  const id = (req as any).user._id;
  const categoryName = req.body.categoryName;
  if (!categoryName) return res.send({ error: "All fields are required" });
  const category = await addCategory(id, categoryName);
  if (!category.success) {
    throw new Error(category.message);
  }
  return res.send({ data: category.data, message: category.message });
};

export const deleteCategoryHandler = async (
  req: FastifyRequest<{ Params: CategoryParams }>,
  res: FastifyReply
) => {
  const categoryId = req.params.categoryid;
  const category = await deleteCategory(categoryId);
  if (!category.success) {
    throw new Error(category.message);
  }
  return res.send({ data: category.data, message: category.message });
};

export const getCategoriesForUserHandler = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const userId = (req as any).user._id;
  const category = await getCategoriesForUser(userId);
  if (!category.success) {
    throw new Error(category.message);
  }
  return res.send({ data: category.data, message: category.message });
};
