import { Schema, model, Document, Types } from "mongoose";

export interface IWallet extends Document {
  userId: Types.ObjectId;
  amount: number;
  status: "credited" | "debited";
  description: string;
}

const WalletSchema = new Schema<IWallet>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["credited", "debited"], required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export const Wallet = model<IWallet>("Wallet", WalletSchema);
