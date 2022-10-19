import { ITimestamps } from "./common.interface";

export interface IUser extends ITimestamps {
  id: number;
  email: string;
  password: string;
}

export interface IUserTypes extends ITimestamps {
  id: number;
  userType: string;
  userTypeId: number;
}

export interface IUserTypeMap extends ITimestamps {
  id: number;
  userTypeId: number;
  userId: number;
}
