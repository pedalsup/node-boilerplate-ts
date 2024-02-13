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
import { CREATED, NOT_FOUND, OK, UNAUTHORIZED } from "http-status";
import { getRecord, updateRecord } from "./common.controller";
import { DbUser } from "@/types/user";

// POST /register
const register = trycatch(async (req: Request, res: Response) => {
  const isUserExist = await User.isUserExist(
    req.body.email,
    req.body.username,
    req.body.address
  );

  if (isUserExist) {
    const response = {
      success: false,
      message: "User already exists",
      data: {},
      status: OK,
    };

    return responseHandler(response, res);
  }

  const user = await User.create(req.body);
  const tokens = await generateAuthTokens(user as DbUser);

  const response = {
    success: true,
    message: "Registered successfully",
    data: { user, tokens },
    status: CREATED,
  };

  return responseHandler(response, res);
});

// POST /login
const login = trycatch(async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await user.isPasswordMatch(req.body.password))) {
    const response = {
      success: false,
      message: "Invalid credentials",
      data: {},
      status: UNAUTHORIZED,
    };

    return responseHandler(response, res);
  }

  const tokens = await generateAuthTokens(user as DbUser);

  const response = {
    success: true,
    message: "Logged in successfully",
    data: { user, tokens },
    status: OK,
  };

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
      message: "Token Not found",
      data: {},
      status: NOT_FOUND,
    };
  } else {
    await tokenDoc.deleteOne();

    response = {
      success: true,
      message: "Logged out successfully",
      data: {},
      status: OK,
    };
  }

  return responseHandler(response, res);
});

// POST /refresh-auth
const refreshAuth = trycatch(async (req: Request, res: Response) => {
  const tokenDoc = await verifyToken(req.body.refreshToken, TOKEN_TYPE.REFRESH);

  const responseUser = await getRecord<DbUser>(User, tokenDoc.user);

  if (!responseUser.success) {
    return responseHandler(responseUser, res);
  }

  await tokenDoc.deleteOne();
  const tokens = await generateAuthTokens(responseUser.data as DbUser);

  const response = {
    success: true,
    message: "Auth refreshed",
    data: tokens,
    status: OK,
  };

  return responseHandler(response, res);
});

// POST /forgot-password
const forgotPassword = trycatch(async (req: Request, res: Response) => {
  const token = await generateResetPasswordToken(req.body.email);

  // Logic of send mail

  const response = {
    success: true,
    message: "Please check your mail",
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
    TOKEN_TYPE.RESET_PASSWORD
  );

  const responseUser = await getRecord<DbUser>(User, tokenDoc.user);
  if (!responseUser.success) {
    return responseHandler(responseUser, res);
  }

  await updateRecord<DbUser>(
    User,
    { password: req.body.newPassword },
    tokenDoc.user
  );

  await Token.deleteMany({
    user: tokenDoc.user,
    type: TOKEN_TYPE.RESET_PASSWORD,
  });

  const response = {
    success: true,
    message: "Password reset successfully",
    data: {},
    status: OK,
  };

  return responseHandler(response, res);
});

// POST /send-verification-email
const sendVerificationEmail = trycatch(async (req: Request, res: Response) => {
  const token = await generateVerifyEmailToken(
    (req.user as any)._id.toString()
  );

  // Logic of send mail

  const response = {
    success: true,
    message: "Please check your mail",
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
    TOKEN_TYPE.VERIFY_EMAIL
  );

  const responseUser = await getRecord<DbUser>(User, tokenDoc.user.toString());
  if (!responseUser.success) {
    return responseHandler(responseUser, res);
  }

  await Token.deleteMany({
    user: tokenDoc.user,
    type: TOKEN_TYPE.VERIFY_EMAIL,
  });

  const updateResponse = await updateRecord<DbUser>(
    User,
    {
      isEmailVerified: true,
    },
    tokenDoc.user.toString(),
    { new: true }
  );
  if (!updateResponse.success) {
    return responseHandler(updateResponse, res);
  }

  const response = {
    success: updateResponse.success,
    message: "Email has been verified",
    data: updateResponse.data,
    status: updateResponse.status,
  };

  return responseHandler(response, res);
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
