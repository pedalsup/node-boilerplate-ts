import { Model } from "mongoose";
import { DbData } from "./common";

interface UserBase {
  username: string;
  email: string;
}

export interface DbUser extends DbData, UserBase {
  address: string;
  password: string;
  role: string;
  isEmailVerified: boolean;
}

export interface DbUserPreSave extends DbUser {
  isModified: (arg0: string) => boolean;
}

export interface DbUserMethods {
  isPasswordMatch(candidatePassword: string): string;
}

export interface UserModel extends Model<DbUser, object, DbUserMethods> {
  isUserExist(
    email: string,
    username: string,
    address: string,
    excludeUserId?: string,
  ): Promise<boolean>;
}
