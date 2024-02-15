import { Request, Response, NextFunction } from "express";

type ExpressMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void;

export const trycatch =
  (func: ExpressMiddleware) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(func(req, res, next)).catch(next);
  };
