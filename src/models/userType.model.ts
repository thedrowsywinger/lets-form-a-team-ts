import {
  Sequelize,
  DataTypes,
  Model,
  Optional,
  ModelAttributes,
} from "sequelize";

import { IUserTypes } from "@interfaces/users.interface";
import { ITimestamps } from "@/interfaces/common.interface";

export const UserTypesTableName = "UserTypes";
export type UserTypesCreationAttributes = Optional<IUserTypes, "id">;

export class UserTypesModel
  extends Model<IUserTypes, UserTypesCreationAttributes>
  implements IUserTypes, ITimestamps
{
  public id: number;
  public userType: string;
  public userTypeId: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const UserTypesModelAttributes: ModelAttributes<
  UserTypesModel,
  Optional<IUserTypes, never>
> = {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  userType: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  userTypeId: {
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

export default function (sequelize: Sequelize): typeof UserTypesModel {
  UserTypesModel.init(UserTypesModelAttributes, {
    tableName: UserTypesTableName,
    sequelize,
  });
  return UserTypesModel;
}
