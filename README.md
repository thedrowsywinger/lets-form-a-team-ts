# Let's Form a Team

## An Account Type-Based Authorization/Authentication System using Node JS x TypeScript

### Project Setup:

Setting up the Database first:

```sh
sudo -i -u postgres psql
create database hr_hero_db;
create user super_admin with encrypted password 'superadmin';
grant all privileges on database hr_hero_db to super_admin;
```

Setting up the project:

```sh
git clone https://github.com/thedrowsywinger/lets-form-a-team-ts.git
cd lets-form-a-team-ts
yarn
yarn dev
```

Setting up the environment:
Create a ".env.development.local" file. The file should contain the following:

```sh
# PORT
PORT =

# DATABASE
DB_HOST =
DB_PORT =
DB_USER =
DB_PASSWORD =
DB_DATABASE =
DB_DIALECT =

# TOKEN
SECRET_KEY =

# LOG
LOG_FORMAT =
LOG_DIR =

# CORS
ORIGIN =
CREDENTIALS =
```

Run the project with the following command:

```sh
docker compose --env-file ./.env.development.local up
```

Run the migrations and seeders(Run this in a separate tab):

```sh
docker exec -it <container_id> sh
yarn migrate:dev
yarn seed:deV:all
```

###### Account Types:

Super Admin: 1
Manager: 2
Employee 3

##### Login:

URL: 127.0.0.1:3001/api/core/login/

Sample POST request

```sh
{
    "username": "superAdmin",
    "password": "super_admin1"
}
```

Sample Response:

```sh
{
    "message": "Succesful",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxIiwiaWF0IjoxNjYyMDQ0NDk0LCJleHAiOjE2NjIxMzA4OTR9.mFKmXAoViHdZ4M2icaI5Vf8s0NI2djehBJyeHFvZlxc",
}
```

This access token must be used in requests that require Authorization. The Authorization header must be set like this: "jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIxIiwiaWF0IjoxNjYyMDQ0NDk0LCJleHAiOjE2NjIxMzA4OTR9.mFKmXAoViHdZ4M2icaI5Vf8s0NI2djehBJyeHFvZlxc"

##### Register Manager:

A superAdmin can only add a manager.
URL: 127.0.0.1:3001/api/core/register/user-profile/

Sample POST request

```sh
{
    "password": "Manager1",
    "name": "John Manager",
    "contactNumber": "01789652243",
    "email": "john@hrhero.com",
    "userTypeId": 2
}
```

# TODOsignup

serialize the output, remove the hashed password

Sample Response:

```sh
{
    "data": {
        "authUserData": {
            "id": 2,
            "email": "john@hrhero.com",
            "password": "$2b$08$ZGbCDhxvat24smoHgvLvg.ohhdPgkdLliTO642gZCwQHfNuBwXCGa",
            "createdAt": "2022-10-20T04:42:20.653Z",
            "updatedAt": "2022-10-20T04:42:20.656Z"
        },
        "profile": {
            "createdAt": "2022-10-20T04:42:20.683Z",
            "updatedAt": "2022-10-20T04:42:20.683Z",
            "id": 2,
            "name": "John Manager",
            "contactNumber": "01789353343",
            "authUserId": 3
        },
        "userTypeMap": {
            "createdAt": "2022-10-20T04:42:20.689Z",
            "updatedAt": "2022-10-20T04:42:20.689Z",
            "id": 2,
            "userId": 2,
            "userTypeId": 2
        }
    },
    "message": "Successful"
}
```

##### Register Employee:

A super admin or a manager can add an employee
URL (POST REQUEST): 127.0.0.1:3001/api/core/register/user-profile/
Sample POST request:

```sh
{
    "username": "harryMaguire",
    "password": "Defender1",
    "name": "Harry Maguire",
    "contactNumber": "01789353343",
    "email": "harry@hrhero.com",
    "accountType": 3
}
```

Sample Response:

```sh

{
    "data": {
        "authUserData": {
            "id": 3,
            "email": "harry@hrhero.com",
            "password": "$2b$08$ZGbCDhxvat24smoHgvLvg.ohhdPgkdLliTO642gZCwQHfNuBwXCGa",
            "createdAt": "2022-10-20T04:42:20.653Z",
            "updatedAt": "2022-10-20T04:42:20.656Z"
        },
        "profile": {
            "createdAt": "2022-10-20T04:42:20.683Z",
            "updatedAt": "2022-10-20T04:42:20.683Z",
            "id": 3,
            "name": "Harry Maguire",
            "contactNumber": "01789353343",
            "authUserId": 3
        },
        "userTypeMap": {
            "createdAt": "2022-10-20T04:42:20.689Z",
            "updatedAt": "2022-10-20T04:42:20.689Z",
            "id": 3,
            "userId": 3,
            "userTypeId": 3
        }
    },
    "message": "Successful"
}
```

# Documentation for the template used:

# Express + TypeScript + Sequelize Starter Template (with Migrations)

This repository contains a starter template using Express, TypeScript and
Sequelize ORM based on [this repository](https://github.com/ljlm0402/typescript-express-starter).
It also supports migrations, albeit in a bit of a hacky way.

## Naming convention for environment variables files

Apart from the `.env.example` file, the `src/config/index.ts` file expects one of
the following three files (based on the value of `NODE_ENV`):

- `.env.development.local`
- `.env.production.local`
- `.env.test.local`

Essentially, it follows `.env.${NODE_ENV}.local` format for the filenames.

## How to achieve migrations and seeding

Due to how `sequelize` is wired to work best with JavaScript and not TypeScript, some workarounds needs to be used for usage of migrations and seeding.

- `.sequelizerc` file at the project root points to the `dist` folder (i.e. after TypeScript code has been transpiled to JavaScript).
- So, the migration and seed commands will place the `${timestamp}_${migration_name}.js` and `${timestamp}_${seeder_name}.js` files in the `dist/migrations` and `dist/seeders` folders, respectively.
- You need to copy the `.js` files to the `src/migrations` or `src/seeders` folders.
- You need to change the extension from `.js` to `.ts`.
- You need to change the structure to a TS based migration or seed file. A template structure is given below:

```ts
"use strict";
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
      await transaction.commit();
    } catch (err) {
      console.error(err);
      await transaction.rollback();
    }
  },
};
```

- Now, when you finish writing your migrations and seed files and build the project, the `dist` folder will contain the JS version of the same, and hence `.sequelizerc` will be able to apply your migrations.

For convenience, the commands to generate migration or seed files are given below:

#### Creating migrations

```sh
npx sequelize-cli migration:generate --name "migration_name"
```

#### Creating seeders

```sh
npx sequelize-cli seed:create --name "seed_name"
```

## Formatting code

Before committing your code, You can run `yarn format` to properly format all files in the repository based on the settings defined in the `.prettierrc` file at the root of the repository.
