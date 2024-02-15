import mongoose from "mongoose";
import { collection } from "@/utils/collections";
import { DbToken, TOKEN_TYPE } from "@/types/token";

const schema = new mongoose.Schema<DbToken>(
  {
    token: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: collection.USER,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: TOKEN_TYPE,
    },
    expires: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Token =
  mongoose.models[collection.TOKEN] ||
  mongoose.model<DbToken>(collection.TOKEN, schema);

export { Token };
