import { Types } from "mongoose";
import { Expense } from "../../models/expense.model";
import { ServiceReturn } from "../../types";
import { Wallet } from "../../models/wallet.model";

export const addExpenses = async (
  userId,
  categoryId,
  amount,
  description
): Promise<ServiceReturn> => {
  try {
    const expense = await Expense.create({
      userid: userId,
      categoryid: categoryId,
      description,
      amount,
    });

    if (!expense) {
      return {
        success: false,
        message: "expense not added",
      };
    }
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return {
        success: false,
        message: "wallet not found",
      };
    }

    if (wallet.amount < amount) {
      return { success: false, message: "Your balance is low" };
    }

    wallet.amount -= amount;
    await wallet.save();
    return { success: true, message: "expense added" };
  } catch (error) {
    return { success: false, message: "Internal error", data: error };
  }
};

export const getExpenses = async (
  userId,
  dateRange = "daily"
): Promise<ServiceReturn> => {
  try {
    const now = new Date();
    let startDate: Date;

    if (dateRange === "daily") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (dateRange === "monthly") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      startDate = new Date(now.getFullYear(), 0, 1);
    }
    const expenses = await Expense.aggregate([
      {
        $match: {
          userid: new Types.ObjectId(userId),
          createdAt: { $gte: startDate, $lte: now },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryid",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $group: {
          _id: "$category._id",
          categoryName: { $first: "$category.categoryName" },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    return {
      success: true,
      message: "Expenses fetched successfully",
      data: expenses,
    };
  } catch (error) {
    return { success: false, message: "Internal error", data: error };
  }
};
