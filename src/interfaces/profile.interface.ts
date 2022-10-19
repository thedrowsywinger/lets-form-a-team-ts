import { ITimestamps } from "./common.interface";

export interface IProfile extends ITimestamps {
  id: number;
  name: string;
  contactNumber: string;
  authUserId: number;
}
