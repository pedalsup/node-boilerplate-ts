import passport from "passport";
import { FORBIDDEN, UNAUTHORIZED } from "http-status";
import { roleRights } from "@/config/roles";
import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorhandler";
import { DbUser } from "@/types/user";

const verifyCallback =
  (
    req: Request,
    resolve: (value?: unknown) => void,
    reject: (reason?: any) => void,
    requiredRights: string[],
  ) =>
  async (err: any, user: DbUser, info: any) => {
    if (err || info || !user) {
      return reject(new AppError(UNAUTHORIZED, "AUTH: Please authenticate"));
    }

    req.user = user;

    if (requiredRights.length) {
      const userRights = roleRights.get(user.role) as string[];

      const hasRequiredRights = requiredRights.every((requiredRight) => {
        return userRights.includes(requiredRight);
      });

      if (!hasRequiredRights) {
        return reject(new AppError(FORBIDDEN, "AUTH: Forbidden"));
      }
    }

    resolve();
  };

const auth =
  (...requiredRights: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "jwt",
        { session: false },
        verifyCallback(req, resolve, reject, requiredRights),
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

export default auth;
