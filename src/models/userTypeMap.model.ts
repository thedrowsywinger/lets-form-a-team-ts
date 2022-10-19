import {
  Sequelize,
  DataTypes,
  Model,
  Optional,
  ModelAttributes,
} from "sequelize";

import { IUserTypeMap } from "@/interfaces/users.interface";
import { ITimestamps } from "@/interfaces/common.interface";

export const UserTypeMapModelName = "UserTypeMap";
export type UserTypeMapCreationAttributes = Optional<IUserTypeMap, "id">;

export class UserTypeMapModel
  extends Model<IUserTypeMap, UserTypeMapCreationAttributes>
  implements IUserTypeMap, ITimestamps
{
  public id: number;
  public userTypeId: number;
  public userId: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const UserTypeMapAttributes: ModelAttributes<
  UserTypeMapModel,
  Optional<IUserTypeMap, never>
> = {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  userTypeId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  userId: {
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

export default function (sequelize: Sequelize): typeof UserTypeMapModel {
  UserTypeMapModel.init(UserTypeMapAttributes, {
    tableName: UserTypeMapModelName,
    sequelize,
  });
  return UserTypeMapModel;
}
