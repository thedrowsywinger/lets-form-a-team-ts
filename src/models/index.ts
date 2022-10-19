import Sequelize from "sequelize";
import {
  NODE_ENV,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
  DB_DIALECT,
} from "@config";
import UserModel from "@models/users.model";
import UserTypesModel from "@models/userType.model";
import UserTypeMapModel from "@models/userTypeMap.model";
import ProfileModel from "@models/profile.model";
import { logger } from "@utils/logger";

const sequelize = new Sequelize.Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
  dialect: DB_DIALECT as Sequelize.Dialect,
  host: DB_HOST,
  port: +DB_PORT,
  pool: {
    min: 0,
    max: 50,
    idle: 30000,
    acquire: 60000,
  },
  logQueryParameters: ["development", "test"].includes(NODE_ENV),
  logging: (query, time) => {
    logger.info(time + "ms" + " " + query);
  },
  benchmark: true,
});

const DB = {
  /**
   * Add other models here
   * Then, they can be imported into other files and used like below
   *
   * import DB from "@models/index";
   * const { Users } = DB;
   *
   */
  Users: UserModel(sequelize),
  Profile: ProfileModel(sequelize),
  UserTypes: UserTypesModel(sequelize),
  UserTypeMap: UserTypeMapModel(sequelize),
  sequelize, // connection instance (RAW queries)
  Sequelize, // library
};

function applyRelationship() {
  const { Users, UserTypes, UserTypeMap, Profile } = DB;

  UserTypeMap.hasOne(Users, { foreignKey: "id", as: "usersId" });
  Users.belongsTo(UserTypeMap, { foreignKey: "id", as: "userTypeId" });

  UserTypeMap.hasMany(UserTypes, { foreignKey: "id", as: "userTypes" });
  UserTypes.belongsTo(UserTypeMap, { foreignKey: "id", as: "userTypeMapId" });

  Profile.belongsTo(Users, {
    foreignKey: "authUserId",
    targetKey: "id",
  });
}

applyRelationship();

export default DB;
