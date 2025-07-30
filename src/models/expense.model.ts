import { Schema, model, Document, Types } from "mongoose";

export interface IExpense extends Document {
  userid: Types.ObjectId;
  categoryid: Types.ObjectId;
  description: string;
  amount: number;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    userid: { type: Schema.Types.ObjectId, ref: "User", required: true },
    categoryid: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export const Expense = model<IExpense>("Expense", ExpenseSchema);
