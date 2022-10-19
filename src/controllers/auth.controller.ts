import { NextFunction, Request, Response } from "express";
import { CreateUserDto, LoginUserDto } from "@dtos/users.dto";
import { IUser } from "@interfaces/users.interface";
import { RequestWithUser } from "@interfaces/auth.interface";
import AuthService from "@services/auth.service";
import { EHttpStatusCodes } from "@/common";
import { ApiResponseMessages } from "@/utils/apiResponseMessages";

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const signUpUserData: IUser = await this.authService.signup(userData);

      res.status(201).json({ data: signUpUserData, message: "signup" });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: LoginUserDto = req.body;
      const { userId, userTypeId } = await this.authService.login(userData);

      req["userId"] = userId;
      req["userTypeId"] = userTypeId;
      res
        .status(EHttpStatusCodes.OK)
        .send({ message: ApiResponseMessages.SUCCESS });
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
}

export default AuthController;
