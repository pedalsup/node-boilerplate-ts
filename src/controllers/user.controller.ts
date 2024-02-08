import { Request, Response } from "express";
import {
  createRecord,
  getRecord,
  removeRecord,
  updateRecord,
} from "./common.controller";
import { User as UserType } from "../types/user";
import { User } from "../models";
import { trycatch } from "../middlewares/trycatch";

// GET /user
const get = trycatch(async (req: Request, res: Response) => {
  const { id } = req.params;

  const response = await getRecord<UserType>(User, id);

  return res.status(response.status).json({
    success: response.success,
    message: response.message,
    data: response.data,
  });
});

// POST /user
const post = trycatch(async (req: Request, res: Response) => {
  const response = await createRecord<UserType>(User, req.body, {
    email: req.body.email,
  });

  return res.status(response.status).json({
    success: response.success,
    message: response.message,
    data: response.data,
  });
});

// PUT /user/:id
const put = trycatch(async (req: Request, res: Response) => {
  const { id } = req.params;
  const response = await updateRecord<UserType>(User, req.body, id, {
    new: true,
  });

  return res.status(response.status).json({
    success: response.success,
    message: response.message,
    data: response.data,
  });
});

// DELETE /user/:id
const remove = trycatch(async (req: Request, res: Response) => {
  const { id } = req.params;
  const response = await removeRecord<UserType>(User, id);

  return res.status(response.status).json({
    success: response.success,
    message: response.message,
    data: response.data,
  });
});

export { get, post, put, remove };
