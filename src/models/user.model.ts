import mongoose, { InferSchemaType } from "mongoose";
import { collection } from "../utils/collections";
import { DbUser } from "../types/user";
import bcrypt from "bcrypt";
import { DbUserPreSave } from "../types/common";

const schema = new mongoose.Schema<DbUser>(
  {
    address: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

type UserSchemaType = InferSchemaType<typeof schema>;

const User =
  mongoose.models[collection.USER] ||
  mongoose.model<DbUser>(collection.USER, schema);

export { User, UserSchemaType };

// Hash password before saving to database
schema.pre<DbUserPreSave>("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(8);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});
