import {
  CONFLICT,
  CREATED,
  EXPECTATION_FAILED,
  NOT_FOUND,
  OK,
} from "http-status";
import mongoose, { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { Response } from "@/types/common";

const getRecord = async <T>(
  collection: mongoose.Model<T>,
  id?: string
): Promise<Response<T>> => {
  let data;
  if (id) {
    data = await collection.findById(id);

    if (!data) {
      return {
        success: false,
        message: "No data found",
        data: {},
        status: NOT_FOUND,
      };
    }
  } else {
    data = await collection.find();

    if (data.length === 0) {
      return {
        success: false,
        message: "No data found",
        data: [],
        status: NOT_FOUND,
      };
    }
  }

  return {
    success: true,
    message: "Data found",
    data,
    status: OK,
  };
};

const createRecord = async <T>(
  collection: mongoose.Model<T>,
  payload: T,
  filterQuery?: FilterQuery<T>
): Promise<Response<T>> => {
  if (filterQuery) {
    const isExist = await collection.findOne(filterQuery);

    if (isExist) {
      return {
        success: false,
        message: "Data already exist",
        data: {},
        status: CONFLICT,
      };
    }
  }

  const newData = await collection.create(payload);

  if (!newData) {
    return {
      success: false,
      message: "Failed to create data",
      data: {},
      status: EXPECTATION_FAILED,
    };
  }

  return {
    success: true,
    message: "Data created",
    data: newData,
    status: CREATED,
  };
};

const updateRecord = async <T>(
  collection: mongoose.Model<T>,
  payload: UpdateQuery<T>,
  id: string,
  options?: QueryOptions
): Promise<Response<T>> => {
  const updatedData = await collection.findByIdAndUpdate(id, payload, options);

  if (!updatedData) {
    return {
      success: false,
      message: "Data not found",
      data: {},
      status: NOT_FOUND,
    };
  }

  return {
    success: true,
    message: "Data updated",
    data: updatedData,
    status: OK,
  };
};

const removeRecord = async <T>(
  collection: mongoose.Model<T>,
  id: string
): Promise<Response<T>> => {
  const deletedData = await collection.findByIdAndDelete(id);

  if (!deletedData) {
    return {
      success: false,
      message: "Data not found",
      data: {},
      status: NOT_FOUND,
    };
  }

  return {
    success: true,
    message: "Data deleted",
    data: deletedData,
    status: OK,
  };
};

const lookupRecord = async <T>(
  collection: mongoose.Model<T>,
  pipeline: any[]
): Promise<Response<T>> => {
  const data = await collection.aggregate(pipeline);

  if (data.length === 0) {
    return {
      success: false,
      message: "No data found",
      data: [],
      status: NOT_FOUND,
    };
  }

  return {
    success: true,
    message: "Data found",
    data,
    status: OK,
  };
};

export { getRecord, createRecord, updateRecord, removeRecord, lookupRecord };
