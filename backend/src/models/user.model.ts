import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser extends Document {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const hashPasswordInUpdate = async function (this: any, next: any) {
  const update = this.getUpdate() as any;

  if (update && update.password) {
    try {
      update.password = await bcrypt.hash(update.password, 10);
    } catch (error) {
      return next(error);
    }
  }

  next();
};

userSchema.pre("updateOne", hashPasswordInUpdate);
userSchema.pre("findOneAndUpdate", hashPasswordInUpdate);

export const UserModel = model("User", userSchema);
