import { NextFunction, Request, Response } from "express";
import { CreateUserDto, UpdateUserDto } from "@dtos/users.dto";
import { IUser } from "@interfaces/users.interface";
import { IProfile } from "@/interfaces/profile.interface";
import userService from "@services/users.service";
import { EHttpStatusCodes } from "@/common";
import { EUserTypes } from "@/utils/constants";
import { ApiResponseMessages } from "@/utils/apiResponseMessages";

class UsersController {
  public userService = new userService();

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (
        // @ts-ignore
        req.userTypeId === EUserTypes.MANAGER ||
        // @ts-ignore
        req.userTypeId === EUserTypes.SUPER_ADMIN
      ) {
        const users: IProfile[] = await this.userService.getAllUsers();
        res.status(EHttpStatusCodes.OK).send({
          message: ApiResponseMessages.SUCCESS,
          data: users,
        });
      } else {
        res.status(EHttpStatusCodes.UNAUTHORIZED).send({
          message: ApiResponseMessages.UNAUTHORIZED_ACCESS,
        });
      }
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (
        // @ts-ignore
        req.userTypeId === EUserTypes.MANAGER ||
        // @ts-ignore
        req.userTypeId === EUserTypes.SUPER_ADMIN
      ) {
        const userId = Number(req.query.id);
        const user: IProfile = await this.userService.getUserById(userId);
        res
          .status(EHttpStatusCodes.OK)
          .json({ data: user, message: ApiResponseMessages.SUCCESS });
      } else {
        res.status(EHttpStatusCodes.UNAUTHORIZED).json({
          message: ApiResponseMessages.UNAUTHORIZED_ACCESS,
        });
      }
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (
        // @ts-ignore
        req.userTypeId === EUserTypes.MANAGER ||
        // @ts-ignore
        req.userTypeId === EUserTypes.SUPER_ADMIN
      ) {
        const userId = Number(req.query.id);
        const result = await this.userService.deleteUser(userId);
        if (result) {
          res
            .status(EHttpStatusCodes.OK)
            .json({ message: ApiResponseMessages.SUCCESS });
        } else {
          res
            .status(EHttpStatusCodes.BAD_REQUEST)
            .send({ message: ApiResponseMessages.FAILED });
        }
      } else {
        res.status(EHttpStatusCodes.UNAUTHORIZED).json({
          message: ApiResponseMessages.UNAUTHORIZED_ACCESS,
        });
      }
    } catch (error) {
      next(error);
    }
  };

  public editUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.query.id);
      const userData: CreateUserDto = req.body;
      const result = await this.userService.editUser(userId, userData);
      if (result) {
        res
          .status(EHttpStatusCodes.OK)
          .json({ message: ApiResponseMessages.SUCCESS, data: result });
      } else {
        res
          .status(EHttpStatusCodes.BAD_REQUEST)
          .send({ message: ApiResponseMessages.FAILED });
      }
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
