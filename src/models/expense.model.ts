import { Schema, model, Document, Types } from "mongoose";

export interface IExpense extends Document {
  userid: Types.ObjectId;
  categoryid: Types.ObjectId;
  description: string;
  amount: number;
  status: "credited" | "debited";
  createdat: any;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    userid: { type: Schema.Types.ObjectId, ref: "User", required: true },
    categoryid: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["credited", "debited"], required: true },
    createdat: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Expense = model<IExpense>("Expense", ExpenseSchema);
