import {
  Sequelize,
  DataTypes,
  Model,
  Optional,
  ModelAttributes,
} from "sequelize";

import { IProfile } from "@/interfaces/profile.interface";
import { ITimestamps } from "@interfaces/common.interface";

export const ProfileTableName = "Profile";
export type ProfileCreationAttributes = Optional<IProfile, "id">;

export class ProfileModel
  extends Model<IProfile, ProfileCreationAttributes>
  implements IProfile, ITimestamps
{
  public id: number;
  public name: string;
  public contactNumber: string;
  public authUserId: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const ProfileModelAttributes: ModelAttributes<
  ProfileModel,
  Optional<IProfile, never>
> = {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING,
  },
  contactNumber: {
    type: DataTypes.STRING,
  },
  authUserId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
};

export default function (sequelize: Sequelize): typeof ProfileModel {
  ProfileModel.init(ProfileModelAttributes, {
    tableName: ProfileTableName,
    sequelize,
  });
  return ProfileModel;
}
