"use strict";
import {
  UserTypesTableName,
  UserTypesModelAttributes,
} from "@/models/userType.model";
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
      await queryInterface.createTable(
        UserTypesTableName,
        UserTypesModelAttributes,
        { transaction, logging: console.log },
      );
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
      await queryInterface.dropTable(UserTypesTableName, {
        transaction,
        logging: console.log,
      });
      await transaction.commit();
    } catch (err) {
      console.error(err);
      await transaction.rollback();
    }
  },
};
