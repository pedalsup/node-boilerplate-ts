import responseHandler from "@/utils/responseHandler";
import { Request, Response, NextFunction } from "express";
import { BAD_REQUEST, NOT_FOUND } from "http-status";

export class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = Error.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this);
  }
}

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} url:: ${req.url}`);
  next();
};

const errorLogger = (
  error: Error,
  _req: Request,
  _res: Response,
  next: NextFunction,
) => {
  console.log(`error ${error.message}`);
  next(error);
};

const errorResponder = (
  error: AppError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  const status = error.statusCode || BAD_REQUEST;
  const response = {
    success: false,
    message: error.message,
    data: null,
    status,
  };
  return responseHandler(response, res);
};

const invalidPathHandler = (_req: Request, res: Response) => {
  const response = {
    success: false,
    message: "API: Requested API not found",
    data: null,
    status: NOT_FOUND,
  };
  return responseHandler(response, res);
};

export { requestLogger, errorLogger, errorResponder, invalidPathHandler };
