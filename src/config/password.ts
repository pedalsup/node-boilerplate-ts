import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { User } from "../models";
import config from ".";
import { TOKEN_TYPE } from "@/types/token";
import { IToken } from "@/types/common";
import { AppError } from "@/middlewares/errorhandler";
import { BAD_REQUEST } from "http-status";

const jwtOptions = {
  secretOrKey: config.jwtSecret as string,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload: IToken, done: any) => {
  try {
    if (payload.type !== TOKEN_TYPE.ACCESS) {
      throw new AppError(BAD_REQUEST, "Invalid token type");
    }
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export { jwtStrategy };
