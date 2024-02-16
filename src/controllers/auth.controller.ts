import { Request, Response } from "express";
import { trycatch } from "@/middlewares/trycatch";
import { Token, User } from "@/models";
import { TOKEN_TYPE } from "@/types/token";
import {
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
  verifyToken,
} from "@/services/token.service";
import responseHandler from "@/utils/responseHandler";
import { CONFLICT, NOT_FOUND, OK, UNAUTHORIZED } from "http-status";
import { createRecord, findOneRecord, updateRecord } from "./common.controller";
import { DbUser } from "@/types/user";

// POST /register
const register = trycatch(async (req: Request, res: Response) => {
  const isUserExist = await User.isUserExist(
    req.body.email,
    req.body.username,
    req.body.address,
  );

  if (isUserExist) {
    const response = {
      success: false,
      message: "REGISTER: User already exists",
      data: {},
      status: CONFLICT,
    };

    return responseHandler(response, res);
  }

  const response = await createRecord<DbUser>(User, "REGISTER", req.body);

  const tokens = await generateAuthTokens(response.data as DbUser);

  return responseHandler(response, res, "REGISTER: Registered successfully", {
    user: response.data,
    tokens,
  });
});

// POST /login
const login = trycatch(async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email });

  let response;
  if (!user || !(await user.isPasswordMatch(req.body.password))) {
    response = {
      success: false,
      message: "LOGIN: Invalid credentials",
      data: {},
      status: UNAUTHORIZED,
    };
  } else {
    const tokens = await generateAuthTokens(user as DbUser);

    response = {
      success: true,
      message: "LOGIN: Logged in successfully",
      data: { user, tokens },
      status: OK,
    };
  }

  return responseHandler(response, res);
});

// POST /logout
const logout = trycatch(async (req: Request, res: Response) => {
  const tokenDoc = await Token.findOne({
    token: req.body.refreshToken,
    type: TOKEN_TYPE.REFRESH,
  });

  let response;
  if (!tokenDoc) {
    response = {
      success: false,
      message: "LOGOUT: Token Not found",
      data: {},
      status: NOT_FOUND,
    };
  } else {
    await tokenDoc.deleteOne();

    response = {
      success: true,
      message: "LOGOUT: Logged out successfully",
      data: {},
      status: OK,
    };
  }

  return responseHandler(response, res);
});

// POST /refresh-auth
const refreshAuth = trycatch(async (req: Request, res: Response) => {
  const tokenDoc = await verifyToken(req.body.refreshToken, TOKEN_TYPE.REFRESH);

  const response = await findOneRecord<DbUser>(User, "REFRESH AUTH", {
    _id: tokenDoc.user,
  });

  await tokenDoc.deleteOne();
  const tokens = await generateAuthTokens(response.data as DbUser);

  return responseHandler(response, res, "REFRESH AUTH: Auth refreshed", tokens);
});

// POST /forgot-password
const forgotPassword = trycatch(async (req: Request, res: Response) => {
  const token = await generateResetPasswordToken(req.body.email);

  // Logic of send mail

  const response = {
    success: true,
    message: "FORGOT PASSWORD: Please check your mail",
    data: token,
    status: OK,
  };

  return responseHandler(response, res);
});

// POST /reset-password
const resetPassword = trycatch(async (req: Request, res: Response) => {
  const resetPasswordToken = req.query.token;

  const tokenDoc = await verifyToken(
    resetPasswordToken as string,
    TOKEN_TYPE.RESET_PASSWORD,
  );

  const user = await User.findById(tokenDoc.user);

  if (!user) {
    const response = {
      success: false,
      message: "RESET PASSWORD: User not found",
      data: {},
      status: NOT_FOUND,
    };

    return responseHandler(response, res);
  }

  user.password = req.body.password;
  await user.save();

  await Token.deleteMany({
    user: tokenDoc.user,
    type: TOKEN_TYPE.RESET_PASSWORD,
  });

  const response = {
    success: true,
    message: "RESET PASSWORD: Password reset successfully",
    data: {},
    status: OK,
  };

  return responseHandler(response, res);
});

// POST /send-verification-email
const sendVerificationEmail = trycatch(async (req: Request, res: Response) => {
  const userId = (req.user as DbUser)._id;

  const token = await generateVerifyEmailToken(userId);

  // Logic of send mail

  const response = {
    success: true,
    message: "SEND VERIFICATION EMAIL: Please check your mail",
    data: token,
    status: OK,
  };

  return responseHandler(response, res);
});

// GET /verify-email
const verifyEmail = trycatch(async (req: Request, res: Response) => {
  const verifyEmailToken = req.query.token;

  const tokenDoc = await verifyToken(
    verifyEmailToken as string,
    TOKEN_TYPE.VERIFY_EMAIL,
  );

  await findOneRecord<DbUser>(User, "VERIFT EMAIL", {
    _id: tokenDoc.user,
  });

  await Token.deleteMany({
    user: tokenDoc.user,
    type: TOKEN_TYPE.VERIFY_EMAIL,
  });

  const response = await updateRecord<DbUser>(
    User,
    "VERIFY EMAIL",
    {
      isEmailVerified: true,
    },
    tokenDoc.user.toString(),
    { new: true },
  );

  return responseHandler(
    response,
    res,
    "VERIFT EMAIL: Email has been verified",
  );
});

export {
  register,
  login,
  logout,
  refreshAuth,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
