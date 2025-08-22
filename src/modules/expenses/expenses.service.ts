import { Types } from "mongoose";
import { Expense } from "../../models/expense.model";
import { ServiceReturn } from "../../types";
import { Wallet } from "../../models/wallet.model";

export const addExpenses = async (
  userId,
  categoryId,
  amount,
  description,
  status,
  createdAt
): Promise<ServiceReturn> => {
  try {
    const expense = await Expense.create({
      userid: userId,
      categoryid: categoryId,
      description,
      amount,
      status,
      createdAt,
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

    if (status === "debited") {
      if (wallet.amount < amount) {
        return { success: false, message: "Your balance is low" };
      }

      wallet.amount -= amount;
      await wallet.save();
      return { success: true, message: "Done" };
    }
    wallet.amount += amount;
    await wallet.save();
    return { success: true, message: "Done" };
  } catch (error) {
    return { success: false, message: "Internal error", data: error };
  }
};

export const getExpenses = async (
  userId,
  dateRange = "monthly"
): Promise<ServiceReturn> => {
  try {
    const now = new Date();
    let startDate: Date;

     if (dateRange === "weekly") {
      // Go back to Monday of this week (UTC-based)
      const dayOfWeek = now.getUTCDay(); // Sunday=0, Monday=1, ...
      const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startDate = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() - diffToMonday,
          0,
          0,
          0,
          0
        )
      );
    } else if (dateRange === "monthly") {
      startDate = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0)
      );
    } else {
      startDate = new Date(Date.UTC(now.getUTCFullYear(), 0, 1, 0, 0, 0, 0));
    }
    const expenses = await Expense.aggregate([
      {
        $match: {
          userid: new Types.ObjectId(userId),
          createdAt: { $gte: startDate, $lte: now },
          status: "debited",
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


export const getCreditedFromExpenses = async (
  userId: string,
  dateRange: "weekly" | "monthly" | "yearly" = "monthly"
): Promise<ServiceReturn> => {
  try {
    const now = new Date();
    let startDate: Date;
    if (dateRange === "weekly") {
      // Go back to Monday of this week (UTC-based)
      const dayOfWeek = now.getUTCDay(); // Sunday=0, Monday=1, ...
      const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startDate = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() - diffToMonday,
          0,
          0,
          0,
          0
        )
      );
    } else if (dateRange === "monthly") {
      // First of current month
      startDate = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0)
      );
    } else {
      // Yearly → start of year
      startDate = new Date(
        Date.UTC(now.getUTCFullYear(), 0, 1, 0, 0, 0, 0)
      );
    }

    const expenses = await Expense.aggregate([
      {
        $match: {
          userid: new Types.ObjectId(userId),
          createdAt: { $gte: startDate, $lte: now },
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
