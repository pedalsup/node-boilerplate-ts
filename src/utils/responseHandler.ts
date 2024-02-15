import { Response } from "express";
interface IResponse {
  status: number;
  success: boolean;
  message: string;
  data: unknown;
}

const responseHandler = (
  response: IResponse,
  res: Response,
  message?: string,
  data?: unknown,
) =>
  res.status(response.status).json({
    success: response.success,
    message: message ?? response.message,
    data: data ?? response.data,
  });

export default responseHandler;
