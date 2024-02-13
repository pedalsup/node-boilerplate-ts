import { Response } from "express";
interface IResponse {
  status: number;
  success: boolean;
  message: string;
  data: any;
}

const responseHandler = (response: IResponse, res: Response) =>
  res.status(response.status).json({
    success: response.success,
    message: response.message,
    data: response.data,
  });

export default responseHandler;
