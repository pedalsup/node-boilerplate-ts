import { Request, Response, NextFunction } from "express";
import { BAD_REQUEST, NOT_FOUND } from "http-status";

class AppError extends Error {
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
  next: NextFunction
) => {
  console.log(`error ${error.message}`);
  next(error);
};

const errorResponder = (
  error: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = error.statusCode || BAD_REQUEST;
  res
    .status(status)
    .json({ status: false, message: error.message, data: null });
};

const invalidPathHandler = (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let message = {
    success: false,
    message: "Requested API not found",
    data: null,
  };
  res.status(NOT_FOUND).json(message);
};

export { requestLogger, errorLogger, errorResponder, invalidPathHandler };
