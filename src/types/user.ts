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
