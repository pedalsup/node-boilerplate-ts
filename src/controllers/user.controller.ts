import { Request, Response } from "express";
import { getRecord, removeRecord, updateRecord } from "./common.controller";
import { DbUser } from "@/types/user";
import { User } from "@/models";
import { trycatch } from "@/middlewares/trycatch";
import { generateAuthTokens } from "@/services/token.service";
import responseHandler from "@/utils/responseHandler";

// GET /user
const get = trycatch(async (req: Request, res: Response) => {
  const { id } = req.params;

  const response = await getRecord<DbUser>(User, id);

  if (id && response.success) {
    const tokens = await generateAuthTokens(response.data as DbUser);

    response.data = {
      user: response.data,
      tokens,
    };
  }

  return responseHandler(response, res);
});

// PUT /user/:id
const put = trycatch(async (req: Request, res: Response) => {
  const { id } = req.params;
  const response = await updateRecord<DbUser>(User, req.body, id, {
    new: true,
  });

  return responseHandler(response, res);
});

// DELETE /user/:id
const remove = trycatch(async (req: Request, res: Response) => {
  const { id } = req.params;
  const response = await removeRecord<DbUser>(User, id);

  return responseHandler(response, res);
});

export { get, put, remove };
