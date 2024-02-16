import { TOKEN_TYPE } from "@/types/token";
import moment from "moment";
import jwt from "jsonwebtoken";
import { Token, User } from "@/models";
import { DbUser } from "@/types/user";
import config from "@/config";
import { IToken, ObjectId } from "@/types/common";
import { NOT_FOUND } from "http-status";
import { AppError } from "@/middlewares/errorhandler";

const generateToken = (
  user: Partial<DbUser>,
  expires: moment.Moment,
  type: TOKEN_TYPE,
  secret = config.jwtSecret,
) => {
  const payload: IToken = {
    sub: user,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret as string);
};

const generateAuthTokens = async (user: DbUser) => {
  const userId = user._id;

  const accessTokenExpires = moment().add(60, "minutes");
  const accessToken = generateToken(
    { _id: userId },
    accessTokenExpires,
    TOKEN_TYPE.ACCESS,
  );

  const refreshTokenExpires = moment().add(2, "days");
  const refreshToken = generateToken(
    { _id: userId },
    refreshTokenExpires,
    TOKEN_TYPE.REFRESH,
  );

  await saveToken(
    refreshToken,
    userId,
    refreshTokenExpires,
    TOKEN_TYPE.REFRESH,
  );

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

const generateResetPasswordToken = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(NOT_FOUND, "No users found with this email");
  }

  const expires = moment().add(10, "minutes");

  const resetPasswordToken = generateToken(
    { _id: user._id },
    expires,
    TOKEN_TYPE.RESET_PASSWORD,
  );

  await saveToken(
    resetPasswordToken,
    user._id,
    expires,
    TOKEN_TYPE.RESET_PASSWORD,
  );

  return resetPasswordToken;
};

const generateVerifyEmailToken = async (id: ObjectId) => {
  const user = await User.findById({ _id: id });
  if (!user) {
    throw new AppError(NOT_FOUND, "No users found");
  }

  const expires = moment().add(10, "minutes");

  const verifyEmailToken = generateToken(
    { _id: user._id },
    expires,
    TOKEN_TYPE.VERIFY_EMAIL,
  );

  await saveToken(verifyEmailToken, user._id, expires, TOKEN_TYPE.VERIFY_EMAIL);

  return verifyEmailToken;
};

const saveToken = async (
  token: string,
  userId: ObjectId,
  expires: moment.Moment,
  type: TOKEN_TYPE,
) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
  });

  return tokenDoc;
};

const verifyToken = async (token: string, type: TOKEN_TYPE) => {
  const payload = jwt.verify(token, config.jwtSecret as string);

  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub,
  });

  if (!tokenDoc) {
    throw new AppError(NOT_FOUND, "Token not found");
  }

  return tokenDoc;
};

export {
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
  saveToken,
  verifyToken,
};
