import { Response } from "express";
interface IResponse {
  status: number;
  success: boolean;
  message: string;
  data: any;
}

const responseHandler = (
  response: IResponse,
  res: Response,
  message?: string,
  data?: any
) =>
  res.status(response.status).json({
    success: response.success,
    message: message ?? response.message,
    data: data ?? response.data,
  });

export default responseHandler;
