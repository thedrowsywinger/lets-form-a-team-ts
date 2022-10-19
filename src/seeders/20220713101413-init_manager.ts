"use strict";
import DB from "@/models";
import { EUserTypes } from "@/utils/constants";
import { Sequelize as TSequelize, QueryInterface } from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: TSequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      /**
       * Add altering commands here.
       *
       * Example:
       * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
       */
      var superAdminUserTypeInstance = await DB.UserTypes.findOne({
        where: { userTypeId: EUserTypes.SUPER_ADMIN },
      });
      if (!superAdminUserTypeInstance) {
        var superAdminUserTypeInstance = await DB.UserTypes.create({
          userType: "Super Admin",
          userTypeId: EUserTypes.SUPER_ADMIN,
        });
      }

      var managerUserTypeInstance = await DB.UserTypes.findOne({
        where: { userTypeId: EUserTypes.MANAGER },
      });
      if (!managerUserTypeInstance) {
        var managerUserTypeInstance = await DB.UserTypes.create({
          userType: "Manager",
          userTypeId: EUserTypes.MANAGER,
        });
      }

      var employeeUserTypeInstance = await DB.UserTypes.findOne({
        where: { userTypeId: EUserTypes.EMPLOYEE },
      });
      if (!employeeUserTypeInstance) {
        var employeeUserTypeInstance = await DB.UserTypes.create({
          userType: "Employee",
          userTypeId: EUserTypes.EMPLOYEE,
        });
      }

      var superAdminInstance = await DB.Users.findOne({
        where: { email: "super_admin@eiaas.com" },
      });
      if (!superAdminInstance) {
        var superAdminInstance = await DB.Users.create({
          email: "super_admin@eiaas.com",
          password: "super_admin1",
        });
        var superAdminUserTypeMapInstance = await DB.UserTypeMap.create({
          userId: superAdminInstance.id,
          userTypeId: superAdminUserTypeInstance.id,
        });
      }
      await transaction.commit();
    } catch (err) {
      console.error(err);
      DB.Users.destroy({
        truncate: true,
      });
      DB.UserTypes.destroy({
        truncate: true,
      });
      DB.UserTypeMap.destroy({
        truncate: true,
      });
      await transaction.rollback();
    }
  },

  async down(queryInterface: QueryInterface, Sequelize: TSequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      /**
       * Add reverting commands here.
       *
       * Example:
       * await queryInterface.dropTable('users');
       */
      await transaction.commit();
    } catch (err) {
      console.error(err);
      await transaction.rollback();
    }
  },
};
