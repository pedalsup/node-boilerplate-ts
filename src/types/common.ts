import mongoose from "mongoose";
import { Request } from "express";
import { DbUser } from "./user";
import { TOKEN_TYPE } from "./token";

export type ObjectId = mongoose.Schema.Types.ObjectId;

export interface DbDataBase {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbData extends DbDataBase {}

export interface GetListResult<T> {
  records: T[];
  count: number;
}

export interface LookupOption {
  search?: string;
  limit?: number;
  enabled?: boolean;
}

export interface Response<T> {
  success: boolean;
  message: string;
  data: T[] | T | object;
  status: number;
}

export interface AuthenticatedRequest extends Request {
  user?: DbUser;
}

export interface IToken {
  sub: Partial<DbUser>;
  iat: number;
  exp: number;
  type: TOKEN_TYPE;
}
