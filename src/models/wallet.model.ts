import { Schema, model, Document, Types } from "mongoose";

export interface IWallet extends Document {
  userId: Types.ObjectId;
  amount: number;
}

const WalletSchema = new Schema<IWallet>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Wallet = model<IWallet>("Wallet", WalletSchema);
