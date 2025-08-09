import { Category } from "../../models/category.model";
import { Expense } from "../../models/expense.model";
import userModel from "../../models/user.model";
import { ServiceReturn } from "../../types";
import mongoose from "mongoose";

export const addCategory = async (
  userId,
  categoryName
): Promise<ServiceReturn> => {
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return { success: false, message: "User not found" };
    }
    const category = await Category.create({
      userId,
      categoryName,
    });
    if (!category) return { success: false, message: "Category not created" };
    return { success: true, message: "created category", data: category };
  } catch (error) {
    return {
      success: false,
      message: "Internal server error",
      data: error,
    };
  }
};

export const deleteCategory = async (categoryId): Promise<ServiceReturn> => {
  try {
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists)
      return { success: false, message: "category doesnot exists" };
    const expenseExists = await Expense.findOne({ categoryid: categoryId });
    if (expenseExists)
      return { success: false, message: "This category is in use" };
    await Category.findByIdAndDelete(categoryId);
    return { success: true, message: "Category deleted" };
  } catch (error) {
    return {
      success: false,
      message: "Internal server error",
      data: error,
    };
  }
};

export const getCategoriesForUser = async (userId): Promise<ServiceReturn> => {
  try {
    const category = await Category.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    ]);
    if (!category) return { success: false, message: "category not found" };
    return { success: true, message: "categories fetched", data: category };
  } catch (error) {
    return {
      success: false,
      message: "Internal server error",
      data: error,
    };
  }
};
