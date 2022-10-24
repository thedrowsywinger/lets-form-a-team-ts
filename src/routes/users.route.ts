import { Router } from "express";
import UsersController from "@controllers/users.controller";
import { UpdateUserDto } from "@dtos/users.dto";
import { Routes } from "@interfaces/routes.interface";
import validationMiddleware from "@middlewares/validation.middleware";
import { ApiRoutes } from "@/utils/apiRoutes";
import authMiddleware from "@/middlewares/auth.middleware";

class UsersRoute implements Routes {
  public path = ApiRoutes.API;
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}${ApiRoutes.GET_USERS}`,
      authMiddleware,
      this.usersController.getUsers,
    );
    this.router.get(
      `${this.path}${ApiRoutes.GET_USER_BY_ID}`,
      authMiddleware,
      this.usersController.getUserById,
    );
    this.router.delete(
      `${this.path}/users/delete:id(\\d+)`,
      authMiddleware,
      this.usersController.deleteUser,
    );
    this.router.post(
      `${this.path}${ApiRoutes.UPDATE_USER}`,
      authMiddleware,
      validationMiddleware(UpdateUserDto, "body"),
      this.usersController.editUser,
    );
  }
}

export default UsersRoute;
