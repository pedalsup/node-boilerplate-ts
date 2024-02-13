import { Request, Response } from "express";
import {
  findOneRecord,
  findRecord,
  removeRecord,
  updateRecord,
} from "./common.controller";
import { DbUser } from "@/types/user";
import { User } from "@/models";
import { trycatch } from "@/middlewares/trycatch";
import responseHandler from "@/utils/responseHandler";

// GET /user/:id
const get = trycatch(async (req: Request, res: Response) => {
  const { id } = req.params;
  const response = await findOneRecord<DbUser>(User, "USER", { _id: id });

  return responseHandler(response, res);
});

// GET /user
const getAll = trycatch(async (req: Request, res: Response) => {
  const response = await findRecord<DbUser>(User, "USER", {});

  return responseHandler(response, res);
});

// PUT /user/:id
const put = trycatch(async (req: Request, res: Response) => {
  const { id } = req.params;
  const response = await updateRecord<DbUser>(User, "USER", req.body, id, {
    new: true,
  });

  return responseHandler(response, res);
});

// DELETE /user/:id
const remove = trycatch(async (req: Request, res: Response) => {
  const { id } = req.params;
  const response = await removeRecord<DbUser>(User, "USER", id);

  return responseHandler(response, res);
});

export { get, getAll, put, remove };
