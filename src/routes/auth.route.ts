import { Router } from "express";
import AuthController from "@controllers/auth.controller";
import { CreateUserDto, LoginUserDto, RefreshTokenDto } from "@dtos/users.dto";
import { Routes } from "@interfaces/routes.interface";
import authMiddleware from "@middlewares/auth.middleware";
import validationMiddleware from "@middlewares/validation.middleware";
import { ApiRoutes } from "@/utils/apiRoutes";

class AuthRoute implements Routes {
  public path = ApiRoutes.API;
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}${ApiRoutes.REGISTER_USER}`,
      authMiddleware,
      validationMiddleware(CreateUserDto, "body"),
      this.authController.signUp,
    );
    this.router.post(
      `${this.path}${ApiRoutes.LOGIN}`,
      validationMiddleware(LoginUserDto, "body"),
      this.authController.logIn,
    );
    this.router.post(
      `${this.path}${ApiRoutes.REFRESH_ACCESS_TOKEN}`,
      validationMiddleware(RefreshTokenDto, "body"),
      this.authController.refreshToken,
    );
    this.router.post(
      `${this.path}logout`,
      authMiddleware,
      this.authController.logOut,
    );
    this.router.post(
      `${this.path}/test/`,
      authMiddleware,
      this.authController.test,
    );
  }
}

export default AuthRoute;
