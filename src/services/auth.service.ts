import { compare, hash } from "bcrypt";
import bcrypt = require("bcrypt");
import jwt = require("jsonwebtoken");
import { sign } from "jsonwebtoken";
import { JWT_SECRET_KEY } from "@config";
import DB from "@models/index";
import { CreateUserDto, LoginUserDto } from "@dtos/users.dto";
import { HttpException } from "@exceptions/HttpException";
import { DataStoredInToken, TokenData } from "@interfaces/auth.interface";
import {
  IUser,
  IUserForOutput,
  IUserTypeMap,
} from "@interfaces/users.interface";
import { isEmpty } from "@utils/util";
import { EHttpStatusCodes } from "@/common";
import { ApiResponseMessages } from "@utils/apiResponseMessages";
import { EUserTypes } from "@/utils/constants";
import { IProfile } from "@/interfaces/profile.interface";
class AuthService {
  public users = DB.Users;
  public userTypes = DB.UserTypes;
  public userTypeMap = DB.UserTypeMap;
  public profiles = DB.Profile;

  public async signup(
    userData: CreateUserDto,
    reqUserUserTypeId: number,
  ): Promise<{
    createUserData: IUser;
    createUserProfile: IProfile;
    createUserTypeMap: IUserTypeMap;
  }> {
    if (isEmpty(userData))
      throw new HttpException(
        EHttpStatusCodes.BAD_REQUEST,
        ApiResponseMessages.INVALID_POST_REQUEST,
      );

    const transaction = await DB.sequelize.transaction();
    try {
      const userTypeInstance = await this.userTypes.findOne({
        where: { userTypeId: userData.userTypeId },
      });
      if (!userTypeInstance) {
        throw new HttpException(
          EHttpStatusCodes.BAD_REQUEST,
          ApiResponseMessages.INVALID_USER_TYPE,
        );
      }

      console.log("SUPER ADMIN REGISTERING A MANAGER");
      if (userTypeInstance.userTypeId === EUserTypes.MANAGER) {
        if (reqUserUserTypeId === EUserTypes.SUPER_ADMIN) {
          const findUserByEmail: IUser = await this.users.findOne({
            where: { email: userData.email },
          });
          if (findUserByEmail)
            throw new HttpException(
              EHttpStatusCodes.CONFLICT,
              ApiResponseMessages.EMAIL_ALREADY_EXISTS(userData.email),
            );

          // const hashedPassword = await hash(userData.password, 10);
          const createUserData: IUser = await this.users.create({
            email: userData.email,
            password: userData.password,
          });

          const createUserProfile: IProfile = await this.profiles.create({
            name: userData.name,
            contactNumber: userData.contactNumber,
            authUserId: createUserData.id,
          });

          const createUserTypeMap: IUserTypeMap = await this.userTypeMap.create(
            {
              userId: createUserData.id,
              userTypeId: userTypeInstance.id,
            },
          );

          return {
            createUserData,
            createUserProfile,
            createUserTypeMap,
          };
        } else {
          throw new HttpException(
            EHttpStatusCodes.UNAUTHORIZED,
            ApiResponseMessages.ONLY_SUPER_ADMIN_CAN_REGISTER_MANAGER,
          );
        }
      } else if (userTypeInstance.userTypeId === EUserTypes.EMPLOYEE) {
        if (
          reqUserUserTypeId === EUserTypes.MANAGER ||
          reqUserUserTypeId === EUserTypes.SUPER_ADMIN
        ) {
          const findUserByEmail: IUser = await this.users.findOne({
            where: { email: userData.email },
          });
          if (findUserByEmail)
            throw new HttpException(
              EHttpStatusCodes.CONFLICT,
              ApiResponseMessages.EMAIL_ALREADY_EXISTS(userData.email),
            );

          // const hashedPassword = await hash(userData.password, 10);
          const createUserData: IUser = await this.users.create({
            email: userData.email,
            password: userData.password,
          });

          const createUserProfile: IProfile = await this.profiles.create({
            name: userData.name,
            contactNumber: userData.contactNumber,
            authUserId: createUserData.id,
          });

          const createUserTypeMap: IUserTypeMap = await this.userTypeMap.create(
            {
              userId: createUserData.id,
              userTypeId: userTypeInstance.id,
            },
          );

          return {
            createUserData,
            createUserProfile,
            createUserTypeMap,
          };
        } else {
          throw new HttpException(
            EHttpStatusCodes.UNAUTHORIZED,
            ApiResponseMessages.EMPLOYEE_REGISTER_AUTHORIZATION,
          );
        }
      }
    } catch (e) {
      await transaction.rollback();
      throw new HttpException(
        EHttpStatusCodes.BAD_REQUEST,
        ApiResponseMessages.SYSTEM_ERROR,
      );
    }
  }

  public async login(
    userData: LoginUserDto,
  ): Promise<{ userId: number; userTypeId: number; token: string }> {
    if (isEmpty(userData))
      throw new HttpException(
        EHttpStatusCodes.BAD_REQUEST,
        ApiResponseMessages.INVALID_POST_REQUEST,
      );

    const userInstance: IUser = await this.users.findOne({
      where: { email: userData.email },
    });
    if (!userInstance)
      throw new HttpException(
        EHttpStatusCodes.CONFLICT,
        ApiResponseMessages.INVALID_EMAIL(userData.email),
      );
    const userId = userInstance.id;

    const match = await bcrypt.compare(
      userData.password,
      userInstance.password,
    );
    if (!match) {
      throw new HttpException(
        EHttpStatusCodes.BAD_REQUEST,
        ApiResponseMessages.USERNAME_PASSWORD_MISMATCH,
      );
    }

    const token = jwt.sign(
      // @ts-ignore
      { _id: userInstance.id.toString() },
      // @ts-ignore
      JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      },
    );

    const userTypeMapInstance = await this.userTypeMap.findOne({
      where: { userId: userInstance.id },
    });

    const userTypeInstance = await this.userTypes.findOne({
      where: { id: userTypeMapInstance.userTypeId },
    });

    const userTypeId = userTypeInstance.id;

    return { userId, userTypeId, token };
  }

  public async logout(userData: IUser): Promise<IUser> {
    if (isEmpty(userData))
      throw new HttpException(
        EHttpStatusCodes.BAD_REQUEST,
        "You're not userData",
      );

    const findUser: IUser = await this.users.findOne({
      where: { email: userData.email, password: userData.password },
    });
    if (!findUser)
      throw new HttpException(EHttpStatusCodes.CONFLICT, "You're not user");

    return findUser;
  }
}

export default AuthService;
