"use strict";
import { Sequelize as TSequelize, QueryInterface } from "sequelize";
import { ProfileTableName } from "@/models/profile.model";
import { UserModel, UsersTableName } from "@/models/users.model";

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
      await queryInterface.addConstraint(ProfileTableName, {
        name: "profile_model_user_user",
        type: "foreign key",
        fields: ["authUserId"],
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
        ProfileTableName,
        "profile_model_user_user",
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
