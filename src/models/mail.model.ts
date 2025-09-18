import { Schema, model, Document, Types } from "mongoose";

export interface IMail extends Document {
  userId: Types.ObjectId;
  message: string;
  readStatus: boolean;
}

const MailSchema = new Schema<IMail>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    readStatus: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

export const Mail = model<IMail>("Mail", MailSchema);
