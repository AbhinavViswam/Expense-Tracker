import { Schema, model, Document, Types } from "mongoose";

export interface IWalletTrack extends Document {
  walletId: Types.ObjectId;
  description: string;
  amount: number;
  status: "credited" | "debited";
}

const WalletTrackSchema = new Schema<IWalletTrack>(
  {
    walletId: { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
    description: { type: String },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["credited", "debited"], required: true },
  },
  {
    timestamps: true,
  }
);

export const Wallettrack = model<IWalletTrack>(
  "Wallettrack",
  WalletTrackSchema
);
