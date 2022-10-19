"use strict";
import { Sequelize as TSequelize, QueryInterface } from "sequelize";
import { UserTypeMapModelName } from "@/models/userTypeMap.model";
import { UserTypesTableName } from "@/models/userType.model";
import { UsersTableName } from "@/models/users.model";

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
      await queryInterface.addConstraint(UserTypeMapModelName, {
        name: "userTypeMapModel_UserTypeId_UserTypes_id",
        type: "foreign key",
        fields: ["userTypeId"],
        references: {
          table: UserTypesTableName,
          field: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        transaction,
        logging: console.log,
      });
      await queryInterface.addConstraint(UserTypeMapModelName, {
        name: "userTypeMapModel_UserId_Users_id",
        type: "foreign key",
        fields: ["userId"],
        references: {
          table: UsersTableName,
          field: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        transaction,
        logging: console.log,
      });
      await transaction.commit();
    } catch (err) {
      console.error(err);
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
      await queryInterface.removeConstraint(
        UserTypeMapModelName,
        "userTypeMapModel_UserTypeId_UserTypes_id",
        {
          transaction,
          logging: console.log,
        },
      );
      await queryInterface.removeConstraint(
        UserTypeMapModelName,
        "userTypeMapModel_UserId_Users_id",
        {
          transaction,
          logging: console.log,
        },
      );
      await transaction.commit();
    } catch (err) {
      console.error(err);
      await transaction.rollback();
    }
  },
};
