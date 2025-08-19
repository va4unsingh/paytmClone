import mongoose, { Schema, model, Document, Types } from "mongoose";

interface IBank extends Document {
  userId: Types.ObjectId;
  balance: number;
}

const accountSchema = new Schema<IBank>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

export const AccountModel = model("AccountModel", accountSchema);
