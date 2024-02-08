import mongoose from "mongoose";

export type StringId = string;
export type ObjectId = mongoose.Schema.Types.ObjectId;
export type PrimaryId = string;
export type StringDate = string;

export interface DbDataBase {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface DataBase {
  _id: StringId;
  createdAt: string;
  updatedAt: string;
}

export interface DbData extends DbDataBase {}
export interface Data extends DataBase {}

export type DataLookup = Pick<Data, "_id">;

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
  data: T[] | T | {};
  status: number;
}
