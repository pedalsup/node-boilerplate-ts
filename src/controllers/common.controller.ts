import {
  CONFLICT,
  CREATED,
  EXPECTATION_FAILED,
  NOT_FOUND,
  OK,
} from "http-status";
import mongoose, {
  AggregateOptions,
  FilterQuery,
  ObjectId,
  PipelineStage,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import { Response } from "@/types/common";
import { AppError } from "@/middlewares/errorhandler";

const findRecord = async <T>(
  collection: mongoose.Model<T>,
  log_id: string,
  filterQuery: FilterQuery<T>,
  projection?: ProjectionType<T>,
  options?: QueryOptions<T>,
): Promise<Response<T>> => {
  const data = await collection.find(filterQuery, projection, options);

  if (data.length === 0) {
    throw new AppError(NOT_FOUND, `${log_id}: Data not found`);
  }

  return {
    success: true,
    message: `${log_id}: Data found`,
    data,
    status: OK,
  };
};

const findOneRecord = async <T>(
  collection: mongoose.Model<T>,
  log_id: string,
  filterQuery: FilterQuery<T>,
  projection?: ProjectionType<T>,
  options?: QueryOptions<T>,
): Promise<Response<T>> => {
  const data = await collection.findOne(filterQuery, projection, options);

  if (!data) {
    throw new AppError(NOT_FOUND, `${log_id}: Data not found`);
  }

  return {
    success: true,
    message: `${log_id}: Data found`,
    data,
    status: OK,
  };
};

const createRecord = async <T>(
  collection: mongoose.Model<T>,
  log_id: string,
  payload: T,
  filterQuery?: FilterQuery<T>,
  projection?: ProjectionType<T>,
  options?: QueryOptions<T>,
): Promise<Response<T>> => {
  if (filterQuery) {
    const isExist = await collection.findOne(filterQuery, projection, options);

    if (isExist) {
      return {
        success: false,
        message: `${log_id}: Data already exist`,
        data: {},
        status: CONFLICT,
      };
    }
  }

  const newData = await collection.create(payload);

  if (!newData) {
    throw new AppError(EXPECTATION_FAILED, `${log_id}: Failed to create data`);
  }

  return {
    success: true,
    message: `${log_id}: Data created`,
    data: newData,
    status: CREATED,
  };
};

const updateRecord = async <T>(
  collection: mongoose.Model<T>,
  log_id: string,
  payload: UpdateQuery<T>,
  id: ObjectId | string,
  options?: QueryOptions<T>,
): Promise<Response<T>> => {
  const updatedData = await collection.findByIdAndUpdate(id, payload, options);

  if (!updatedData) {
    throw new AppError(NOT_FOUND, `${log_id}: Data not found`);
  }

  return {
    success: true,
    message: `${log_id}: Data updated`,
    data: updatedData,
    status: OK,
  };
};

const removeRecord = async <T>(
  collection: mongoose.Model<T>,
  log_id: string,
  id: ObjectId | string,
  options?: QueryOptions<T>,
): Promise<Response<T>> => {
  const deletedData = await collection.findByIdAndDelete(id, options);

  if (!deletedData) {
    throw new AppError(NOT_FOUND, `${log_id}: Data not found`);
  }

  return {
    success: true,
    message: `${log_id}: Data deleted`,
    data: deletedData,
    status: OK,
  };
};

const lookupRecord = async <T>(
  collection: mongoose.Model<T>,
  log_id: string,
  pipeline: PipelineStage[],
  options?: AggregateOptions,
): Promise<Response<T>> => {
  const data = await collection.aggregate(pipeline, options);

  if (data.length === 0) {
    throw new AppError(NOT_FOUND, `${log_id}: Data not found`);
  }

  return {
    success: true,
    message: `${log_id}: Data found`,
    data,
    status: OK,
  };
};

export {
  findRecord,
  findOneRecord,
  createRecord,
  updateRecord,
  removeRecord,
  lookupRecord,
};
