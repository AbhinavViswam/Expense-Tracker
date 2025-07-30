import { Schema, model, Document, Types } from "mongoose";

export interface ICategory extends Document {
  userId: Types.ObjectId;
  categoryName: string;
}

const CategorySchema = new Schema<ICategory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    categoryName: { type: String, required: true },
  },
  { timestamps: true }
);

export const Category = model<ICategory>("Category", CategorySchema);
