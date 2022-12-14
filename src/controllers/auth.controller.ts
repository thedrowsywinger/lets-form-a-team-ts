import { NextFunction, Request, Response } from "express";
import { CreateUserDto, LoginUserDto } from "@dtos/users.dto";
import { IUser } from "@interfaces/users.interface";
import {
  IRefreshTokenInput,
  IRefreshTokenOutput,
} from "@interfaces/auth.interface";
import { RequestWithUser } from "@interfaces/auth.interface";
import AuthService from "@services/auth.service";
import { EHttpStatusCodes } from "@/common";
import { ApiResponseMessages } from "@/utils/apiResponseMessages";

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      // @ts-ignore
      const reqUserUserTypeId: number = req.userTypeId;
      const { createUserData, createUserProfile, createUserTypeMap } =
        await this.authService.signup(userData, reqUserUserTypeId);

      res.status(EHttpStatusCodes.ACCEPTED).json({
        data: {
          authUserData: createUserData,
          profile: createUserProfile,
          userTypeMap: createUserTypeMap,
        },
        message: ApiResponseMessages.SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: LoginUserDto = req.body;
      const { userId, userTypeId, token } = await this.authService.login(
        userData,
      );

      req["userId"] = userId;
      req["userTypeId"] = userTypeId;
      res
        .status(EHttpStatusCodes.OK)
        .send({ message: ApiResponseMessages.SUCCESS, accessToken: token });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userData: IUser = req.user;
      const logOutUserData: IUser = await this.authService.logout(userData);

      res.setHeader("Set-Cookie", ["Authorization=; Max-age=0"]);
      res
        .status(EHttpStatusCodes.OK)
        .json({ data: logOutUserData, message: "logout" });
    } catch (error) {
      next(error);
    }
  };

  public refreshToken = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const refreshTokenInputData: IRefreshTokenInput = req.body;
      const refreshTokenOutputData: IRefreshTokenOutput =
        await this.authService.refreshToken(refreshTokenInputData);
      res.status(EHttpStatusCodes.OK).send({
        message: ApiResponseMessages.SUCCESS,
        data: refreshTokenOutputData,
      });
    } catch (error) {
      next(error);
    }
  };

  public test = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.log(req);
      res
        .status(EHttpStatusCodes.OK)
        .send({ message: ApiResponseMessages.SUCCESS });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
