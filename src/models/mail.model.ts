import { Schema, model, Document, Types } from "mongoose";

export interface IMail extends Document {
  userId: Types.ObjectId;
  title: string;
  message: string;
}

const MailSchema = new Schema<IMail>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export const Mail = model<IMail>("Category", MailSchema);
